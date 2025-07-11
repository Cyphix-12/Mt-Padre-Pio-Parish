import { supabase } from './supabase';

export const TOKEN_KEY = 'auth_token';

// Store auth token in localStorage
export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Retrieve auth token from localStorage
export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

// Remove auth token from localStorage
export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Define types for role permissions
type Permission = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

type RolePermissions = {
  [resource: string]: Permission;
};

type UserRole = {
  role_name: string;
  role_permissions: RolePermissions;
};

// Fetch user role and permissions from Supabase
export async function getUserRole(): Promise<UserRole | null> {
  try {
    // Get current session
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log('No user found in session');
      return null;
    }

    const { data: userRole, error } = await supabase
      .from('user_with_role')
      .select('role_name, role_permissions')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching role:', error);
      return null;
    }

    return userRole;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}

// Check if user has a specific permission and action
export async function checkPermission(
  permission: string,
  action: 'create' | 'read' | 'update' | 'delete'
): Promise<boolean> {
  const role = await getUserRole();
  if (!role) return false;

  return role.role_permissions?.[permission]?.[action] || false;
}
