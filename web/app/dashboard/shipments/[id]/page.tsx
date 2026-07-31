'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Package, Weight, Hash } from 'lucide-react';
import { api } from '@/lib/api';
import { Shipment } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { usePolling } from '@/hooks/usePolling';
import { StatusBadge } from '@/components/StatusBadge';
import { StatusProgress } from '@/components/StatusProgress';
import { ShipmentTimeline } from '@/components/ShipmentTimeline';
import { CopyTrackingLink } from '@/components/CopyTrackingLink';
import { OperatorControls } from '@/components/OperatorControls';
import { cardClass } from '@/lib/ui';
import { formatCoords, formatDateTime } from '@/lib/format';

const ShipmentMap = dynamic(() => import('@/components/ShipmentMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] animate-pulse rounded-xl bg-slate-100" />
  ),
});

export default function ShipmentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/shipments/${id}`);
      setShipment(data.shipment);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load shipment');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Keep the detail view fresh while it is open.
  usePolling(load, 15000, !!shipment);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }
  if (error || !shipment) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-red-600">{error || 'Shipment not found.'}</p>
        <Link
          href="/dashboard/shipments"
          className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline"
        >
          ← Back to shipments
        </Link>
      </div>
    );
  }

  const isOperator = user?.role === 'operator';

  const trail = (shipment.events || [])
    .filter((e) => e.lat != null && e.lng != null)
    .map((e) => ({
      lat: e.lat as number,
      lng: e.lng as number,
      label: e.locationLabel,
    }));

  const current =
    shipment.currentLat != null && shipment.currentLng != null
      ? {
          lat: shipment.currentLat,
          lng: shipment.currentLng,
          label: shipment.currentLocationLabel,
        }
      : null;

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/dashboard/shipments"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shipments
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-900">
            {shipment.referenceCode}
          </h1>
          <StatusBadge status={shipment.status} />
        </div>
      </div>

      <div className={cardClass}>
        <StatusProgress status={shipment.status} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className={cardClass}>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">
              Route &amp; live location
            </h2>
            <ShipmentMap
              pickup={{
                lat: shipment.pickupLat,
                lng: shipment.pickupLng,
                label: shipment.pickupAddress,
              }}
              dropoff={{
                lat: shipment.dropoffLat,
                lng: shipment.dropoffLng,
                label: shipment.dropoffAddress,
              }}
              current={current}
              trail={trail}
            />
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-400">Pickup</p>
                <p className="text-slate-700">{shipment.pickupAddress}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Drop-off</p>
                <p className="text-slate-700">{shipment.dropoffAddress}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Current location</p>
                <p className="text-slate-700">
                  {shipment.currentLocationLabel ||
                    formatCoords(shipment.currentLat, shipment.currentLng)}
                </p>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">
              Cargo
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <p className="flex items-center gap-2 text-sm text-slate-700">
                <Package className="h-4 w-4 text-slate-400" />
                {shipment.cargoDescription}
              </p>
              <p className="flex items-center gap-2 text-sm text-slate-700">
                <Weight className="h-4 w-4 text-slate-400" />
                {shipment.weightKg ? `${shipment.weightKg} kg` : '—'}
              </p>
              <p className="flex items-center gap-2 text-sm text-slate-700">
                <Hash className="h-4 w-4 text-slate-400" />
                {shipment.quantity ?? 1} item(s)
              </p>
            </div>
            {shipment.notes && (
              <p className="mt-3 text-sm text-slate-600">
                <span className="text-slate-400">Notes: </span>
                {shipment.notes}
              </p>
            )}
            {isOperator && shipment.client && (
              <p className="mt-3 text-sm text-slate-600">
                <span className="text-slate-400">Client: </span>
                {shipment.client.name} ({shipment.client.email})
              </p>
            )}
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">
              Timeline
            </h2>
            <ShipmentTimeline events={shipment.events || []} />
          </div>
        </div>

        <div className="space-y-5">
          <div className={cardClass}>
            <h2 className="text-sm font-semibold text-slate-900">
              Public tracking link
            </h2>
            <p className="mb-3 mt-1 text-xs text-slate-500">
              Share this with the customer — no account required.
            </p>
            <CopyTrackingLink token={shipment.trackingToken} />
            <p className="mt-2 text-xs text-slate-400">
              Created {formatDateTime(shipment.createdAt)}
            </p>
          </div>

          {isOperator && (
            <OperatorControls shipment={shipment} onUpdated={load} />
          )}
        </div>
      </div>
    </div>
  );
}