'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  created_at: string;
  role?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  async function fetchUsers() {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/list-users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const { users } = await response.json();

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id, roles (name)')
        .order('user_id');

     const usersWithRoles = users.map((user: any) => ({
  ...user,
  role: userRoles?.find(ur => ur.user_id === user.id)?.roles?.[0]?.name
}));



      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
    }
  }

  async function fetchRoles() {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      await fetchUsers();
      setNewUserEmail('');
      setNewUserPassword('');
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error instanceof Error ? error.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch('/api/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }

      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete user');
    }
  }

  async function handleRoleChange(userId: string, roleId: string) {
    try {
      const response = await fetch('/api/update-user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, roleId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update user role');
      }

      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      setError(error instanceof Error ? error.message : 'Failed to update role');
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-accent">User Management</h3>
        <p className="text-sm text-gray-500">Manage system users and their roles</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleCreateUser} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="Email address"
            required
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
          />
          <input
            type="password"
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
            placeholder="Password"
            required
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
        >
          <PlusIcon className="w-5 h-5" />
          Add User
        </button>
      </form>

      <div className="mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <select
                    value={roles.find(r => r.name === user.role)?.id || ''}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="rounded-lg border border-gray-300 px-2 py-1"
                  >
                    <option value="">No Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
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
