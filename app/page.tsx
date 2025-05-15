'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/utils/auth';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import DashboardStats from '@/components/DashboardStats';
import DashboardCharts from '@/components/DashboardCharts';


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex max-h-max bg-white overflow-x-hidden">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 md:ml-[320px] transition-[margin] duration-300 ease-in-out content-wrapper relative">
        <Header />
        
        <main className="p-4 md:p-6 lg:p-8 flex flex-col items-center max-w-7xl justify-items-center">
          <DashboardStats />
          
          <DashboardCharts />
          
          <div className="bg-white rounded-3xl p-6 min-h-[400px] shadow-sm mx-auto">
            {/* Additional content area */}
          </div>
        </main>
      </div>
    </div>
  );
}