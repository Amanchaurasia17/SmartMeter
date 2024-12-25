import React, { useState } from 'react';
import { Bell, Plus, X } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'usage', threshold: 8, unit: 'kWh', active: true },
    { id: 2, type: 'cost', threshold: 150, unit: '$', active: true },
  ]);

  const [showNewAlert, setShowNewAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({ type: 'usage', threshold: '', unit: 'kWh' });

  const handleAddAlert = () => {
    if (newAlert.threshold) {
      setAlerts([
        ...alerts,
        {
          id: alerts.length + 1,
          ...newAlert,
          threshold: Number(newAlert.threshold),
          active: true,
        },
      ]);
      setShowNewAlert(false);
      setNewAlert({ type: 'usage', threshold: '', unit: 'kWh' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Custom Alerts</h2>
        <button
          onClick={() => setShowNewAlert(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Alert
        </button>
      </div>

      <div className="grid gap-6">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between"
          >
            <div className="flex items-center">
              <Bell className="h-6 w-6 text-blue-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {alert.type === 'usage' ? 'Power Usage Alert' : 'Cost Alert'}
                </h3>
                <p className="text-gray-600">
                  Threshold: {alert.threshold} {alert.unit}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={alert.active}
                    onChange={() =>
                      setAlerts(
                        alerts.map((a) =>
                          a.id === alert.id ? { ...a, active: !a.active } : a
                        )
                      )
                    }
                  />
                  <div className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner ${
                    alert.active ? 'bg-blue-600' : ''
                  }`}></div>
                  <div className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    alert.active ? 'translate-x-5' : 'translate-x-1'
                  } top-1`}></div>
                </div>
              </label>
              <button
                onClick={() => setAlerts(alerts.filter((a) => a.id !== alert.id))}
                className="text-gray-400 hover:text-red-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showNewAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">New Alert</h3>
              <button
                onClick={() => setShowNewAlert(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert Type
                </label>
                <select
                  value={newAlert.type}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      type: e.target.value,
                      unit: e.target.value === 'usage' ? 'kWh' : '$',
                    })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="usage">Power Usage</option>
                  <option value="cost">Cost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Threshold ({newAlert.unit})
                </label>
                <input
                  type="number"
                  value={newAlert.threshold}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, threshold: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder={`Enter threshold in ${newAlert.unit}`}
                />
              </div>
              <button
                onClick={handleAddAlert}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;