'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Shield, Users } from 'lucide-react';
import UserManagement from './settings/UserManagement';
import RoleManagement from './settings/RoleManagement';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    { 
      name: 'User Management', 
      component: UserManagement,
      icon: Users,
      description: 'Manage system users and their access'
    },
    { 
      name: 'Role Management', 
      component: RoleManagement,
      icon: Shield,
      description: 'Configure roles and permissions'
    },
  ];

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600 text-lg">Manage your application settings and configurations</p>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-100 bg-white/50 px-6 pt-6">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 bg-gray-50/80 rounded-2xl p-2 backdrop-blur-sm">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(index)}
                    className={classNames(
                      'flex items-center justify-center sm:justify-start space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                      'w-full sm:flex-1',
                      activeTab === index
                        ? 'bg-white text-blue-700 shadow-lg shadow-blue-100/50 transform scale-[1.02]'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-white/60 hover:shadow-md'
                    )}
                  >
                    <Icon className={classNames(
                      'w-5 h-5 transition-colors duration-200',
                      activeTab === index ? 'text-blue-600' : 'text-gray-400'
                    )} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
}