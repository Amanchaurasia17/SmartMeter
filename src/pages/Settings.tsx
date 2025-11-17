import React, { useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const [saved, setSaved] = React.useState(false);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else if (settings.theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Notifications
          </h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSettings({ notifications: e.target.checked })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Enable push notifications</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={(e) => updateSettings({ emailAlerts: e.target.checked })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Enable email alerts</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Power Usage Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-2">
                Rate per kWh (₹)
              </label>
              <input
                id="rate"
                type="number"
                value={settings.ratePerKwh}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    updateSettings({ ratePerKwh: value });
                  }
                }}
                step="0.50"
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="8.50"
              />
              <p className="text-xs text-gray-500 mt-1">Current rate: ₹{settings.ratePerKwh.toFixed(2)} per kWh</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Display Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                id="theme"
                value={settings.theme}
                onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' | 'system' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">System Default</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Choose your preferred color theme</p>
            </div>
            <div>
              <label htmlFor="interval" className="block text-sm font-medium text-gray-700 mb-2">
                Update Interval (seconds)
              </label>
              <input
                id="interval"
                type="number"
                value={settings.updateInterval}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 1 && value <= 60) {
                    updateSettings({ updateInterval: value });
                  }
                }}
                min="1"
                max="60"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5"
              />
              <p className="text-xs text-gray-500 mt-1">
                Data refreshes every {settings.updateInterval} second{settings.updateInterval !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <button
            onClick={handleSave}
            className={`w-full flex justify-center items-center px-4 py-3 rounded-lg text-sm font-medium text-white transition-all ${
              saved 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {saved ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Settings Saved Successfully!
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Settings
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Settings are automatically saved as you make changes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;