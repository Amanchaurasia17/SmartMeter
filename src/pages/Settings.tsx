import React from 'react';
import { Save } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const Settings = () => {
  const { settings, updateSettings } = useSettings();

  const handleSave = () => {
    // Settings are already saved in real-time
    alert('Settings saved successfully!');
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate per kWh (₹)
              </label>
              <input
                type="number"
                value={settings.ratePerKwh}
                onChange={(e) => updateSettings({ ratePerKwh: parseFloat(e.target.value) || 0 })}
                step="0.01"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Display Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' | 'system' })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Interval (seconds)
              </label>
              <input
                type="number"
                value={settings.updateInterval}
                onChange={(e) => updateSettings({ updateInterval: parseInt(e.target.value) || 5 })}
                min="1"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;