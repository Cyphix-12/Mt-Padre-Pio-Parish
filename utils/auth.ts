import { supabase } from './supabase';

export const TOKEN_KEY = 'auth_token';

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function getUserRole() {
  try {
    console.log('Getting user role...');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found');
      return null;
    }
    console.log('User found:', user.id);

    const { data: userRole } = await supabase
      .from('user_with_role')
      .select('role_name, role_permissions')
      .eq('user_id', user.id)
      .single();

    console.log('User role data:', userRole);
    return userRole || null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}

export async function checkPermission(permission: string, action: 'create' | 'read' | 'update' | 'delete') {
  const role = await getUserRole();
  if (!role) return false;

  return role.permissions[permission]?.[action] || false;
}