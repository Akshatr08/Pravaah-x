import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
      <div className="max-w-2xl">
        {eyebrow && <p className="label-xs">{eyebrow}</p>}
        <h1 className="mt-3 text-[2.25rem] leading-[1.08] tracking-tight text-foreground sm:text-[2.75rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 ${className ?? ""}`}
    >
      <span className="h-1 w-1 rounded-full bg-warning" />
      <span className="label-xs">Demo Environment</span>
    </span>
  );
}

export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-critical opacity-70 [animation:pravaah-pulse_2.6s_ease-out_infinite]" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-critical" />
      </span>
      <span className="label-xs text-foreground">Live</span>
    </span>
  );
}

export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-[1400px] px-6 ${className ?? ""}`}>{children}</section>;
}
