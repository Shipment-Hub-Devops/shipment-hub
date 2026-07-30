'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Truck,
  MapPin,
  Share2,
  ClipboardList,
  ArrowRight,
  Search,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const features = [
  {
    icon: ClipboardList,
    title: 'Request shipments',
    body: 'Clients submit pickup, drop-off and cargo details in minutes — no phone tag, no spreadsheets.',
  },
  {
    icon: Truck,
    title: 'Coordinate operations',
    body: 'Operators review incoming requests and manage every shipment from a single dashboard.',
  },
  {
    icon: MapPin,
    title: 'Status & location',
    body: 'Update progress and current position; the timeline and map refresh automatically.',
  },
  {
    icon: Share2,
    title: 'Public tracking',
    body: 'Share a secure link so customers can follow their cargo without creating an account.',
  },
];

const steps = [
  'A client requests a shipment',
  'Operations review and confirm it',
  'The operator updates status & location',
  'The customer tracks it via a link',
];

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState('');

  const onTrack = (e: FormEvent) => {
    e.preventDefault();
    const value = token.trim();
    if (value) router.push(`/track/${value}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="flex items-center gap-2 font-semibold text-slate-900">
            <Package className="h-5 w-5 text-brand-600" />
            ShipmentHub
          </span>
          <Link
            href={user ? '/dashboard' : '/signin'}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            {user ? 'Go to dashboard' : 'Sign in'}
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              Logistics coordination for African freight
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Coordinate shipments and give customers real-time visibility.
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              ShipmentHub is a lightweight platform for freight operators to
              receive shipment requests, coordinate deliveries from one
              dashboard, and share a live tracking link for every consignment —
              from pickup to drop-off.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={user ? '/dashboard' : '/signin'}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-medium text-white hover:bg-brand-700"
              >
                {user ? 'Open dashboard' : 'Sign in to get started'}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <form
                onSubmit={onTrack}
                className="flex w-full max-w-sm items-center gap-2"
              >
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter tracking code"
                    className="w-full rounded-lg border-slate-300 pl-9 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Track
                </button>
              </form>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Try the demo tracking code:{' '}
              <button
                onClick={() => router.push('/track/demotrack123456')}
                className="font-medium text-brand-700 hover:underline"
              >
                demotrack123456
              </button>
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li
                key={step}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <p className="mt-3 text-sm font-medium text-slate-800">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">
          ShipmentHub — a logistics coordination MVP.
        </div>
      </footer>
    </div>
  );
}