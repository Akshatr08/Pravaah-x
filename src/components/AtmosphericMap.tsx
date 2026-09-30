import { useId } from "react";
import { demoEvents, sensors, type DemoEvent } from "@/lib/demo-data";

const INDIA_PATH =
  "M232,58 L268,50 L286,80 L330,92 L352,128 L400,132 L430,112 L452,140 L436,180 L462,196 L500,188 L516,214 L486,240 L470,286 L436,300 L410,282 L392,300 L398,340 L372,404 L336,486 L306,560 L286,604 L268,566 L246,494 L214,432 L176,386 L150,332 L120,300 L106,262 L128,236 L118,202 L146,186 L170,150 L196,132 L204,96 Z";

const INNER_BOUNDARIES = [
  "M146,186 L206,168 L250,196 L232,246 L176,262 Z",
  "M206,168 L268,150 L316,182 L292,232 L250,196 Z",
  "M232,246 L292,232 L340,268 L306,320 L248,304 Z",
  "M176,262 L232,246 L248,304 L204,338 L158,312 Z",
];

const FLOW_LINES = [
  "M120,150 C190,130 250,180 330,168",
  "M110,214 C186,196 262,246 352,226",
  "M132,286 C204,262 286,318 372,294",
  "M160,352 C228,330 300,382 386,358",
];

const severityColor: Record<DemoEvent["severity"], string> = {
  high: "var(--color-critical)",
  moderate: "var(--color-warning)",
  watch: "var(--color-primary)",
};

export interface PlumeConfig {
  /** degrees, 0 = north, clockwise */
  direction: number;
  /** km/h */
  speed: number;
  /** 0–1 */
  intensity: number;
  /** hours */
  horizon: number;
  origin: { x: number; y: number };
}

interface Props {
  events?: DemoEvent[];
  selectedId?: string | null;
  onSelect?: (event: DemoEvent) => void;
  showFlow?: boolean;
  showForecastZones?: boolean;
  plume?: PlumeConfig;
  className?: string;
  children?: React.ReactNode;
}

export function AtmosphericMap({
  events = demoEvents,
  selectedId,
  onSelect,
  showFlow = true,
  showForecastZones = true,
  plume,
  className,
  children,
}: Props) {
  const uid = useId().replace(/:/g, "");

  const plumeGeometry = (() => {
    if (!plume) return null;
    const rad = ((plume.direction - 90) * Math.PI) / 180;
    const reach = plume.speed * plume.horizon * 1.15;
    const spread = 18 + plume.horizon * 2.4 + (1 - plume.intensity) * 22;
    const { x, y } = plume.origin;
    const tipX = x + Math.cos(rad) * reach;
    const tipY = y + Math.sin(rad) * reach;
    const nx = -Math.sin(rad);
    const ny = Math.cos(rad);
    return {
      tipX,
      tipY,
      path: `M${x - nx * 8},${y - ny * 8} Q${x + Math.cos(rad) * reach * 0.55 + nx * spread},${
        y + Math.sin(rad) * reach * 0.55 + ny * spread
      } ${tipX},${tipY} Q${x + Math.cos(rad) * reach * 0.55 - nx * spread},${
        y + Math.sin(rad) * reach * 0.55 - ny * spread
      } ${x + nx * 8},${y + ny * 8} Z`,
      axis: `M${x},${y} L${tipX},${tipY}`,
    };
  })();

  return (
    <div className={`relative ${className ?? ""}`}>
      <svg viewBox="0 0 560 640" className="h-full w-full" role="img" aria-label="Atmospheric map of India with demo pollution events">
        <defs>
          <pattern id={`grid-${uid}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="var(--color-grid)" strokeWidth="0.6" />
          </pattern>
          <radialGradient id={`hot-${uid}`}>
            <stop offset="0%" stopColor="var(--color-critical)" stopOpacity="0.4" />
            <stop offset="55%" stopColor="var(--color-warning)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--color-warning)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`plume-${uid}`}>
            <stop offset="0%" stopColor="var(--color-critical)" stopOpacity="0.34" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.05" />
          </radialGradient>
          <clipPath id={`land-${uid}`}>
            <path d={INDIA_PATH} />
          </clipPath>
        </defs>

        <rect width="560" height="640" fill={`url(#grid-${uid})`} opacity="0.7" />

        <path d={INDIA_PATH} fill="var(--color-land)" stroke="var(--color-border-strong)" strokeWidth="1" strokeLinejoin="round" />

        <g clipPath={`url(#land-${uid})`}>
          {INNER_BOUNDARIES.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="var(--color-border)" strokeWidth="0.8" />
          ))}

          {showFlow &&
            FLOW_LINES.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="0.9"
                opacity="0.35"
                className="flow-line"
                style={{ animationDelay: `${i * -1.6}s` }}
              />
            ))}

          {showForecastZones &&
            events.map((e) => (
              <circle
                key={`zone-${e.id}`}
                cx={e.target.x}
                cy={e.target.y}
                r={e.severity === "high" ? 46 : e.severity === "moderate" ? 34 : 24}
                fill={`url(#hot-${uid})`}
                className="plume-drift"
              />
            ))}

          {plumeGeometry && (
            <g>
              <path d={plumeGeometry.path} fill={`url(#plume-${uid})`} className="plume-drift" />
              <path
                d={plumeGeometry.axis}
                stroke="var(--color-primary)"
                strokeWidth="0.9"
                fill="none"
                opacity="0.5"
                className="flow-line"
              />
              <circle cx={plumeGeometry.tipX} cy={plumeGeometry.tipY} r="2.4" fill="var(--color-primary)" />
            </g>
          )}

          {sensors.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r="1.5" fill="var(--color-muted-foreground)" opacity="0.5" />
          ))}
        </g>

        {events.map((e) => {
          const active = selectedId === e.id;
          const color = severityColor[e.severity];
          return (
            <g
              key={e.id}
              onClick={() => onSelect?.(e)}
              className={onSelect ? "cursor-pointer" : undefined}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              onKeyDown={(ev) => {
                if (onSelect && (ev.key === "Enter" || ev.key === " ")) onSelect(e);
              }}
            >
              <path
                d={`M${e.origin.x},${e.origin.y} Q${(e.origin.x + e.target.x) / 2 + 14},${
                  (e.origin.y + e.target.y) / 2 - 12
                } ${e.target.x},${e.target.y}`}
                fill="none"
                stroke={color}
                strokeWidth={active ? 1.4 : 1}
                opacity={active ? 0.85 : 0.5}
                className="flow-line"
              />
              <circle cx={e.origin.x} cy={e.origin.y} r="10" fill={color} opacity="0.1" />
              <circle cx={e.origin.x} cy={e.origin.y} r={active ? 4 : 3.2} fill={color} />
              <circle
                cx={e.origin.x}
                cy={e.origin.y}
                r="4"
                fill={color}
                style={{ transformOrigin: `${e.origin.x}px ${e.origin.y}px`, animation: "pravaah-pulse 3.2s ease-out infinite" }}
              />
              <text
                x={e.origin.x + 10}
                y={e.origin.y - 6}
                className="numeric"
                fontSize="8.5"
                fill="var(--color-foreground)"
                opacity={active ? 1 : 0.72}
              >
                {e.id}
              </text>
              <text x={e.origin.x + 10} y={e.origin.y + 4} fontSize="7.5" fill="var(--color-muted-foreground)">
                {e.corridor}
              </text>
            </g>
          );
        })}
      </svg>
      {children}
    </div>
  );
}
