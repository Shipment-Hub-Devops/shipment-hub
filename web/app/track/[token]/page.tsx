'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Package, RefreshCw } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { PublicShipment } from '@/lib/types';
import { usePolling } from '@/hooks/usePolling';
import { StatusBadge } from '@/components/StatusBadge';
import { StatusProgress } from '@/components/StatusProgress';
import { ShipmentTimeline } from '@/components/ShipmentTimeline';
import { cardClass } from '@/lib/ui';
import { formatDateTime } from '@/lib/format';

const ShipmentMap = dynamic(() => import('@/components/ShipmentMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] animate-pulse rounded-xl bg-slate-100" />
  ),
});

export default function TrackPage() {
  const params = useParams();
  const token = params.token as string;

  const [shipment, setShipment] = useState<PublicShipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await publicApi.get(`/track/${token}`);
      setShipment(data.shipment);
      setNotFound(false);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  usePolling(load, 15000, !!shipment);

  const current =
    shipment && shipment.currentLat != null && shipment.currentLng != null
      ? {
          lat: shipment.currentLat,
          lng: shipment.currentLng,
          label: shipment.currentLocationLabel,
        }
      : null;

  const trail = (shipment?.events || [])
    .filter((e) => e.lat != null && e.lng != null)
    .map((e) => ({
      lat: e.lat as number,
      lng: e.lng as number,
      label: e.locationLabel,
    }));

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-slate-900"
          >
            <Package className="h-5 w-5 text-brand-600" />
            ShipmentHub
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <RefreshCw className="h-3.5 w-3.5" /> Live tracking
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : notFound || !shipment ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <h1 className="text-lg font-semibold text-slate-900">
              Shipment not found
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Please check the tracking code and try again.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline"
            >
              ← Back to home
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Tracking</p>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {shipment.referenceCode}
                </h1>
              </div>
              <StatusBadge status={shipment.status} />
            </div>

            <div className={cardClass}>
              <StatusProgress status={shipment.status} />
            </div>

            <div className={cardClass}>
              <div className="mb-3 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-400">Origin</p>
                  <p className="text-slate-700">{shipment.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Destination</p>
                  <p className="text-slate-700">{shipment.dropoffAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Current location</p>
                  <p className="text-slate-700">
                    {shipment.currentLocationLabel || 'In progress'}
                  </p>
                </div>
              </div>
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
            </div>

            <div className={cardClass}>
              <h2 className="mb-3 text-sm font-semibold text-slate-900">
                Progress updates
              </h2>
              <ShipmentTimeline events={shipment.events} />
            </div>

            <p className="text-center text-xs text-slate-400">
              Last updated {formatDateTime(shipment.updatedAt)}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}