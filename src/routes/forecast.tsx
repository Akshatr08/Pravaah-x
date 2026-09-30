import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/Primitives";
import { forecastSeries } from "@/lib/demo-data";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Forecast — PRAVAAH-X" },
      {
        name: "description",
        content: "Projected atmospheric load for the Panipat to Delhi NCR corridor over the next 12 hours.",
      },
      { property: "og:title", content: "Forecast — PRAVAAH-X" },
      { property: "og:description", content: "Prototype model output for corridor load projection." },
    ],
  }),
  component: ForecastPage,
});

const W = 1000;
const H = 340;
const PAD = { l: 48, r: 24, t: 24, b: 40 };

function ForecastPage() {
  const values = forecastSeries.map((p) => p.value);
  const min = Math.floor((Math.min(...values) - 30) / 10) * 10;
  const max = Math.ceil((Math.max(...values) + 20) / 10) * 10;

  const x = (i: number) =>
    PAD.l + (i * (W - PAD.l - PAD.r)) / (forecastSeries.length - 1);
  const y = (v: number) =>
    PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b);

  const line = forecastSeries.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.value)}`).join(" ");
  const area = `${line} L${x(forecastSeries.length - 1)},${H - PAD.b} L${x(0)},${H - PAD.b} Z`;
  const ticks = [min, Math.round((min + max) / 2), max];

  return (
    <Section className="py-16">
      <PageHeader
        eyebrow="Panipat → Delhi NCR"
        title="Forecast"
        description="Projected particulate load for the active corridor. Values are model output, not measurements."
        action={
          <span className="label-xs rounded-full border border-border bg-surface px-3 py-1">
            Prototype model output
          </span>
        }
      />

      <div className="mt-12 grid gap-px bg-border sm:grid-cols-4">
        {forecastSeries.slice(0, 4).map((p) => (
          <div key={p.t} className="bg-background px-6 py-6">
            <p className="label-xs">{p.t}</p>
            <p className="numeric mt-3 text-[2rem] leading-none text-foreground">{p.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-border bg-surface p-6">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-[340px] w-full" role="img" aria-label="Forecast line chart">
          <defs>
            <linearGradient id="fc-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="var(--color-grid)" strokeWidth="1" />
              <text x={PAD.l - 12} y={y(t) + 4} textAnchor="end" fontSize="11" className="numeric" fill="var(--color-muted-foreground)">
                {t}
              </text>
            </g>
          ))}

          <path d={area} fill="url(#fc-fill)" />
          <path d={line} fill="none" stroke="var(--color-primary)" strokeWidth="1.6" strokeLinejoin="round" />

          {forecastSeries.map((p, i) => (
            <g key={p.t}>
              <circle cx={x(i)} cy={y(p.value)} r="3.2" fill="var(--color-background)" stroke="var(--color-primary)" strokeWidth="1.4" />
              <text x={x(i)} y={H - 14} textAnchor="middle" fontSize="11" fill="var(--color-muted-foreground)">
                {p.t}
              </text>
              <text x={x(i)} y={y(p.value) - 14} textAnchor="middle" fontSize="12" className="numeric" fill="var(--color-foreground)">
                {p.value}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <p className="mt-6 max-w-xl text-[0.8125rem] leading-relaxed text-muted-foreground">
        This curve is generated from simulated inputs for interface development. It does not represent
        live measurements or a validated forecast.
      </p>
    </Section>
  );
}
