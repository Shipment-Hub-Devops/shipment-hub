import { ShipmentStatus } from './types';

// Ordered happy-path lifecycle (excludes the terminal "cancelled" state).
export const STATUS_FLOW: ShipmentStatus[] = [
  'pending',
  'confirmed',
  'picked_up',
  'in_transit',
  'delivered',
];

export const ALL_STATUSES: ShipmentStatus[] = [...STATUS_FLOW, 'cancelled'];

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending review',
  confirmed: 'Confirmed',
  picked_up: 'Picked up',
  in_transit: 'In transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 ring-amber-600/20',
  confirmed: 'bg-blue-100 text-blue-800 ring-blue-600/20',
  picked_up: 'bg-indigo-100 text-indigo-800 ring-indigo-600/20',
  in_transit: 'bg-violet-100 text-violet-800 ring-violet-600/20',
  delivered: 'bg-green-100 text-green-800 ring-green-600/20',
  cancelled: 'bg-red-100 text-red-800 ring-red-600/20',
};

export const statusLabel = (status: string): string =>
  STATUS_LABELS[status] ?? status;

export const statusStepIndex = (status: string): number =>
  STATUS_FLOW.indexOf(status as ShipmentStatus);