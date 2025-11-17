import React, { useState, useEffect } from 'react';
import { PowerOff, Power, Clock, Timer, Trash2 } from 'lucide-react';
import type { PowerComponent as PowerComponentType } from '../types/power';

interface Props {
  component: PowerComponentType;
  onToggle: (id: string) => void;
  onSetTimer: (id: string, minutes: number) => void;
  onDelete: (id: string) => void;
}

export const PowerComponent: React.FC<Props> = ({ component, onToggle, onSetTimer, onDelete }) => {
  const { id, name, isOn, currentUsage, location, onSince, autoOffTimer } = component;
  const [showTimerInput, setShowTimerInput] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState('');
  const [runtime, setRuntime] = useState('');

  useEffect(() => {
    if (isOn && onSince) {
      const interval = setInterval(() => {
        const now = new Date();
        const diffMs = now.getTime() - onSince.getTime();
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        const seconds = Math.floor((diffMs % 60000) / 1000);
        
        if (hours > 0) {
          setRuntime(`${hours}h ${minutes}m`);
        } else if (minutes > 0) {
          setRuntime(`${minutes}m ${seconds}s`);
        } else {
          setRuntime(`${seconds}s`);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      setRuntime('');
    }
  }, [isOn, onSince]);

  const handleSetTimer = () => {
    const minutes = parseInt(timerMinutes);
    if (minutes > 0) {
      onSetTimer(id, minutes);
      setShowTimerInput(false);
      setTimerMinutes('');
    }
  };

  const handleCancelTimer = () => {
    onSetTimer(id, 0);
  };

  const getTimeRemaining = () => {
    if (!autoOffTimer || !onSince) return '';
    const now = new Date();
    const minutesOn = (now.getTime() - onSince.getTime()) / 60000;
    const remaining = autoOffTimer - minutesOn;
    if (remaining <= 0) return 'Turning off...';
    
    const mins = Math.floor(remaining);
    const secs = Math.floor((remaining % 1) * 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500 mt-1">{location}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onDelete(id)}
              className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
              title="Delete component"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            {isOn && (
              <button
                onClick={() => setShowTimerInput(!showTimerInput)}
                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                title="Set auto-off timer"
              >
                <Timer className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => onToggle(id)}
              className={`p-2 rounded-lg transition-all ${
                isOn 
                  ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
              title={isOn ? 'Turn off' : 'Turn on'}
            >
              {isOn ? <Power className="h-6 w-6" /> : <PowerOff className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {showTimerInput && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-off timer (minutes)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(e.target.value)}
                placeholder="e.g., 30"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSetTimer}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Set
              </button>
              <button
                onClick={() => setShowTimerInput(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isOn && autoOffTimer && (
          <div className="mb-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="flex items-center text-sm text-yellow-800">
              <Clock className="h-4 w-4 mr-2" />
              <span className="font-medium">Auto-off in: {getTimeRemaining()}</span>
              <button
                onClick={handleCancelTimer}
                className="ml-auto text-xs text-yellow-600 hover:text-yellow-800 underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isOn && runtime && (
          <div className="mb-3 flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>Running for: <span className="font-semibold">{runtime}</span></span>
          </div>
        )}
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Current Usage</p>
            <p className="text-2xl font-bold text-blue-600">
              {isOn ? currentUsage.toFixed(2) : '0.00'} kWh
            </p>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isOn ? 'bg-blue-600' : 'bg-gray-400'
              }`}
              style={{ 
                width: isOn ? `${Math.min((currentUsage / component.baseUsage) * 50, 100)}%` : '0%'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};