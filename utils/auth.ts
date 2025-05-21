import { supabase } from './supabase';

export const TOKEN_KEY = 'auth_token';
export const ADMIN_ROLE = 'Admin';
export const USER_ROLE_KEY = 'user_role';

// Store auth token in localStorage
export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Store user role in localStorage
export function setUserRole(role: string) {
  localStorage.setItem(USER_ROLE_KEY, role);
}

// Get user role from localStorage
export function getUserRoleFromStorage(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(USER_ROLE_KEY) : null;
}

// Clear user role from localStorage
export function clearUserRole() {
  localStorage.removeItem(USER_ROLE_KEY);
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
  clearUserRole();
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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: userRole, error } = await supabase
      .from('user_with_role')
      .select('role_name, role_permissions')
      .eq('user_id', user.id)
      .single<UserRole>();

    if (error) {
      console.error('Error fetching role:', error);
      return null;
    }

    return userRole || null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}

// Check if user has admin role
export async function isAdmin(): Promise<boolean> {
  // First check localStorage for performance
  const storedRole = getUserRoleFromStorage();
  if (storedRole === ADMIN_ROLE) {
    return true;
  }
  
  // Fallback to API check if not in localStorage
  const role = await getUserRole();
  if (role?.role_name === ADMIN_ROLE) {
    setUserRole(ADMIN_ROLE);
    return true;
  }
  
  return false;
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
