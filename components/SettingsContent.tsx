'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import UserManagement from './settings/UserManagement';
import RoleManagement from './settings/RoleManagement';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SettingsContent() {
  const tabs = [
    { name: 'User Management', component: UserManagement },
    { name: 'Role Management', component: RoleManagement },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-accent shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-accent'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white',
                'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
              )}
            >
              <tab.component />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}