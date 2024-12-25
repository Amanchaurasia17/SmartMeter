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
  ratePerKwh: 8,
  theme: 'light',
  updateInterval: 5
};

class SettingsStore {
  private settings = new BehaviorSubject<Settings>(defaultSettings);

  getSettings() {
    return this.settings.asObservable();
  }

  getCurrentSettings() {
    return this.settings.getValue();
  }

  updateSettings(newSettings: Partial<Settings>) {
    this.settings.next({
      ...this.settings.getValue(),
      ...newSettings
    });
  }
}

export const settingsStore = new SettingsStore();