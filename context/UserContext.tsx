'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/utils/supabase';

interface User {
  id: string;
  email: string;
  role?: string;
  role_permissions?: Record<string, Record<string, boolean>>;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserWithRole = async () => {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      console.log('Supabase user:', supabaseUser);

      if (!supabaseUser) {
        setUser(null);
        return;
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_with_role')
        .select('role_name, role_permissions')
        .eq('user_id', supabaseUser.id)
        .single();

      console.log('Role data:', roleData);
      console.log('Role error:', roleError);

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email!,
        });
      } else {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: roleData?.role_name,
          role_permissions: roleData?.role_permissions,
        });
      }
    } catch (error) {
      console.error('Detailed error in fetchUserWithRole:', error);
      console.error('Error in fetchUserWithRole:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserWithRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUserWithRole();
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    setLoading(true);
    await fetchUserWithRole();
  };

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);