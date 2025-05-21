import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  role?: string;
  user_metadata: Record<string, any>;
  created_at: string;
  last_sign_in_at: string;
}

export interface UserWithRole extends User {
  role: string | null;
}

export interface FetchUsersResponse {
  users: User[];
  error?: string;
}

export async function fetchUsers(): Promise<UserWithRole[]> {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('No active session');
    }

    const response = await fetch('/api/list-users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      cache: 'no-store'
    });

    const data: FetchUsersResponse = await response.json();

    if (!response.ok) {
      console.error('API response error:', response.status, data.error);
      throw new Error(data.error || `Failed to fetch users: ${response.status}`);
    }

    // Fetch roles for all users
    const { data: userRoles } = await supabase
      .from('user_with_role')
      .select('user_id, role_name')
      .order('user_id');

    // Combine user data with roles
    const usersWithRoles = data.users.map(user => ({
      ...user,
      role: userRoles?.find(ur => ur.user_id === user.id)?.role_name || null
    }));

    return usersWithRoles;
  } catch (error) {
    console.error('Error fetching users:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    });
    throw error;
  }
}