import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { PowerComponent } from '../types/power';

interface Props {
  onClose: () => void;
  onAdd: (component: Omit<PowerComponent, 'id' | 'currentUsage' | 'isOn'>) => void;
}

export const AddComponentModal: React.FC<Props> = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    location: '',
    baseUsage: '', // Changed to string to properly handle input state
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: form.name,
      location: form.location,
      baseUsage: parseFloat(form.baseUsage) || 0, // Convert to number on submit
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add New Component</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Component Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Air Conditioner"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Living Room"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Usage (kWh)
            </label>
            <input
              type="number"
              required
              step="0.1"
              min="0"
              value={form.baseUsage}
              onChange={(e) => setForm({ ...form, baseUsage: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., 1.5"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Add Component
          </button>
        </form>
      </div>
    </div>
  );
};