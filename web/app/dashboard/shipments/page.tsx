'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { Shipment } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDateTime } from '@/lib/format';

export default function ShipmentsListPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/shipments')
      .then(({ data }) => setShipments(data.shipments))
      .finally(() => setLoading(false));
  }, []);

  const isOperator = user?.role === 'operator';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Shipments</h1>
          <p className="text-sm text-slate-500">
            {isOperator
              ? 'All shipments across the network.'
              : 'Shipments you have requested.'}
          </p>
        </div>
        {user?.role === 'client' && (
          <Link
            href="/dashboard/shipments/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" /> New shipment
          </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Loading…</p>
        ) : shipments.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No shipments found.</p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Route</th>
                {isOperator && <th className="px-4 py-3 font-medium">Client</th>}
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shipments.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">
                      {s.referenceCode}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {s.cargoDescription}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="block max-w-xs truncate">
                      {s.pickupAddress} → {s.dropoffAddress}
                    </span>
                  </td>
                  {isOperator && (
                    <td className="px-4 py-3 text-slate-600">
                      {s.client?.name ?? '—'}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {formatDateTime(s.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/shipments/${s.id}`}
                      className="text-sm font-medium text-brand-700 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
