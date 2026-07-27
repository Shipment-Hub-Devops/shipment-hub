'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Truck, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Shipment } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDateTime } from '@/lib/format';
import { cardClass } from '@/lib/ui';

const ACTIVE = ['pending', 'confirmed', 'picked_up', 'in_transit'];

export default function DashboardOverview() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/shipments');
      setShipments(data.shipments);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const active = shipments.filter((s) => ACTIVE.includes(s.status)).length;
  const delivered = shipments.filter((s) => s.status === 'delivered').length;
  const recent = shipments.slice(0, 5);

  const stats = [
    { label: 'Total shipments', value: shipments.length, icon: Package },
    { label: 'In progress', value: active, icon: Truck },
    { label: 'Delivered', value: delivered, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Welcome, {user?.name}
        </h1>
        <p className="text-sm text-slate-500">
          {user?.role === 'operator'
            ? 'Coordinate and update shipments across the network.'
            : 'Track the shipments you have requested.'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className={cardClass}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{s.label}</p>
              <s.icon className="h-5 w-5 text-brand-600" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {loading ? '—' : s.value}
            </p>
          </div>
        ))}
      </div>

      <div className={cardClass}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            Recent shipments
          </h2>
          <Link
            href="/dashboard/shipments"
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="text-sm text-slate-500">
            No shipments yet.{' '}
            {user?.role === 'client' && (
              <Link
                href="/dashboard/shipments/new"
                className="font-medium text-brand-700 hover:underline"
              >
                Create your first one.
              </Link>
            )}
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/dashboard/shipments/${s.id}`}
                  className="flex items-center justify-between gap-3 py-3 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {s.referenceCode} · {s.cargoDescription}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {s.pickupAddress} → {s.dropoffAddress}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <StatusBadge status={s.status} />
                    <span className="hidden text-xs text-slate-400 sm:block">
                      {formatDateTime(s.updatedAt)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}