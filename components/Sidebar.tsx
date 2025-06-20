'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Users, UserCheck, Settings, Menu, X, ChevronLeft } from 'lucide-react';
import { getUserRole } from '@/utils/auth';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Sidebar() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [userRole, setUserRole] = useState('Admin');
  const [isHovered, setIsHovered] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await getUserRole();
      setUserRole(role?.role_name || 'User');
    };
    fetchRole();
  }, []);

  const menuItems = useMemo(() => {
    if (userRole === 'Admin') {
      return [
        { name: t('Dashboard'), icon: Home, href: '/', badge: null },
        { name: t('Report'), icon: FileText, href: '/reports', badge: '12' },
        { name: t('Leaders'), icon: UserCheck, href: '/leaders', badge: null },
        { name: t('Zone & Community'), icon: Users, href: '/zones', badge: '3' },
        { name: t('Settings'), icon: Settings, href: '/settings', badge: null }
      ];
    } else {
      return [
        { name: t('Dashboard'), icon: Home, href: '/', badge: null },
        { name: t('Report'), icon: FileText, href: '/reports', badge: '5' },
        { name: t('Leaders'), icon: UserCheck, href: '/leaders', badge: null },
        { name: t('Zone & Community'), icon: Users, href: '/zones', badge: null }
      ];
    }
  }, [userRole, t]);

  const checkScreenSize = useCallback(() => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    setIsTablet(width >= 768 && width < 1024);
    if (width >= 1024) {
      setIsOpen(true);
    } else {
      setIsOpen(width >= 768);
    }
  }, []);

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [checkScreenSize]);

  const shouldShowExpanded = isOpen || (!isMobile && isHovered);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105 transition-all duration-200 md:hidden"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {isOpen && (isMobile || isTablet) && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/50 to-black/30 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        className={`fixed lg:sticky top-0 left-0 z-[55] h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white shadow-2xl border-r border-blue-500/30 transform transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          isTablet ? 'w-[320px]' : shouldShowExpanded ? 'w-[280px]' : 'lg:w-20'
        }`}
      >
        <div className="relative p-4 flex flex-col h-full overflow-y-auto">
          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="absolute right-3 top-3 p-2 rounded-full bg-white/10 hover:bg-white/20 hidden lg:flex"
            >
              <ChevronLeft
                className={`w-4 h-4 transition-transform ${isOpen ? '' : 'rotate-180'}`}
              />
            </button>
          )}

          <div className={`bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg p-3 mb-8`}>
            <div className={`flex items-center gap-4 ${shouldShowExpanded ? '' : 'lg:justify-center'}`}>
              <div className="rounded-full bg-gradient-to-br from-blue-500 to-blue-700 w-10 h-10 flex items-center justify-center text-white font-bold">
                PP
              </div>
              {shouldShowExpanded && (
                <div className="text-slate-800 font-bold text-sm">
                  <div className="text-blue-700">{t('Parokia ya')}</div>
                  <div className="text-slate-700">{t('Mt. Padre Pio')}</div>
                </div>
              )}
            </div>
          </div>

          <nav className="space-y-3 flex-1">
            {menuItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setCurrentPath(item.href)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl ${
                    isActive ? 'bg-white text-blue-700' : 'text-blue-100 hover:bg-white/10'
                  } ${shouldShowExpanded ? '' : 'lg:justify-center lg:px-3'}`}
                >
                  <item.icon className="w-6 h-6" />
                  {shouldShowExpanded && (
                    <span>{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {shouldShowExpanded && (
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">{t('System Online')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
