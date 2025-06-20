'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Users, UserCheck, Settings, Menu, X, ChevronLeft } from 'lucide-react';
import { getUserRole } from '@/utils/auth';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitch from '@/components/LanguageSwitch';


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [userRole, setUserRole] = useState('Admin');
  const [isHovered, setIsHovered] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const adminMenuItems = [
  { name: t('Dashboard'), icon: Home, href: '/', badge: null },
  { name: t('Report'), icon: FileText, href: '/reports', badge: '12' },
  { name: t('Leaders'), icon: UserCheck, href: '/leaders', badge: null },
  { name: t('Zone & Community'), icon: Users, href: '/zones', badge: '3' },
  { name: t('Settings'), icon: Settings, href: '/settings', badge: null },
];

const userMenuItems = [
  { name: t('Dashboard'), icon: Home, href: '/', badge: null },
  { name: t('Report'), icon: FileText, href: '/reports', badge: '5' },
  { name: t('Leaders'), icon: UserCheck, href: '/leaders', badge: null },
  { name: t('Zone & Community'), icon: Users, href: '/zones', badge: null },
];

  useEffect(() => {
    const checkUserRole = async () => {
      const role = await getUserRole();
      // Fixed: Use a default string value instead of null
      setUserRole(role?.role_name || 'User');
    };
    checkUserRole();
  }, []);

  const menuItems = useMemo(() => {
    return userRole === 'Admin' ? adminMenuItems : userMenuItems;
  }, [userRole]);

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
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105 transition-all duration-200 md:hidden"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <div className="relative">
          {isOpen ? (
            <X className="w-6 h-6 transform transition-transform duration-300" />
          ) : (
            <Menu className="w-6 h-6 transform transition-transform duration-300" />
          )}
        </div>
      </button>

      {/* Enhanced Overlay */}
      {isOpen && (isMobile || isTablet) && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/50 to-black/30 z-50 transition-all duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Enhanced Sidebar */}
      <div
        ref={sidebarRef}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        className={`fixed lg:sticky top-0 left-0 z-[55] h-screen overflow-hidden bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white transform transition-all duration-300 ease-out will-change-transform shadow-2xl border-r border-blue-500/30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          isTablet ? 'w-[320px]' : shouldShowExpanded ? 'w-[280px]' : 'lg:w-20'
        }`}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-50" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/10 to-transparent" />
        
        <div className="relative p-4 min-h-full flex flex-col overflow-y-auto">
          {/* Tablet/Desktop Toggle Button */}
          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="absolute right-3 top-3 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hidden lg:flex items-center justify-center border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transform hover:scale-105"
              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <ChevronLeft 
                className={`w-4 h-4 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}
              />
            </button>
          )}

          {/* Enhanced Logo Section */}
          <div className={`relative bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${shouldShowExpanded ? 'p-6' : 'p-3'} mb-8 transform hover:scale-[1.02] border border-gray-200/50`}>
            <div className={`flex items-center gap-4 ${shouldShowExpanded ? '' : 'lg:justify-center'}`}>
              <div className="relative">
                <div 
                  className={`rounded-full shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold ${shouldShowExpanded ? 'w-12 h-12 text-lg' : 'w-10 h-10 text-sm'}`}
                >
                  PP
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent" />
              </div>
              {shouldShowExpanded && (
                <div className="text-slate-800 font-bold text-sm leading-tight animate-fade-in">
                  <div className="text-blue-700">{t('Parokia ya')}</div>
                  <div className="text-slate-700">{t('Mt. Padre Pio')}</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Navigation */}
          <nav className="space-y-3 flex-1">
            {menuItems.map((item, index) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setCurrentPath(item.href)}
                  className={`group relative flex items-center w-full gap-4 px-4 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/50 ${
                    isActive 
                      ? 'bg-white text-blue-700 shadow-lg font-semibold' 
                      : 'hover:bg-white/10 hover:shadow-md hover:text-white text-blue-100'
                  } ${shouldShowExpanded ? '' : 'lg:justify-center lg:px-3'}`}
                  title={shouldShowExpanded ? undefined : item.name}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-700 rounded-r-full shadow-lg" />
                  )}
                  
                  {/* Icon with enhanced styling */}
                  <div className="relative">
                    <item.icon className={`flex-shrink-0 transition-all duration-300 ${
                      isActive ? 'w-6 h-6 text-blue-700' : 'w-6 h-6 text-blue-200 group-hover:text-white'
                    }`} />
                    {isActive && (
                      <div className="absolute inset-0 rounded-lg bg-blue-100/20" />
                    )}
                  </div>
                  
                  {/* Text with fade animation */}
                  {shouldShowExpanded && (
                    <div className="flex items-center justify-between flex-1 animate-fade-in">
                      <span className={`font-medium transition-colors duration-300 ${
                        isActive ? 'text-blue-700' : 'text-blue-100 group-hover:text-white'
                      }`}>
                        {item.name}
                      </span>
                      
                      {/* Badge */}
                      {item.badge && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
                          isActive 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-white/20 text-white group-hover:bg-white/30'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {!shouldShowExpanded && !isMobile && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-blue-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-blue-600">
                      {item.name}
                      {item.badge && (
                        <span className="ml-2 px-1.5 py-0.5 bg-white/20 text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              );
            })}
          </nav>

          {/* Enhanced Footer Section */}
          {shouldShowExpanded && (
            <div className="mt-8 pt-6 border-t border-white/20 animate-fade-in">
              <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-white/10 border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-sm text-blue-100 font-medium">{t('System Online')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
