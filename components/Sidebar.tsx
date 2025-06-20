'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
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

  const menuItems = userRole === 'Admin' ? [
    { nameKey: 'Dashboard', icon: Home, href: '/', badge: null },
    { nameKey: 'Report', icon: FileText, href: '/reports', badge: '12' },
    { nameKey: 'Leaders', icon: UserCheck, href: '/leaders', badge: null },
    { nameKey: 'Zone & Community', icon: Users, href: '/zones', badge: '3' },
    { nameKey: 'Settings', icon: Settings, href: '/settings', badge: null }
  ] : [
    { nameKey: 'Dashboard', icon: Home, href: '/', badge: null },
    { nameKey: 'Report', icon: FileText, href: '/reports', badge: '5' },
    { nameKey: 'Leaders', icon: UserCheck, href: '/leaders', badge: null },
    { nameKey: 'Zone & Community', icon: Users, href: '/zones', badge: null }
  ];

  const checkScreenSize = useCallback(() => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    setIsTablet(width >= 768 && width < 1024);
    setIsOpen(width >= 768);
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
        className="fixed top-4 left-4 z-[60] p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg md:hidden"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (isMobile || isTablet) && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        className={`fixed lg:sticky top-0 left-0 z-[55] h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white border-r border-blue-500/30 transform transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          isTablet ? 'w-[320px]' : shouldShowExpanded ? 'w-[280px]' : 'lg:w-20'
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="absolute right-3 top-3 p-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              <ChevronLeft className={`w-4 h-4 ${isOpen ? '' : 'rotate-180'}`} />
            </button>
          )}

          <div className="bg-white rounded-xl p-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 w-10 h-10 flex items-center justify-center rounded-full text-white font-bold">
                PP
              </div>
              {shouldShowExpanded && (
                <div className="text-sm font-bold text-slate-800">
                  <div className="text-blue-700">{t('Parokia ya')}</div>
                  <div>{t('Mt. Padre Pio')}</div>
                </div>
              )}
            </div>
          </div>

          <nav className="space-y-3 flex-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCurrentPath(item.href)}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl ${
                  currentPath === item.href ? 'bg-white text-blue-700' : 'hover:bg-white/10'
                } ${shouldShowExpanded ? '' : 'lg:justify-center'}`}
              >
                <item.icon className="w-6 h-6" />
                {shouldShowExpanded && <span>{t(item.nameKey)}</span>}
              </Link>
            ))}
          </nav>

          {shouldShowExpanded && (
            <div className="mt-6 border-t border-white/20 pt-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
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
