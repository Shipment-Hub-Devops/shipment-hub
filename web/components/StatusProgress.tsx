import { STATUS_FLOW, statusLabel, statusStepIndex } from '@/lib/status';

// Horizontal stepper showing progress along the shipment lifecycle.
export function StatusProgress({ status }: { status: string }) {
  const current = statusStepIndex(status);
  const cancelled = status === 'cancelled';

  return (
    <ol className="flex flex-wrap items-center gap-y-2">
      {STATUS_FLOW.map((step, i) => {
        const done = !cancelled && i <= current;
        return (
          <li key={step} className="flex items-center">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                done ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`ml-2 text-xs ${
                done ? 'font-medium text-slate-900' : 'text-slate-400'
              }`}
            >
              {statusLabel(step)}
            </span>
            {i < STATUS_FLOW.length - 1 && (
              <span className="mx-3 h-px w-6 bg-slate-200" />
            )}
          </li>
        );
      })}
      {cancelled && (
        <li className="ml-3 text-xs font-medium text-red-600">Cancelled</li>
      )}
    </ol>
  );
}