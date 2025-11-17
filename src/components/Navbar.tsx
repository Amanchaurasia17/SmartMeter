import React, { useState, useEffect, useRef } from 'react';
import { Bell, Settings, User, X, Trash2, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationStore, type Notification } from '../stores/notificationStore';

const Navbar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const subscription = notificationStore.getNotifications().subscribe((notifs) => {
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleNotificationClick = (notif: Notification) => {
    if (!notif.read) {
      notificationStore.markAsRead(notif.id);
    }
  };

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">Power Monitor</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[500px] overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Notifications {unreadCount > 0 && `(${unreadCount})`}
                    </h3>
                    <div className="flex gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={() => notificationStore.markAllAsRead()}
                          className="text-xs text-blue-600 hover:text-blue-800"
                          title="Mark all as read"
                        >
                          <CheckCheck className="h-4 w-4" />
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={() => notificationStore.clearAll()}
                          className="text-xs text-red-600 hover:text-red-800"
                          title="Clear all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-y-auto max-h-96">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{getNotificationIcon(notif.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className={`text-sm font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notif.title}
                                </h4>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    notificationStore.deleteNotification(notif.id);
                                  }}
                                  className="text-gray-400 hover:text-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-400">{formatTimestamp(notif.timestamp)}</span>
                                {!notif.read && (
                                  <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Settings"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Profile"
            >
              <User className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;