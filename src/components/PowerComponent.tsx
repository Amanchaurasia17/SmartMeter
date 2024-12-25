import React from 'react';
import { PowerOff, Power } from 'lucide-react';
import type { PowerComponent as PowerComponentType } from '../types/power';

interface Props {
  component: PowerComponentType;
  onToggle: (id: string) => void;
}

export const PowerComponent: React.FC<Props> = ({ component, onToggle }) => {
  const { id, name, isOn, currentUsage, location } = component;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
          <div className="flex items-center space-x-6"> {/* Added space-x-6 for spacing */}
            <button
              onClick={() => onToggle(id)}
              className={`p-2 rounded-full ${
                isOn ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              } hover:bg-opacity-80 transition-colors`}
            >
              {isOn ? <Power className="h-6 w-6" /> : <PowerOff className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Current Usage</p>
            <p className="text-2xl font-bold text-blue-600">
              {isOn ? currentUsage.toFixed(2) : '0.00'} kWh
            </p>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                isOn ? 'bg-blue-600' : 'bg-gray-400'
              }`}
              style={{ 
                width: isOn ? `${(currentUsage / component.baseUsage) * 50}%` : '0%',
                transition: 'width 0.5s ease-in-out' 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};