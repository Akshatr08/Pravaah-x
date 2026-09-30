import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AtmosphericMap } from "@/components/AtmosphericMap";
import { DemoBadge, PageHeader, Section } from "@/components/Primitives";

export const Route = createFileRoute("/plume")({
  head: () => ({
    meta: [
      { title: "Plume Simulator — PRAVAAH-X" },
      {
        name: "description",
        content: "Explore how an atmospheric event could move across a region under different wind conditions.",
      },
      { property: "og:title", content: "Plume Simulator — PRAVAAH-X" },
      { property: "og:description", content: "Simulate plume travel across the northern corridor." },
    ],
  }),
  component: PlumePage,
});

function PlumePage() {
  const [speed, setSpeed] = useState(11);
  const [direction, setDirection] = useState(135);
  const [intensity, setIntensity] = useState(0.6);
  const [horizon, setHorizon] = useState(6);

  const reach = Math.round(speed * horizon);

  return (
    <Section className="py-16">
      <PageHeader
        eyebrow="Simulation"
        title="Plume Simulator"
        description="Explore how an atmospheric event could move across a region."
        action={<DemoBadge />}
      />

      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-[19rem_1fr]">
        <div className="bg-surface px-6 py-7">
          <Control
            label="Wind speed"
            value={`${speed} km/h`}
            min={2}
            max={30}
            step={1}
            current={speed}
            onChange={setSpeed}
          />
          <Control
            label="Wind direction"
            value={`${direction}°`}
            min={0}
            max={359}
            step={1}
            current={direction}
            onChange={setDirection}
          />
          <Control
            label="Intensity"
            value={`${Math.round(intensity * 100)}%`}
            min={10}
            max={100}
            step={1}
            current={Math.round(intensity * 100)}
            onChange={(v) => setIntensity(v / 100)}
          />
          <Control
            label="Time horizon"
            value={`${horizon} h`}
            min={1}
            max={18}
            step={1}
            current={horizon}
            onChange={setHorizon}
          />

          <div className="mt-8 border-t border-border pt-6">
            <p className="label-xs">Estimated travel</p>
            <p className="numeric mt-2 text-[1.75rem] leading-none text-foreground">{reach} km</p>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Simplified advection model for interface development only.
            </p>
          </div>
        </div>

        <div className="bg-background">
          <AtmosphericMap
            events={[]}
            showForecastZones={false}
            plume={{ direction, speed, intensity, horizon, origin: { x: 196, y: 186 } }}
            className="min-h-[580px] px-6 py-4"
          />
        </div>
      </div>
    </Section>
  );
}

function Control({
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-7 last:mb-0">
      <div className="flex items-baseline justify-between">
        <label className="label-xs">{label}</label>
        <span className="numeric text-[0.8125rem] text-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
        aria-label={label}
      />
    </div>
  );
}
