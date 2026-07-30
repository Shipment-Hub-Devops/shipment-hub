'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Package, Plus, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function DashboardNav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const onLogout = () => {
    logout();
    router.push('/signin');
  };

  const links = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/shipments', label: 'Shipments' },
  ];

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(href);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-slate-900"
          >
            <Package className="h-5 w-5 text-brand-600" />
            ShipmentHub
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  isActive(link.href)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'client' && (
            <Link
              href="/dashboard/shipments/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" /> New shipment
            </Link>
          )}
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
            <p className="text-xs capitalize text-slate-500">{user?.role}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="Log out"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}