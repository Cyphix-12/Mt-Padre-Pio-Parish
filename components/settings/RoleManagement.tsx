'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, Record<string, boolean>>;
}

type Permission = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

type RolePermissions = {
  [resource: string]: Permission;
};

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultPermissions: RolePermissions = {
    users: { create: false, read: false, update: false, delete: false },
    roles: { create: false, read: false, update: false, delete: false },
    members: { create: false, read: false, update: false, delete: false }
  };

  const [newRolePermissions, setNewRolePermissions] = useState<RolePermissions>(defaultPermissions);

  useEffect(() => {
    fetchRoles();
  }, []);

  async function fetchRoles() {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('id, name, description, permissions')
        .order('name');

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch roles');
    }
  }

  async function handleCreateRole(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('roles').insert({
        name: newRoleName,
        description: newRoleDescription,
        permissions: newRolePermissions
      });

      if (error) throw error;

      await fetchRoles();
      setNewRoleName('');
      setNewRoleDescription('');
      setNewRolePermissions(defaultPermissions);
    } catch (error) {
      console.error('Error creating role:', error);
      setError(error instanceof Error ? error.message : 'Failed to create role');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteRole(roleId: string) {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      const { error } = await supabase.from('roles').delete().eq('id', roleId);
      if (error) throw error;
      await fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete role');
    }
  }

  function handlePermissionChange(resource: string, action: string, checked: boolean) {
    setNewRolePermissions(prev => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        [action]: checked
      }
    }));
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-accent">Role Management</h3>
        <p className="text-sm text-gray-500">Manage user roles and permissions</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleCreateRole} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Role name"
            required
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
          />
          <input
            type="text"
            value={newRoleDescription}
            onChange={(e) => setNewRoleDescription(e.target.value)}
            placeholder="Role description"
            required
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Permissions</h4>
          {Object.entries(newRolePermissions).map(([resource, actions]) => (
            <div key={resource} className="space-y-2">
              <h5 className="text-sm font-medium text-gray-600 capitalize">{resource}</h5>
              <div className="flex gap-4">
                {Object.entries(actions).map(([action, value]) => (
                  <label key={action} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handlePermissionChange(resource, action, e.target.checked)}
                      className="rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-gray-600 capitalize">{action}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
        >
          <PlusIcon className="w-5 h-5" />
          Add Role
        </button>
      </form>

      <div className="mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((role) => (
              <tr key={role.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {role.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {role.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
