import { BehaviorSubject } from 'rxjs';

export interface Settings {
  notifications: boolean;
  emailAlerts: boolean;
  currency: string;
  ratePerKwh: number;
  theme: 'light' | 'dark' | 'system';
  updateInterval: number;
}

const defaultSettings: Settings = {
  notifications: true,
  emailAlerts: true,
  currency: 'INR',
  ratePerKwh: 8.50, // Realistic Indian electricity rate
  theme: 'light',
  updateInterval: 5 // Update every 5 seconds
};

// Load settings from localStorage or use defaults
const loadSettings = (): Settings => {
  try {
    const saved = localStorage.getItem('powerMonitorSettings');
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
};

class SettingsStore {
  private settings = new BehaviorSubject<Settings>(loadSettings());

  getSettings() {
    return this.settings.asObservable();
  }

  getCurrentSettings() {
    return this.settings.getValue();
  }

  updateSettings(newSettings: Partial<Settings>) {
    const updated = {
      ...this.settings.getValue(),
      ...newSettings
    };
    this.settings.next(updated);
    
    // Persist to localStorage
    try {
      localStorage.setItem('powerMonitorSettings', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }
}

export const settingsStore = new SettingsStore();