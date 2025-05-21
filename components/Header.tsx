'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { removeAuthToken, getUserRole } from '@/utils/auth';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const role = await getUserRole();
        setUserRole(role?.role_name || null);
      }
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    removeAuthToken();
    router.push('/login');
  };

  return (
    <div className="flex justify-end p-4 bg-white shadow-sm md:ml-0">
      <div className="flex items-center gap-3 bg-secondary text-white px-6 py-2 rounded-full">
        <div>
          <div className="font-medium">{user?.email || 'User'}</div>
          {userRole && (
            <div className="text-sm opacity-80">{userRole}</div>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className="ml-2 hover:opacity-80 transition-opacity"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}