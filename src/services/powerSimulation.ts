import { Subject } from 'rxjs';
import { componentStore } from './componentStore';
import { settingsStore } from '../stores/settingsStore';
import type { PowerData } from '../types/power';

class PowerSimulationService {
  private powerSubject = new Subject<PowerData>();
  private simulationInterval: NodeJS.Timeout | null = null;
  private timeOfDayFactors = {
    morning: 1.2,
    day: 1.5,
    evening: 1.8,
    night: 0.8,
  };

  startSimulation() {
    // Clear any existing interval
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }

    // Start new interval with 10 seconds
    this.simulationInterval = setInterval(() => {
      const data = this.generatePowerData();
      this.powerSubject.next(data);
    }, 3000); // 10 seconds

    // Generate initial data immediately
    const initialData = this.generatePowerData();
    this.powerSubject.next(initialData);
  }

  subscribe(callback: (data: PowerData) => void) {
    return this.powerSubject.subscribe(callback);
  }

  private generatePowerData(): PowerData {
    const now = new Date();
    const hour = now.getHours();
    
    // Determine time of day factor
    let factor = this.timeOfDayFactors.night;
    if (hour >= 6 && hour < 12) factor = this.timeOfDayFactors.morning;
    else if (hour >= 12 && hour < 17) factor = this.timeOfDayFactors.day;
    else if (hour >= 17 && hour < 22) factor = this.timeOfDayFactors.evening;

    const components = componentStore.getCurrentComponents().map(component => {
      if (!component.isOn) {
        componentStore.updateUsage(component.id, 0);
        return { ...component, currentUsage: 0 };
      }

      // Add smaller random variation for stability
      const variation = 0.9 + Math.random() * 0.2; // Reduced range: 0.9-1.1
      const usage = component.baseUsage * factor * variation;
      componentStore.updateUsage(component.id, usage);
      
      return { ...component, currentUsage: usage };
    });

    const totalUsage = components.reduce((sum, comp) => sum + comp.currentUsage, 0);

    return {
      timestamp: now,
      totalUsage,
      components
    };
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }
}

export const powerSimulation = new PowerSimulationService();