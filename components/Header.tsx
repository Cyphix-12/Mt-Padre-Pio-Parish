"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { ChevronDown, LogOut, Shield, Users, Crown, UserCheck } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { removeAuthToken } from '@/utils/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitch from '@/components/LanguageSwitch';
import Image from 'next/image';

const roleConfig = {
  'Admin': { 
    color: 'bg-red-500', 
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    icon: Shield,
    label: 'Administrator'
  },
  'Community Leader': { 
    color: 'bg-blue-500', 
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    icon: Users,
    label: 'Community Leader'
  },
  'Leader': { 
    color: 'bg-purple-500', 
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
    icon: Crown,
    label: 'Parish Leader'
  },
  'Normal user': { 
    color: 'bg-green-500', 
    textColor: 'text-green-700',
    bgColor: 'bg-green-50', 
    icon: UserCheck,
    label: 'Member'
  }
};

export default function Header() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session?.user) {
          // Fetch user role
          const { data: roleData, error: roleError } = await supabase
            .from('user_with_role')
            .select('role_name')
            .eq('user_id', session.user.id)
            .single();

          if (roleError) throw roleError;

          setCurrentUser({
            email: session.user.email,
            role: roleData?.role_name || 'Normal user',
            avatar: null
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUser();
  }, []);

  const getInitials = () => {
    return currentUser?.email?.split('@')[0].slice(0, 2).toUpperCase() || 'NA';
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await supabase.auth.signOut();
    removeAuthToken();
    router.push('/login');
    setIsDropdownOpen(false);
  };

  if (!currentUser) return null;

  const config = roleConfig[currentUser.role as keyof typeof roleConfig] || roleConfig['Normal user'];
  const RoleIcon = config.icon;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-800">
            {t('parishName')}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language Switch */}
          <LanguageSwitch />

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center text-blue-800 font-semibold text-sm">
                {currentUser.avatar ? (
                  <Image 
                    src={currentUser.avatar} 
                    alt="Avatar" 
                    width={32} 
                    height={32} 
                    className="rounded-full" 
                  />
                ) : (
                  getInitials()
                )}
              </div>
              
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium">{currentUser.email}</div>
                <div className="text-xs opacity-90">{config.label}</div>
              </div>
              
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                        {currentUser.avatar ? (
                          <Image 
                            src={currentUser.avatar} 
                            alt="Avatar" 
                            width={48} 
                            height={48} 
                            className="rounded-full" 
                          />
                        ) : (
                          getInitials()
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600">{currentUser.email}</div>
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${config.bgColor} ${config.textColor}`}>
                          <RoleIcon className="w-3 h-3" />
                          <span>{config.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}