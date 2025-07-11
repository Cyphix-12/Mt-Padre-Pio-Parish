'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/utils/auth';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import DashboardStats from '@/components/DashboardStats';
import DashboardCharts from '@/components/DashboardCharts';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitch from '@/components/LanguageSwitch';

const FADE_IN_ANIMATION = 'animate-[fadeIn_0.5s_ease-in-out]';

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);
  
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className={`w-full max-w-6xl mx-auto space-y-6 ${FADE_IN_ANIMATION}`}>
            <DashboardStats />
            
            <DashboardCharts />
            
            <div className="bg-white rounded-3xl p-6 min-h-[300px] shadow-sm">
              {/* Additional content area */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
