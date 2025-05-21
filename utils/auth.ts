import { supabase } from './supabase';

export const TOKEN_KEY = 'auth_token';
export const ADMIN_ROLE = 'Admin';
export const USER_ROLE_KEY = 'user_role';
export const ROLE_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
export const ROLES = {
  ADMIN: 'Admin',
  COMMUNITY_LEADER: 'Community Leader',
  LEADER: 'Leader'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

interface RoleCacheEntry<T = Role> {
  role: T;
  timestamp: number;
  permissions: RolePermissions;
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    role: Role;
  };
  token: string;
  expiresAt: number;
}

// Store auth token in localStorage
export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `sb-token=${token}; path=/; max-age=86400; secure; samesite=strict`;
}

// Store user role in localStorage
export function setUserRole(role: Role, permissions: RolePermissions) {
  const cacheEntry: RoleCacheEntry = {
    role,
    timestamp: Date.now(),
    permissions
  };
  localStorage.setItem(USER_ROLE_KEY, JSON.stringify(cacheEntry));
}

// Get user role from localStorage
export function getUserRoleFromStorage(): RoleCacheEntry | null {
  if (typeof window === 'undefined') return null;
  
  const cached = localStorage.getItem(USER_ROLE_KEY);
  if (!cached) return null;
  
  try {
    const entry: RoleCacheEntry = JSON.parse(cached);
    if (Date.now() - entry.timestamp > ROLE_CACHE_DURATION) {
      localStorage.removeItem(USER_ROLE_KEY);
      return null;
    }
    return entry;
  } catch {
    localStorage.removeItem(USER_ROLE_KEY);
    return null;
  }
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
  document.cookie = 'sb-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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
  const cachedRole = getUserRoleFromStorage();
  if (cachedRole?.role === ADMIN_ROLE) {
    return true;
  }
  
  // Fallback to API check if not in localStorage
  const role = await getUserRole();
  if (role?.role_name === ADMIN_ROLE) {
    setUserRole(role.role_name);
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
