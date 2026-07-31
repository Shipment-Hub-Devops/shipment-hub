'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ShipmentForm } from '@/components/ShipmentForm';

export default function NewShipmentPage() {
  const { user } = useAuth();

  if (user && user.role !== 'client') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">
          Only client accounts can create shipments. Operators coordinate and
          update existing shipments.
        </p>
        <Link
          href="/dashboard/shipments"
          className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline"
        >
          ← Back to shipments
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/dashboard/shipments"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shipments
        </Link>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">
          New shipment
        </h1>
        <p className="text-sm text-slate-500">
          Describe the cargo and pin the pickup and drop-off points.
        </p>
      </div>

      <ShipmentForm />
    </div>
  );
}