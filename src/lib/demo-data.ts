export type Severity = "high" | "moderate" | "watch";

export interface DemoEvent {
  id: string;
  title: string;
  corridor: string;
  origin: { x: number; y: number; name: string };
  target: { x: number; y: number; name: string };
  detected: string;
  current: number;
  projected6h: number;
  movement: string;
  bearing: number;
  severity: Severity;
  signals: { label: string; detail: string; strength: number }[];
  confidence: number;
}

/** Map coordinates are in the AtmosphericMap viewBox space (0 0 560 640). */
export const demoEvents: DemoEvent[] = [
  {
    id: "PRV-1042",
    title: "Emerging atmospheric event",
    corridor: "Panipat → Delhi NCR",
    origin: { x: 196, y: 186, name: "Panipat" },
    target: { x: 214, y: 220, name: "Delhi NCR" },
    detected: "10:14 AM",
    current: 181,
    projected6h: 224,
    movement: "↘ Southeast",
    bearing: 135,
    severity: "high",
    confidence: 0.82,
    signals: [
      { label: "Sensor anomaly", detail: "4 stations, +38% PM2.5", strength: 0.86 },
      { label: "Citizen reports", detail: "17 reports in 40 min", strength: 0.64 },
      { label: "Satellite signal", detail: "Aerosol depth elevated", strength: 0.71 },
      { label: "Wind alignment", detail: "312° at 11 km/h", strength: 0.78 },
    ],
  },
  {
    id: "PRV-1038",
    title: "Sustained corridor loading",
    corridor: "Ludhiana Corridor",
    origin: { x: 162, y: 152, name: "Ludhiana" },
    target: { x: 190, y: 182, name: "Karnal" },
    detected: "08:52 AM",
    current: 146,
    projected6h: 168,
    movement: "→ East",
    bearing: 95,
    severity: "moderate",
    confidence: 0.69,
    signals: [
      { label: "Sensor anomaly", detail: "2 stations, +19% PM10", strength: 0.52 },
      { label: "Citizen reports", detail: "6 reports in 2 h", strength: 0.38 },
      { label: "Satellite signal", detail: "Thin plume signature", strength: 0.44 },
      { label: "Wind alignment", detail: "268° at 7 km/h", strength: 0.61 },
    ],
  },
  {
    id: "PRV-1027",
    title: "Localised industrial signature",
    corridor: "Gurugram",
    origin: { x: 206, y: 226, name: "Gurugram" },
    target: { x: 228, y: 244, name: "Faridabad" },
    detected: "07:05 AM",
    current: 122,
    projected6h: 118,
    movement: "↓ South",
    bearing: 170,
    severity: "watch",
    confidence: 0.54,
    signals: [
      { label: "Sensor anomaly", detail: "1 station, +11% NO₂", strength: 0.33 },
      { label: "Citizen reports", detail: "3 reports overnight", strength: 0.22 },
      { label: "Satellite signal", detail: "Below threshold", strength: 0.18 },
      { label: "Wind alignment", detail: "Calm, 3 km/h", strength: 0.3 },
    ],
  },
];

export const severityLabel: Record<Severity, string> = {
  high: "HIGH",
  moderate: "MODERATE",
  watch: "WATCH",
};

export const sensors = [
  { x: 172, y: 168 }, { x: 188, y: 196 }, { x: 204, y: 208 }, { x: 220, y: 232 },
  { x: 150, y: 144 }, { x: 236, y: 252 }, { x: 262, y: 276 }, { x: 196, y: 246 },
  { x: 142, y: 190 }, { x: 268, y: 214 }, { x: 300, y: 300 }, { x: 214, y: 300 },
  { x: 176, y: 262 }, { x: 330, y: 250 }, { x: 250, y: 190 },
];

export const forecastSeries = [
  { t: "Now", value: 181 },
  { t: "+3h", value: 198 },
  { t: "+6h", value: 224 },
  { t: "+9h", value: 219 },
  { t: "+12h", value: 210 },
];

export const regions = [
  { id: "punjab", name: "Punjab", x: 150, y: 150, status: "ONLINE", sensors: 84, reports: 112 },
  { id: "haryana", name: "Haryana", x: 196, y: 198, status: "SYNCING", sensors: 61, reports: 87 },
  { id: "delhi", name: "Delhi NCR", x: 216, y: 226, status: "ONLINE", sensors: 143, reports: 406 },
  { id: "up", name: "Uttar Pradesh", x: 276, y: 250, status: "MONITORING", sensors: 97, reports: 154 },
] as const;

export const regionLinks: [string, string][] = [
  ["punjab", "haryana"],
  ["haryana", "delhi"],
  ["delhi", "up"],
  ["punjab", "delhi"],
];

export const dataSources = [
  { name: "Ground sensor network", detail: "Reference-grade + low-cost PM arrays", state: "Simulated" },
  { name: "Citizen reports", detail: "Photo, voice, text and manual readings", state: "Simulated" },
  { name: "Satellite aerosol depth", detail: "Daily optical retrievals", state: "Simulated" },
  { name: "Weather & wind fields", detail: "Boundary-layer and surface wind", state: "Simulated" },
];
