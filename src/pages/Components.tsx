import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { usePowerData } from '../hooks/usePowerData';
import { PowerComponent } from '../components/PowerComponent';
import { AddComponentModal } from '../components/AddComponentModal';
import { componentStore } from '../services/componentStore';

const Components = () => {
  const { components, toggleComponent } = usePowerData();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      componentStore.deleteComponent(id);
    }
  };

  const handleSetTimer = (id: string, minutes: number) => {
    componentStore.setAutoOffTimer(id, minutes);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Power Components</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Component
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {components.map((component) => (
          <PowerComponent
            key={component.id}
            component={component}
            onToggle={toggleComponent}
            onSetTimer={handleSetTimer}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showAddModal && (
        <AddComponentModal
          onClose={() => setShowAddModal(false)}
          onAdd={(component) => componentStore.addComponent(component)}
        />
      )}
    </div>
  );
};

export default Components;