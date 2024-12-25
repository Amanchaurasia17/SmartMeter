import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bell, Zap, Settings } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Alerts', icon: Bell, path: '/alerts' },
    { name: 'Components', icon: Zap, path: '/components' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="bg-white w-64 shadow-md flex flex-col">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800">Energy Monitor</h2>
      </div>
      <nav className="flex-1 px-2 py-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                location.pathname === link.path
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;