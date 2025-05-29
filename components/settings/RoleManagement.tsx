'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/utils/supabase';

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
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-purple-600">Total Roles</h3>
              <p className="text-2xl font-bold text-purple-900 mt-1">{roles.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
              <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-indigo-600">Active Permissions</h3>
              <p className="text-2xl font-bold text-indigo-900 mt-1">
                {roles.reduce((sum, role) => {
                  return sum + Object.values(role.permissions).reduce((count, resource) => {
                    return count + Object.values(resource).filter(Boolean).length;
                  }, 0);
                }, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-200 rounded-xl flex items-center justify-center">
              <LockClosedIcon className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Role Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add New Role</h3>
        </div>

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
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <PlusIcon className="w-5 h-5" />
            {loading ? 'Adding...' : 'Add Role'}
          </button>
        </form>
      </div>

      {/* Roles List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Existing Roles</h3>
        </div>
        
        {roles.length > 0 ? (
          <div className="overflow-x-auto">
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
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {role.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {role.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete role"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            No roles created yet. Add your first role above.
          </div>
        )}
      </div>
    </div>
  );
}