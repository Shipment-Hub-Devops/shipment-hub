'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { LocateFixed } from 'lucide-react';
import { api } from '@/lib/api';
import { Shipment } from '@/lib/types';
import { ALL_STATUSES, statusLabel } from '@/lib/status';
import { formatCoords } from '@/lib/format';
import { inputClass, labelClass, btnPrimary, btnGhost, cardClass } from '@/lib/ui';
import type { PickerMarker } from './MapPicker';

const MapPicker = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => <div className="h-72 animate-pulse rounded-xl bg-slate-100" />,
});

type Point = { lat: number; lng: number };

export function OperatorControls({
  shipment,
  onUpdated,
}: {
  shipment: Shipment;
  onUpdated: () => void;
}) {
  const [status, setStatus] = useState<string>(shipment.status);
  const [statusNote, setStatusNote] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const initialLoc: Point | null =
    shipment.currentLat != null && shipment.currentLng != null
      ? { lat: shipment.currentLat, lng: shipment.currentLng }
      : null;
  const [loc, setLoc] = useState<Point | null>(initialLoc);
  const [locLabel, setLocLabel] = useState(shipment.currentLocationLabel || '');
  const [savingLoc, setSavingLoc] = useState(false);

  const center: [number, number] = loc
    ? [loc.lat, loc.lng]
    : [shipment.pickupLat, shipment.pickupLng];

  const markers: PickerMarker[] = loc ? [{ ...loc, label: 'Current' }] : [];

  const submitStatus = async () => {
    setSavingStatus(true);
    try {
      await api.patch(`/shipments/${shipment.id}/status`, {
        status,
        description: statusNote || undefined,
        locationLabel: locLabel || undefined,
        lat: loc?.lat,
        lng: loc?.lng,
      });
      toast.success('Status updated');
      setStatusNote('');
      onUpdated();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setSavingStatus(false);
    }
  };

  const submitLocation = async () => {
    if (!loc) {
      toast.error('Pick a location on the map or use your device GPS.');
      return;
    }
    setSavingLoc(true);
    try {
      await api.patch(`/shipments/${shipment.id}/location`, {
        lat: loc.lat,
        lng: loc.lng,
        locationLabel: locLabel || undefined,
      });
      toast.success('Location updated');
      onUpdated();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update location');
    } finally {
      setSavingLoc(false);
    }
  };

  const useDeviceLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      toast.error('Geolocation is not available in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success('Captured device location');
      },
      () => toast.error('Could not get device location')
    );
  };

  return (
    <div className={cardClass}>
      <h2 className="text-sm font-semibold text-slate-900">
        Operator controls
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Update the shipment status and current location. Every change is added
        to the public timeline.
      </p>

      {/* Status update */}
      <div className="mt-4 space-y-3">
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Note (optional)</label>
          <input
            className={inputClass}
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="e.g. Cleared customs at Gatuna border"
          />
        </div>
        <button
          type="button"
          onClick={submitStatus}
          disabled={savingStatus}
          className={`${btnPrimary} w-full`}
        >
          {savingStatus ? 'Saving…' : 'Update status'}
        </button>
      </div>

      <hr className="my-5 border-slate-200" />

      {/* Location update */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className={labelClass}>Current location</label>
          <button
            type="button"
            onClick={useDeviceLocation}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline"
          >
            <LocateFixed className="h-3.5 w-3.5" /> Use my device GPS
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Click the map to set the cargo&apos;s current position.
        </p>
        <MapPicker
          markers={markers}
          onPick={(lat, lng) => setLoc({ lat, lng })}
          center={center}
          zoom={loc ? 8 : 6}
          height={260}
        />
        <p className="text-xs text-slate-600">
          Selected: {loc ? formatCoords(loc.lat, loc.lng) : 'Not set'}
        </p>
        <div>
          <label className={labelClass}>Location label (optional)</label>
          <input
            className={inputClass}
            value={locLabel}
            onChange={(e) => setLocLabel(e.target.value)}
            placeholder="e.g. Mbarara, Uganda"
          />
        </div>
        <button
          type="button"
          onClick={submitLocation}
          disabled={savingLoc}
          className={`${btnGhost} w-full`}
        >
          {savingLoc ? 'Saving…' : 'Update location only'}
        </button>
      </div>
    </div>
  );
}