import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section } from "@/components/Primitives";
import { demoEvents, severityLabel } from "@/lib/demo-data";

export const Route = createFileRoute("/events/$eventId")({
  loader: ({ params }) => {
    const event = demoEvents.find((e) => e.id === params.eventId);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Event not found — PRAVAAH-X" }, { name: "robots", content: "noindex" }] };
    }
    const { event } = loaderData;
    const description = `${event.title} tracked along ${event.corridor}. Current ${event.current}, projected ${event.projected6h} in six hours.`;
    return {
      meta: [
        { title: `${event.id} · ${event.corridor} — PRAVAAH-X` },
        { name: "description", content: description },
        { property: "og:title", content: `${event.id} · ${event.corridor}` },
        { property: "og:description", content: description },
      ],
    };
  },
  notFoundComponent: EventNotFound,
  component: EventDetail,
});

function EventNotFound() {
  return (
    <Section className="py-24">
      <h1 className="text-[1.75rem] tracking-tight text-foreground">Event not found</h1>
      <Link to="/events" className="mt-4 inline-block text-[0.8125rem] text-primary hover:opacity-70">
        ← Back to events
      </Link>
    </Section>
  );
}

function EventDetail() {
  const { event } = Route.useLoaderData();

  return (
    <Section className="py-16">
      <Link to="/events" className="label-xs transition-colors hover:text-foreground">
        ← Events
      </Link>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="numeric text-[0.8125rem] text-muted-foreground">{event.id}</p>
          <h1 className="mt-3 text-[2.25rem] leading-tight tracking-tight text-foreground sm:text-[2.75rem]">
            {event.title}
          </h1>
          <p className="mt-3 text-[1.0625rem] text-muted-foreground">{event.corridor}</p>
        </div>
        <span className="label-xs rounded-full border border-border bg-surface px-3 py-1 text-foreground">
          Status · {severityLabel[event.severity]}
        </span>
      </div>

      <div className="mt-10 grid gap-px bg-border sm:grid-cols-4">
        <Stat label="Detected" value={event.detected} />
        <Stat label="Current" value={String(event.current)} big />
        <Stat label="Projected 6h" value={String(event.projected6h)} big />
        <Stat label="Movement" value={event.movement} />
      </div>

      <div className="mt-12 rounded-xl border border-border bg-surface px-6 py-10">
        <p className="label-xs">Transport model</p>
        <svg viewBox="0 0 1000 300" className="mt-8 h-[300px] w-full" role="img" aria-label="Source to downstream plume diagram">
          <defs>
            <linearGradient id="plume-band" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-critical)" stopOpacity="0.28" />
              <stop offset="55%" stopColor="var(--color-warning)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.07" />
            </linearGradient>
          </defs>

          <path
            d="M150,150 C360,96 600,84 860,120 L860,180 C600,216 360,204 150,150 Z"
            fill="url(#plume-band)"
            className="plume-drift"
          />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M150,150 C380,${112 + i * 18} 620,${104 + i * 22} 860,${126 + i * 18}`}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="0.9"
              opacity="0.4"
              className="flow-line"
              style={{ animationDelay: `${i * -2}s` }}
            />
          ))}

          <circle cx="150" cy="150" r="5" fill="var(--color-critical)" />
          <circle
            cx="150"
            cy="150"
            r="5"
            fill="var(--color-critical)"
            style={{ transformOrigin: "150px 150px", animation: "pravaah-pulse 3.4s ease-out infinite" }}
          />
          <text x="150" y="196" textAnchor="middle" fontSize="11" letterSpacing="2" fill="var(--color-muted-foreground)">
            SOURCE
          </text>
          <text x="150" y="214" textAnchor="middle" fontSize="13" fill="var(--color-foreground)">
            {event.origin.name}
          </text>

          <text x="505" y="70" textAnchor="middle" fontSize="11" letterSpacing="2" fill="var(--color-muted-foreground)">
            ATMOSPHERIC FLOW
          </text>

          <circle cx="860" cy="150" r="5" fill="var(--color-primary)" />
          <text x="860" y="196" textAnchor="middle" fontSize="11" letterSpacing="2" fill="var(--color-muted-foreground)">
            DOWNSTREAM REGION
          </text>
          <text x="860" y="214" textAnchor="middle" fontSize="13" fill="var(--color-foreground)">
            {event.target.name}
          </text>
        </svg>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <p className="label-xs">Signals</p>
          <ul className="mt-5 divide-y divide-border border-y border-border">
            {event.signals.map((s) => (
              <li key={s.label} className="flex items-center justify-between gap-6 py-4">
                <div>
                  <p className="text-[0.875rem] text-foreground">{s.label}</p>
                  <p className="mt-1 text-[0.8125rem] text-muted-foreground">{s.detail}</p>
                </div>
                <span className="numeric text-[0.875rem] text-foreground">
                  {Math.round(s.strength * 100)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label-xs">Interpretation</p>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-foreground">
            Combined signal confidence is {Math.round(event.confidence * 100)}%. The corridor between{" "}
            {event.origin.name} and {event.target.name} is aligned with prevailing wind, so downstream
            concentration is expected to rise before dispersion begins.
          </p>
          <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted-foreground">
            All values shown here are simulated for interface development.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Stat({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="bg-background px-6 py-6">
      <p className="label-xs">{label}</p>
      <p className={`numeric mt-3 leading-none text-foreground ${big ? "text-[2rem]" : "text-[1.125rem]"}`}>
        {value}
      </p>
    </div>
  );
}
