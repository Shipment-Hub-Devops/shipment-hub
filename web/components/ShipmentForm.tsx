'use client';

import { useMemo, useState, ChangeEvent, FormEvent } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import { formatCoords } from '@/lib/format';
import { inputClass, labelClass, btnPrimary, cardClass } from '@/lib/ui';
import type { PickerMarker } from './MapPicker';

const MapPicker = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => <div className="h-80 animate-pulse rounded-xl bg-slate-100" />,
});

type Mode = 'pickup' | 'dropoff';
type Point = { lat: number; lng: number };

export function ShipmentForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('pickup');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    cargoDescription: '',
    weightKg: '',
    quantity: '1',
    pickupAddress: '',
    pickupContact: '',
    dropoffAddress: '',
    dropoffContact: '',
    notes: '',
  });
  const [pickup, setPickup] = useState<Point | null>(null);
  const [dropoff, setDropoff] = useState<Point | null>(null);

  const update =
    (key: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onPick = (lat: number, lng: number) => {
    if (mode === 'pickup') setPickup({ lat, lng });
    else setDropoff({ lat, lng });
  };

  const markers: PickerMarker[] = useMemo(() => {
    const result: PickerMarker[] = [];
    if (pickup) result.push({ ...pickup, label: 'Pickup' });
    if (dropoff) result.push({ ...dropoff, label: 'Drop-off' });
    return result;
  }, [pickup, dropoff]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pickup || !dropoff) {
      toast.error('Set both pickup and drop-off points on the map.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        cargoDescription: form.cargoDescription,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
        quantity: form.quantity ? Number(form.quantity) : 1,
        pickupAddress: form.pickupAddress,
        pickupLat: pickup.lat,
        pickupLng: pickup.lng,
        pickupContact: form.pickupContact || undefined,
        dropoffAddress: form.dropoffAddress,
        dropoffLat: dropoff.lat,
        dropoffLng: dropoff.lng,
        dropoffContact: form.dropoffContact || undefined,
        notes: form.notes || undefined,
      };
      const { data } = await api.post('/shipments', payload);
      toast.success('Shipment created');
      router.push(`/dashboard/shipments/${data.shipment.id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create shipment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
      <div className={cardClass}>
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Cargo details
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Cargo description</label>
            <input
              required
              className={inputClass}
              value={form.cargoDescription}
              onChange={update('cargoDescription')}
              placeholder="e.g. Palletised coffee beans (20 bags)"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Weight (kg)</label>
              <input
                type="number"
                min="0"
                step="any"
                className={inputClass}
                value={form.weightKg}
                onChange={update('weightKg')}
                placeholder="1200"
              />
            </div>
            <div>
              <label className={labelClass}>Quantity</label>
              <input
                type="number"
                min="1"
                className={inputClass}
                value={form.quantity}
                onChange={update('quantity')}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Notes (optional)</label>
            <textarea
              rows={3}
              className={inputClass}
              value={form.notes}
              onChange={update('notes')}
              placeholder="Handling instructions, references, etc."
            />
          </div>
        </div>

        <h2 className="mb-3 mt-6 text-sm font-semibold text-slate-900">
          Addresses
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Pickup address</label>
            <input
              required
              className={inputClass}
              value={form.pickupAddress}
              onChange={update('pickupAddress')}
              placeholder="Kigali Special Economic Zone, Rwanda"
            />
          </div>
          <div>
            <label className={labelClass}>Pickup contact (optional)</label>
            <input
              className={inputClass}
              value={form.pickupContact}
              onChange={update('pickupContact')}
              placeholder="+250 ..."
            />
          </div>
          <div>
            <label className={labelClass}>Drop-off address</label>
            <input
              required
              className={inputClass}
              value={form.dropoffAddress}
              onChange={update('dropoffAddress')}
              placeholder="Nakawa Industrial Area, Kampala, Uganda"
            />
          </div>
          <div>
            <label className={labelClass}>Drop-off contact (optional)</label>
            <input
              className={inputClass}
              value={form.dropoffContact}
              onChange={update('dropoffContact')}
              placeholder="+256 ..."
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900">
          Pin pickup &amp; drop-off
        </h2>
        <p className="mb-3 mt-1 text-xs text-slate-500">
          Choose which point to set, then click on the map.
        </p>

        <div className="mb-3 inline-flex rounded-lg border border-slate-200 p-0.5">
          {(['pickup', 'dropoff'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${
                mode === m
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Set {m}
            </button>
          ))}
        </div>

        <MapPicker markers={markers} onPick={onPick} height={300} />

        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <p className="flex items-center gap-1 text-slate-600">
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            Pickup: {pickup ? formatCoords(pickup.lat, pickup.lng) : 'Not set'}
          </p>
          <p className="flex items-center gap-1 text-slate-600">
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            Drop-off:{' '}
            {dropoff ? formatCoords(dropoff.lat, dropoff.lng) : 'Not set'}
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`${btnPrimary} mt-5 w-full`}
        >
          {submitting ? 'Creating…' : 'Create shipment'}
        </button>
      </div>
    </form>
  );
}