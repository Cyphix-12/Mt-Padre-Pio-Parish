'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SettingsContent from '@/components/SettingsContent';

export default function SettingsPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-accent">Loading...</div>
      </div>
    );
  }

  if (!user?.role || (user.role !== 'Admin' && user.role !== 'Community Leader')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-red-600">You do not have permission to access this page.</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white relative">
      <Sidebar />
      
      <div className="flex-1 md:ml-20">
        <Header />
        
        <main className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-accent">Settings</h1>
              <p className="text-gray-600 mt-1">Logged in as: {user.email} ({user.role})</p>
            </div>
          </div>
          
          <SettingsContent />
        </main>
      </div>
    </div>
  );
}