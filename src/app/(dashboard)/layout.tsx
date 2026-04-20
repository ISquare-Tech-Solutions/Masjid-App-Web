'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';

function getActiveNav(pathname: string): string {
  if (pathname.startsWith('/prayer-management')) return 'prayer';
  if (pathname.startsWith('/events')) return 'events';
  if (pathname.startsWith('/campaigns')) return 'campaigns';
  if (pathname.startsWith('/settings')) return 'settings';
  return 'dashboard';
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeNav = getActiveNav(pathname);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?clear');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--main-bg)]">
        <div className="w-8 h-8 border-4 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--main-bg)]">
      <Header activeNav={activeNav} />
      <main className="max-w-[1440px] mx-auto px-4 lg:px-[60px] py-8">{children}</main>
    </div>
  );
}
