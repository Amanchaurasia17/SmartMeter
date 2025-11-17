import { useState, useEffect } from 'react';
import { powerSimulation } from '../services/powerSimulation';
import { componentStore } from '../services/componentStore';
import type { PowerData, PowerComponent } from '../types/power';

export function usePowerData() {
  const [currentUsage, setCurrentUsage] = useState<number>(0);
  const [history, setHistory] = useState<PowerData[]>([]);
  const [components, setComponents] = useState<PowerComponent[]>([]);

  useEffect(() => {
    // Subscribe to component updates
    const componentSub = componentStore.getComponents().subscribe(setComponents);
    
    // Start and subscribe to power simulation
    powerSimulation.startSimulation();
    const powerSub = powerSimulation.subscribe((data) => {
      setCurrentUsage(data.totalUsage);
      setHistory(prev => [...prev.slice(-29), data]); // Keep last 30 data points
    });

    return () => {
      componentSub.unsubscribe();
      powerSub.unsubscribe();
    };
  }, []);

  const toggleComponent = (id: string) => {
    componentStore.toggleComponent(id);
  };

  return { 
    currentUsage, 
    history, 
    components,
    toggleComponent 
  };
}