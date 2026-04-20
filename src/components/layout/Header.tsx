'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  DashboardIcon,
  PrayerIcon,
  MegaphoneIcon,
  CampaignIcon,
  SettingsIcon,
  BellIcon,
  ChevronDownIcon,
} from '@/components/ui/Icons';
import { useAuth } from '@/contexts/AuthContext';
import ProfileModal from './ProfileModal';
import NotificationDrawer from './NotificationDrawer';
import type { Notification } from '@/lib/api/notifications';

interface NavItemProps {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

const NavItem = ({ label, href, icon, isActive = false }: NavItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-2 px-[16px] py-[12px] rounded-[12px] transition-colors shrink-0
      ${isActive
        ? 'bg-[var(--brand-10)] text-[var(--brand)]'
        : 'text-[var(--grey-800)] hover:bg-[var(--neutral-100)]'
      }`}
  >
    <span className={isActive ? 'text-[var(--brand)]' : 'text-[var(--grey-800)]'}>{icon}</span>
    <span className={`font-inter text-[14px] leading-normal whitespace-nowrap ${isActive ? 'font-medium' : 'font-normal'}`}>
      {label}
    </span>
  </Link>
);

interface HeaderProps {
  activeNav?: string;
}

export default function Header({ activeNav = 'dashboard' }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleNotificationsLoaded = useCallback((notifications: Notification[]) => {
    setUnreadCount(notifications.filter((n) => !n.is_read).length);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: NavItemProps[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon size={20} />, isActive: activeNav === 'dashboard' },
    { label: 'Prayer Management', href: '/prayer-management', icon: <PrayerIcon size={20} />, isActive: activeNav === 'prayer' },
    { label: 'Event & Announcements', href: '/events', icon: <MegaphoneIcon size={20} />, isActive: activeNav === 'events' },
    { label: 'Campaign', href: '/campaigns', icon: <CampaignIcon size={20} />, isActive: activeNav === 'campaigns' },
    { label: 'App Settings', href: '/settings', icon: <SettingsIcon size={20} />, isActive: activeNav === 'settings' },
  ];

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <>
      <header className="w-full bg-white border-b border-[var(--border-01)] sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-[60px] py-[16px] flex items-center justify-between">
          <Link href="/dashboard" className="relative w-[52px] h-[52px] shrink-0">
            <Image src="/images/nwk-logo.png" alt="NWK Muslim Association" fill className="object-contain" />
          </Link>

          <nav className="flex items-center gap-[28px] overflow-x-auto scrollbar-hide flex-1 lg:flex-none justify-center">
            {navItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </nav>

          <div className="flex items-center gap-[24px]">
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-0 hover:opacity-80 transition-opacity"
              aria-label="Open notifications"
            >
              <BellIcon size={20} className="text-[var(--grey-800)]" />
              {(unreadCount === null || unreadCount > 0) && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center bg-[#ff8156] border-[1.5px] border-[var(--table-white)] rounded-full text-white font-inter font-semibold leading-none"
                  style={
                    unreadCount !== null && unreadCount > 0
                      ? { fontSize: 9, minWidth: 16, height: 16, padding: '0 3px' }
                      : { width: 9, height: 9 }
                  }
                >
                  {unreadCount !== null && unreadCount > 0
                    ? unreadCount > 9 ? '9+' : unreadCount
                    : null}
                </span>
              )}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-[12px] hover:opacity-80 transition-opacity"
              >
                <div className="w-[40px] h-[40px] rounded-full bg-[var(--brand)] flex items-center justify-center">
                  <span className="font-inter font-semibold text-[14px] text-white">{initials}</span>
                </div>
                <ChevronDownIcon size={20} className="text-[var(--grey-800)]" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-[200px] bg-white rounded-[12px] shadow-[0_4px_21px_rgba(0,0,0,0.1)] py-2 z-50">
                  {user && (
                    <div className="px-4 py-2 border-b border-[var(--border-01)]">
                      <p className="font-inter font-semibold text-[14px] text-[var(--grey-800)]">{user.fullName}</p>
                      <p className="font-inter text-[12px] text-[var(--neutral-500)]">{user.email}</p>
                    </div>
                  )}
                  <button
                    className="w-full text-left px-4 py-2 font-inter text-[14px] text-[var(--grey-800)] hover:bg-[var(--neutral-100)]"
                    onClick={() => { setShowUserMenu(false); setShowProfileModal(true); }}
                  >
                    My Profile
                  </button>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 font-inter text-[14px] text-[var(--grey-800)] hover:bg-[var(--neutral-100)]"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Settings
                  </Link>
                  <hr className="my-1 border-[var(--border-01)]" />
                  <button
                    className="w-full text-left px-4 py-2 font-inter text-[14px] text-[#f64c4c] hover:bg-[var(--neutral-100)]"
                    onClick={() => { setShowUserMenu(false); logout(); }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onLogout={logout}
        user={user}
      />

      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onLoad={handleNotificationsLoaded}
      />
    </>
  );
}
