import { createFileRoute } from "@tanstack/react-router";
import { DemoBadge, PageHeader, Section } from "@/components/Primitives";
import { regionLinks, regions } from "@/lib/demo-data";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Regional Network — PRAVAAH-X" },
      {
        name: "description",
        content: "Punjab, Haryana, Delhi NCR and Uttar Pradesh as connected atmospheric intelligence nodes.",
      },
      { property: "og:title", content: "Regional Network — PRAVAAH-X" },
      { property: "og:description", content: "Connected regional nodes and their sync status." },
    ],
  }),
  component: NetworkPage,
});

const layout: Record<string, { x: number; y: number }> = {
  punjab: { x: 160, y: 110 },
  haryana: { x: 400, y: 210 },
  delhi: { x: 640, y: 150 },
  up: { x: 830, y: 300 },
};

function NetworkPage() {
  return (
    <Section className="py-16">
      <PageHeader
        eyebrow="Network"
        title="Regional Network"
        description="Nodes exchange sensor, citizen and satellite signals continuously across the northern corridor."
        action={<DemoBadge />}
      />

      <div className="mt-10 rounded-xl border border-border bg-surface px-6 py-8">
        <svg viewBox="0 0 1000 400" className="h-[400px] w-full" role="img" aria-label="Regional node network">
          {regionLinks.map(([a, b], i) => {
            const p = layout[a];
            const q = layout[b];
            return (
              <g key={`${a}-${b}`}>
                <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="var(--color-border-strong)" strokeWidth="0.8" />
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={q.x}
                  y2={q.y}
                  stroke="var(--color-primary)"
                  strokeWidth="1.2"
                  className="flow-line"
                  style={{ animationDelay: `${i * -1.4}s` }}
                />
              </g>
            );
          })}

          {regions.map((r) => {
            const p = layout[r.id];
            return (
              <g key={r.id}>
                <circle cx={p.x} cy={p.y} r="22" fill="var(--color-background)" stroke="var(--color-border)" />
                <circle cx={p.x} cy={p.y} r="4" fill="var(--color-primary)" />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="var(--color-primary)"
                  style={{ transformOrigin: `${p.x}px ${p.y}px`, animation: "pravaah-pulse 3.6s ease-out infinite" }}
                />
                <text x={p.x} y={p.y + 46} textAnchor="middle" fontSize="13" fill="var(--color-foreground)">
                  {r.name}
                </text>
                <text x={p.x} y={p.y + 64} textAnchor="middle" fontSize="10" letterSpacing="2" fill="var(--color-muted-foreground)">
                  {r.status}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {regions.map((r) => (
          <div key={r.id} className="bg-background px-6 py-6">
            <div className="flex items-baseline justify-between">
              <p className="text-[0.9375rem] text-foreground">{r.name}</p>
              <span className="label-xs">{r.status}</span>
            </div>
            <dl className="mt-5 space-y-2 text-[0.8125rem]">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Sensors</dt>
                <dd className="numeric text-foreground">{r.sensors}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Reports 24h</dt>
                <dd className="numeric text-foreground">{r.reports}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </Section>
  );
}
