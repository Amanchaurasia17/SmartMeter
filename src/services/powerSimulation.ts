import { Subject } from 'rxjs';
import { componentStore } from './componentStore';
import { settingsStore } from '../stores/settingsStore';
import { notificationStore } from '../stores/notificationStore';
import type { PowerData } from '../types/power';

class PowerSimulationService {
  private powerSubject = new Subject<PowerData>();
  private simulationInterval: NodeJS.Timeout | null = null;
  private previousUsage: Map<string, number> = new Map();
  private lastHighUsageAlert: number = 0;
  private lastComponentAlert: Map<string, number> = new Map();
  
  // More realistic time-of-day consumption patterns
  private timeOfDayFactors = {
    earlyMorning: 0.6,   // 5-7 AM: Light activity
    morning: 1.2,        // 7-9 AM: Getting ready
    midDay: 0.9,         // 9 AM-5 PM: Lower usage
    evening: 1.6,        // 5-8 PM: Peak usage
    night: 1.1,          // 8-11 PM: Moderate usage
    lateNight: 0.4,      // 11 PM-5 AM: Minimal usage
  };

  startSimulation() {
    // Clear any existing interval
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }

    const runSimulation = () => {
      const settings = settingsStore.getCurrentSettings();
      const intervalMs = settings.updateInterval * 1000;
      
      this.simulationInterval = setInterval(() => {
        const data = this.generatePowerData();
        this.powerSubject.next(data);
        
        // Check auto-off timers every update
        componentStore.checkAutoOffTimers();
      }, intervalMs);
    };

    // Generate initial data immediately
    const initialData = this.generatePowerData();
    this.powerSubject.next(initialData);
    
    // Start with current interval
    runSimulation();
    
    // Subscribe to settings changes to update interval
    settingsStore.getSettings().subscribe(() => {
      if (this.simulationInterval) {
        clearInterval(this.simulationInterval);
        runSimulation();
      }
    });
  }

  subscribe(callback: (data: PowerData) => void) {
    return this.powerSubject.subscribe(callback);
  }

  private generatePowerData(): PowerData {
    const now = new Date();
    const hour = now.getHours();
    
    // Determine realistic time of day factor with smooth transitions
    let factor = this.timeOfDayFactors.lateNight;
    if (hour >= 5 && hour < 7) factor = this.timeOfDayFactors.earlyMorning;
    else if (hour >= 7 && hour < 9) factor = this.timeOfDayFactors.morning;
    else if (hour >= 9 && hour < 17) factor = this.timeOfDayFactors.midDay;
    else if (hour >= 17 && hour < 20) factor = this.timeOfDayFactors.evening;
    else if (hour >= 20 && hour < 23) factor = this.timeOfDayFactors.night;

    const components = componentStore.getCurrentComponents().map(component => {
      if (!component.isOn) {
        this.previousUsage.set(component.id, 0);
        componentStore.updateUsage(component.id, 0);
        return { ...component, currentUsage: 0 };
      }

      // Realistic variation based on appliance type
      const variation = 0.92 + Math.random() * 0.16; // Range: 0.92-1.08 for stability
      let targetUsage = component.baseUsage * factor * variation;
      
      // Smooth transitions: gradually change from previous usage
      const prevUsage = this.previousUsage.get(component.id) || targetUsage;
      const smoothingFactor = 0.7; // 70% new, 30% old for smooth transitions
      const usage = prevUsage * (1 - smoothingFactor) + targetUsage * smoothingFactor;
      
      this.previousUsage.set(component.id, usage);
      componentStore.updateUsage(component.id, usage);
      
      return { ...component, currentUsage: usage };
    });

    const totalUsage = components.reduce((sum, comp) => sum + comp.currentUsage, 0);

    // Generate notifications based on usage
    this.checkUsageAlerts(totalUsage, components);

    return {
      timestamp: now,
      totalUsage,
      components
    };
  }

  private checkUsageAlerts(totalUsage: number, components: any[]) {
    const now = Date.now();
    const settings = settingsStore.getCurrentSettings();
    
    // Check if notifications are enabled
    if (!settings.notifications) return;

    // High total usage alert (throttled to once per 5 minutes)
    if (totalUsage > 3.5 && now - this.lastHighUsageAlert > 300000) {
      const cost = (totalUsage * settings.ratePerKwh).toFixed(2);
      notificationStore.addNotification({
        type: 'warning',
        title: 'High Power Usage',
        message: `Total usage is ${totalUsage.toFixed(2)} kWh (₹${cost}/hr). Consider turning off unused appliances.`
      });
      this.lastHighUsageAlert = now;
    }

    // Individual component alerts (throttled to once per 10 minutes per component)
    components.forEach(comp => {
      if (comp.isOn && comp.currentUsage > 1.8) {
        const lastAlert = this.lastComponentAlert.get(comp.id) || 0;
        if (now - lastAlert > 600000) {
          const cost = (comp.currentUsage * settings.ratePerKwh).toFixed(2);
          notificationStore.addNotification({
            type: 'warning',
            title: `High ${comp.name} Usage`,
            message: `${comp.name} is consuming ${comp.currentUsage.toFixed(2)} kWh (₹${cost}/hr) in ${comp.location}.`
          });
          this.lastComponentAlert.set(comp.id, now);
        }
      }
    });
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }
}

export const powerSimulation = new PowerSimulationService();