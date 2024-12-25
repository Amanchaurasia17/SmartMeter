import { BehaviorSubject } from 'rxjs';
import type { PowerComponent } from '../types/power';

const initialComponents: PowerComponent[] = [
  {
    id: 'ac',
    name: 'Air Conditioning',
    isOn: false,
    baseUsage: 2.5,
    currentUsage: 0,
    location: 'Living Room'
  },
  {
    id: 'heater',
    name: 'Water Heater',
    isOn: false,
    baseUsage: 1.5,
    currentUsage: 0,
    location: 'Bathroom'
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    isOn: true,
    baseUsage: 0.8,
    currentUsage: 0,
    location: 'Kitchen'
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
      isOn: false
    };
    
    const updated = [...this.components.getValue(), newComponent];
    this.components.next(updated);
  }

  deleteComponent(id: string) {
    const updated = this.components.getValue().filter(component => component.id !== id);
    this.components.next(updated);
  }

  toggleComponent(id: string) {
    const updated = this.components.getValue().map(component =>
      component.id === id ? { ...component, isOn: !component.isOn } : component
    );
    this.components.next(updated);
  }

  updateUsage(id: string, usage: number) {
    const updated = this.components.getValue().map(component =>
      component.id === id ? { ...component, currentUsage: usage } : component
    );
    this.components.next(updated);
  }
}

export const componentStore = new ComponentStore();