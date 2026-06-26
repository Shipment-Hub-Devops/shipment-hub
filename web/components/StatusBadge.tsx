import { STATUS_BADGE, statusLabel } from '@/lib/status';

export function StatusBadge({ status }: { status: string }) {
  const cls =
    STATUS_BADGE[status] ?? 'bg-slate-100 text-slate-700 ring-slate-600/20';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
    >
      {statusLabel(status)}
    </span>
  );
}