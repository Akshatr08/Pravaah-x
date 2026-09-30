import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AtmosphericMap } from "@/components/AtmosphericMap";
import { EventPanel } from "@/components/EventPanel";
import { DemoBadge, LiveBadge, Section } from "@/components/Primitives";
import { dataSources, severityLabel } from "@/lib/demo-data";
import { fetchEvents } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Center — PRAVAAH-X" },
      {
        name: "description",
        content:
          "Detect emerging pollution events, trace their movement and understand what happens next.",
      },
      { property: "og:title", content: "Command Center — PRAVAAH-X" },
      {
        property: "og:description",
        content: "Atmospheric intelligence, before the crisis.",
      },
    ],
  }),
  component: CommandCenter,
});

function CommandCenter() {
  const [selected, setSelected] = useState<string | null>("PRV-1042");
  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const activeEvent = events.find((e: any) => e.id === selected) ?? null;

  return (
    <div className="pb-28">
      <Section className="pt-16 pb-10">
        <p className="label-xs">Command Center</p>
        <h1 className="mt-5 max-w-3xl text-[2.5rem] leading-[1.05] tracking-tight text-foreground sm:text-[3.5rem]">
          Atmospheric intelligence,
          <br />
          before the crisis.
        </h1>
        <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-muted-foreground">
          Detect emerging pollution events. Trace their movement. Understand what happens next.
        </p>
      </Section>

      <Section>
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface">
          <div className="grid lg:grid-cols-[1fr_auto]">
            <AtmosphericMap
              events={events.map((e: any) => ({
                ...e,
                origin: { x: e.origin_x, y: e.origin_y, name: e.origin_name },
                target: { x: e.target_x, y: e.target_y, name: e.target_name }
              }))}
              selectedId={selected}
              onSelect={(e: any) => setSelected(e.id)}
              className="min-h-[560px] px-6 py-4"
            />
            <aside className="border-t border-border lg:w-[22rem] lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between px-5 py-4">
                <p className="label-xs">Active events</p>
                <span className="numeric text-[0.75rem] text-muted-foreground">
                  {events.length}
                </span>
              </div>
              <ul className="border-t border-border">
                {events.map((e: any) => (
                  <li key={e.id}>
                    <button
                      onClick={() => setSelected(e.id)}
                      className={`flex w-full items-baseline justify-between gap-4 border-b border-border px-5 py-4 text-left transition-colors hover:bg-secondary ${
                        selected === e.id ? "bg-secondary" : ""
                      }`}
                    >
                      <span>
                        <span className="numeric block text-[0.8125rem] text-foreground">{e.id}</span>
                        <span className="mt-1 block text-[0.8125rem] text-muted-foreground">
                          {e.corridor}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="numeric block text-[1.125rem] text-foreground">
                          {e.current_measurement}
                        </span>
                        <span className="label-xs mt-1 block">{severityLabel[e.severity as keyof typeof severityLabel] || e.severity}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="px-5 py-5">
                <p className="label-xs">Network</p>
                <dl className="mt-3 space-y-2 text-[0.8125rem]">
                  <Row label="Sensors reporting" value="385" />
                  <Row label="Citizen reports (24h)" value="759" />
                  <Row label="Model refresh" value="4 min ago" />
                </dl>
              </div>
            </aside>
          </div>

          <div className="pointer-events-none absolute left-10 top-8 flex flex-col items-start gap-2">
            <LiveBadge />
            <DemoBadge />
          </div>

          {activeEvent && (
            <div className="absolute bottom-8 left-10 hidden xl:block">
              <EventPanel event={activeEvent} onClose={() => setSelected(null)} />
            </div>
          )}
        </div>

        {activeEvent && (
          <div className="mt-6 xl:hidden">
            <EventPanel event={activeEvent} onClose={() => setSelected(null)} />
          </div>
        )}
      </Section>

      <Section className="mt-24">
        <div className="flex items-end justify-between border-b border-border pb-5">
          <h2 className="text-[1.25rem] tracking-tight text-foreground">Data sources</h2>
          <Link to="/network" className="text-[0.8125rem] text-primary hover:opacity-70">
            Regional network →
          </Link>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {dataSources.map((s) => (
            <div key={s.name} className="bg-background px-5 py-6">
              <p className="text-[0.875rem] text-foreground">{s.name}</p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">{s.detail}</p>
              <p className="label-xs mt-5">{s.state}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="numeric text-foreground">{value}</dd>
    </div>
  );
}
