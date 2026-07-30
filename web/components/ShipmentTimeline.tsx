import { MapPin } from 'lucide-react';
import { ShipmentEvent } from '@/lib/types';
import { formatDateTime } from '@/lib/format';
import { statusLabel } from '@/lib/status';

export function ShipmentTimeline({ events }: { events: ShipmentEvent[] }) {
  if (!events || events.length === 0) {
    return <p className="text-sm text-slate-500">No updates yet.</p>;
  }

  // Show newest first.
  const ordered = [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <ol className="space-y-4">
      {ordered.map((event, i) => (
        <li key={event.id ?? i} className="relative pl-6">
          <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-brand-500 ring-4 ring-brand-100" />
          {i < ordered.length - 1 && (
            <span className="absolute left-[4px] top-4 h-[calc(100%+0.25rem)] w-px bg-slate-200" />
          )}
          <div className="flex flex-wrap items-center gap-x-2">
            <p className="font-medium text-slate-900">
              {event.status ? statusLabel(event.status) : 'Update'}
            </p>
            <span className="text-xs text-slate-400">
              {formatDateTime(event.createdAt)}
            </span>
          </div>
          {event.description && (
            <p className="text-sm text-slate-600">{event.description}</p>
          )}
          {event.locationLabel && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3 w-3" /> {event.locationLabel}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}