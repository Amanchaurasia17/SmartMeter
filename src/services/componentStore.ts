import { BehaviorSubject } from 'rxjs';
import type { PowerComponent } from '../types/power';
import { notificationStore } from '../stores/notificationStore';

const initialComponents: PowerComponent[] = [
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    isOn: true,
    baseUsage: 0.15,
    currentUsage: 0,
    location: 'Kitchen',
    onSince: new Date(),
    autoOffTimer: undefined
  },
  {
    id: 'ac',
    name: 'Air Conditioner',
    isOn: true, // On by default for demo
    baseUsage: 1.8,
    currentUsage: 0,
    location: 'Living Room',
    onSince: new Date(),
    autoOffTimer: undefined
  },
  {
    id: 'water-heater',
    name: 'Water Heater',
    isOn: false,
    baseUsage: 2.2,
    currentUsage: 0,
    location: 'Bathroom',
    onSince: undefined,
    autoOffTimer: undefined
  },
  {
    id: 'washing-machine',
    name: 'Washing Machine',
    isOn: false,
    baseUsage: 1.5,
    currentUsage: 0,
    location: 'Laundry Room',
    onSince: undefined,
    autoOffTimer: undefined
  },
  {
    id: 'led-lights',
    name: 'LED Lights',
    isOn: true,
    baseUsage: 0.06,
    currentUsage: 0,
    location: 'Whole House',
    onSince: new Date(),
    autoOffTimer: undefined
  },
  {
    id: 'tv',
    name: 'Smart TV',
    isOn: true, // On by default for demo
    baseUsage: 0.12,
    currentUsage: 0,
    location: 'Living Room',
    onSince: new Date(),
    autoOffTimer: undefined
  },
  {
    id: 'microwave',
    name: 'Microwave',
    isOn: false,
    baseUsage: 1.2,
    currentUsage: 0,
    location: 'Kitchen',
    onSince: undefined,
    autoOffTimer: undefined
  },
  {
    id: 'ceiling-fan',
    name: 'Ceiling Fans',
    isOn: true, // On by default for demo
    baseUsage: 0.075,
    currentUsage: 0,
    location: 'Bedrooms',
    onSince: new Date(),
    autoOffTimer: undefined
  }
];

class ComponentStore {
  private components = new BehaviorSubject<PowerComponent[]>(initialComponents);

  getComponents() {
    return this.components.asObservable();
  }

  getCurrentComponents() {
    return this.components.getValue();
  }

  addComponent(component: Omit<PowerComponent, 'id' | 'currentUsage' | 'isOn'>) {
    const newComponent: PowerComponent = {
      ...component,
      id: crypto.randomUUID(),
      currentUsage: 0,
      isOn: false,
      onSince: undefined,
      autoOffTimer: undefined
    };
    
    const updated = [...this.components.getValue(), newComponent];
    this.components.next(updated);
  }

  deleteComponent(id: string) {
    const updated = this.components.getValue().filter(component => component.id !== id);
    this.components.next(updated);
  }

  toggleComponent(id: string) {
    const updated = this.components.getValue().map(component => {
      if (component.id === id) {
        const newIsOn = !component.isOn;
        return { 
          ...component, 
          isOn: newIsOn,
          onSince: newIsOn ? new Date() : undefined,
          autoOffTimer: newIsOn ? component.autoOffTimer : undefined
        };
      }
      return component;
    });
    this.components.next(updated);
  }

  updateUsage(id: string, usage: number) {
    const updated = this.components.getValue().map(component =>
      component.id === id ? { ...component, currentUsage: usage } : component
    );
    this.components.next(updated);
  }

  setAutoOffTimer(id: string, minutes: number) {
    const updated = this.components.getValue().map(component =>
      component.id === id ? { ...component, autoOffTimer: minutes > 0 ? minutes : undefined } : component
    );
    this.components.next(updated);
  }

  checkAutoOffTimers() {
    const now = new Date();
    const updated = this.components.getValue().map(component => {
      if (component.isOn && component.autoOffTimer && component.onSince) {
        const minutesOn = (now.getTime() - component.onSince.getTime()) / 60000;
        if (minutesOn >= component.autoOffTimer) {
          // Send notification when auto-off timer completes
          notificationStore.addNotification({
            type: 'info',
            title: 'Auto-Off Timer Complete',
            message: `${component.name} in ${component.location} has been automatically turned off.`
          });
          
          return { 
            ...component, 
            isOn: false, 
            onSince: undefined,
            autoOffTimer: undefined,
            currentUsage: 0
          };
        }
      }
      return component;
    });
    this.components.next(updated);
  }
}

export const componentStore = new ComponentStore();