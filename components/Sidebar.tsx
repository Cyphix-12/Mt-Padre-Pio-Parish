'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, DocumentTextIcon, UserGroupIcon, UsersIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Bars3Icon, XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { getUserRole } from '@/utils/auth';
import Image from 'next/image';


const adminMenuItems = [
  { name: 'Dashboard', icon: HomeIcon, href: '/' },
  { name: 'Report', icon: DocumentTextIcon, href: '/reports' },
  { name: 'Leaders', icon: UserGroupIcon, href: '/leaders' },
  { name: 'Zone & Community', icon: UsersIcon, href: '/zones' },
  { name: 'Settings', icon: Cog6ToothIcon, href: '/settings' },
];

const userMenuItems = [
  { name: 'Dashboard', icon: HomeIcon, href: '/' },
  { name: 'Report', icon: DocumentTextIcon, href: '/reports' },
  { name: 'Leaders', icon: UserGroupIcon, href: '/leaders' },
  { name: 'Zone & Community', icon: UsersIcon, href: '/zones' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkUserRole = async () => {
      const role = await getUserRole();
      setUserRole(role?.role_name || null);
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
      // Preserve desktop state
      const storedState = localStorage.getItem('sidebarOpen');
      setIsOpen(storedState === null ? true : storedState === 'true');
    } else {
      setIsOpen(width >= 768);
    }
  }, []);

  // Handle desktop sidebar state persistence
  useEffect(() => {
    if (!isMobile && !isTablet) {
      localStorage.setItem('sidebarOpen', isOpen.toString());
    }
  }, [isOpen, isMobile, isTablet]);

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [checkScreenSize]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] p-3 rounded-lg bg-secondary text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation md:hidden"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (isMobile || isTablet) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm touch-manipulation"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed lg:sticky top-0 left-0 z-[55] h-screen overflow-y-auto bg-secondary text-white transform transition-all duration-300 ease-in-out will-change-transform will-change-width ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          isTablet ? 'w-[320px]' : isOpen ? 'w-[280px]' : 'lg:w-20'
        }`}
      >
        <div className="p-4 min-h-max flex flex-col">
          {/* Tablet/Desktop Toggle Button */}
          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="absolute right-2 top-2 p-2 rounded-lg hover:bg-white/10 transition-colors hidden lg:flex items-center justify-center touch-manipulation focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <ChevronLeftIcon 
                className={`w-5 h-5 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}
              />
            </button>
          )}

          <div className={`bg-white rounded-lg ${isOpen ? 'p-4' : 'p-2'} mb-8 transition-padding duration-300`}>
            <div className={`flex items-center gap-3 ${isOpen ? '' : 'lg:justify-center'}`}>
              <Img src="/padre-pio.png" alt="Padre Pio" className="w-12 h-12" />
              {isOpen && (
                <div className="text-accent font-semibold">
                  Parokia ya<br />Mt. Padre Pio
                </div>
              )}
            </div>
          </div>
          
          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-white/20 transition-colors hover:text-white touch-manipulation focus:outline-none focus:ring-2 focus:ring-white/20 ${
                  pathname === item.href ? 'bg-white/10' : ''
                } ${isOpen ? '' : 'lg:justify-center lg:px-2'}`}
                title={isOpen ? undefined : item.name}
              >
                <item.icon className="w-6 h-6 flex-shrink-0" />
                {isOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
