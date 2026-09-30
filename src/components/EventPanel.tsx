import { Link } from "@tanstack/react-router";
import { severityLabel, type DemoEvent } from "@/lib/demo-data";

const severityClass: Record<DemoEvent["severity"], string> = {
  high: "text-critical border-critical/30 bg-critical/8",
  moderate: "text-warning-foreground border-warning/40 bg-warning/12",
  watch: "text-primary border-primary/25 bg-primary/8",
};

export function EventPanel({ event, onClose }: { event: any; onClose?: () => void }) {
  const severityStr = event.severity as keyof typeof severityClass;
  return (
    <div className="panel w-[21rem] rounded-xl shadow-panel rise-in">
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <div>
          <p className="numeric text-[0.8125rem] text-foreground">{event.id}</p>
          <p className="mt-1 text-[0.8125rem] text-muted-foreground">{event.title}</p>
        </div>
        <span
          className={`rounded border px-1.5 py-0.5 text-[0.625rem] tracking-[0.1em] ${severityClass[severityStr]}`}
        >
          {severityLabel[severityStr as keyof typeof severityLabel] || event.severity}
        </span>
      </div>

      <p className="px-5 pt-3 text-[0.9375rem] tracking-tight text-foreground">{event.corridor}</p>

      <div className="mt-4 grid grid-cols-2 gap-px border-y border-border bg-border">
        <Metric label="Detected" value={new Date(event.detected_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} />
        <Metric label="Movement" value={event.movement} />
        <Metric label="Current" value={String(event.current_measurement)} big />
        <Metric label="Projected 6h" value={String(event.projected_6h)} big />
      </div>

      <div className="px-5 py-4">
        <p className="label-xs">Signals</p>
        <ul className="mt-3 space-y-2.5">
          {event.signals?.map((s: any) => (
            <li key={s.label} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-[0.75rem] text-foreground">{s.label}</span>
              <span className="h-px flex-1 bg-border">
                <span
                  className="block h-px bg-primary"
                  style={{ width: `${Math.round(s.strength * 100)}%` }}
                />
              </span>
              <span className="numeric w-8 text-right text-[0.6875rem] text-muted-foreground">
                {Math.round(s.strength * 100)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <Link
          to="/events/$eventId"
          params={{ eventId: event.id }}
          className="text-[0.75rem] text-primary transition-opacity hover:opacity-70"
        >
          Open event detail →
        </Link>
        {onClose && (
          <button onClick={onClose} className="label-xs transition-colors hover:text-foreground">
            Close
          </button>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="bg-surface px-5 py-3">
      <p className="label-xs">{label}</p>
      <p className={`numeric mt-1.5 text-foreground ${big ? "text-2xl" : "text-[0.875rem]"}`}>{value}</p>
    </div>
  );
}
