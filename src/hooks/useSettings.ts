import { useState, useEffect } from 'react';
import { settingsStore, type Settings } from '../stores/settingsStore';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(settingsStore.getCurrentSettings());

  useEffect(() => {
    const subscription = settingsStore.getSettings().subscribe(setSettings);
    return () => subscription.unsubscribe();
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    settingsStore.updateSettings(newSettings);
  };

  return { settings, updateSettings };
}