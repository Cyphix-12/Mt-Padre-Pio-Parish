import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
  created_at: string;
  last_sign_in_at: string;
}

export interface FetchUsersResponse {
  users: User[];
  error?: string;
}

export async function fetchUsers(): Promise<User[]> {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('No active session');
    }
    
    console.log('Session token obtained:', session.access_token.slice(0, 10) + '...');

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

    console.log('Users fetched successfully:', data.users.length);
    return data.users;
  } catch (error) {
    console.error('Error fetching users:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    });
    throw error;
  }
}