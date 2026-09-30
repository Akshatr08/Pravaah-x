import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, Mic, Type, Gauge, Check, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader, Section, DemoBadge } from "@/components/Primitives";
import { submitReport } from "@/lib/api";

export const Route = createFileRoute("/citizen")({
  head: () => ({
    meta: [
      { title: "Citizen Intelligence — PRAVAAH-X" },
      { name: "description", content: "Add local evidence to the atmospheric intelligence network with photo, voice, text or sensor readings." },
    ],
  }),
  component: CitizenPage,
});

const modes = [
  { id: "photo", label: "Photo", icon: Camera, hint: "Attach an image of smoke, haze or burning" },
  { id: "voice", label: "Voice", icon: Mic, hint: "Record a 30 second spoken note" },
  { id: "text", label: "Text", icon: Type, hint: "Describe what you are seeing" },
  { id: "sensor", label: "Sensor reading", icon: Gauge, hint: "Enter a value from a local device" },
] as const;

const recent = [
  { time: "10:22 AM", place: "Panipat", kind: "Photo", note: "Dense smoke near the highway" },
  { time: "10:04 AM", place: "Sonipat", kind: "Text", note: "Strong burning smell, low visibility" },
  { time: "09:41 AM", place: "Delhi NCR", kind: "Sensor reading", note: "PM2.5 193 µg/m³" },
];

function CitizenPage() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<(typeof modes)[number]["id"]>("photo");
  const [note, setNote] = useState("");
  const [sensorValue, setSensorValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitReport,
    onSuccess: () => {
      setSubmitted(true);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (err) => {
      console.error("Failed to submit report:", err);
      // In a real app we'd show a toast error
    }
  });

  const handleSubmit = () => {
    mutation.mutate({
      location_name: "Panipat, Haryana",
      report_type: mode,
      text_content: note || undefined,
      sensor_value: mode === "sensor" && sensorValue ? parseFloat(sensorValue) : undefined,
    });
  };

  return (
    <Section className="py-16">
      <PageHeader
        eyebrow="Citizen Intelligence"
        title="See something unusual?"
        description="Add local evidence to the atmospheric intelligence network."
        action={<DemoBadge />}
      />

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <div>
          {!open && !submitted && (
            <button
              onClick={() => setOpen(true)}
              className="group flex w-full items-center justify-between rounded-xl border border-border bg-surface px-7 py-8 text-left transition-colors hover:border-border-strong"
            >
              <span>
                <span className="block text-[1.25rem] tracking-tight text-foreground">
                  + Report an event
                </span>
                <span className="mt-2 block text-[0.875rem] text-muted-foreground">
                  Takes under a minute. Location is attached automatically.
                </span>
              </span>
              <span className="label-xs transition-colors group-hover:text-foreground">Start</span>
            </button>
          )}

          {open && !submitted && (
            <div className="rise-in rounded-xl border border-border bg-surface">
              <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
                {modes.map((m) => {
                  const Icon = m.icon;
                  const active = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`flex flex-col items-start gap-3 px-5 py-5 text-left transition-colors ${
                        active ? "bg-accent text-accent-foreground" : "bg-surface hover:bg-secondary"
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                      <span className="text-[0.8125rem] text-foreground">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="px-7 py-7">
                <p className="text-[0.8125rem] text-muted-foreground">
                  {modes.find((m) => m.id === mode)?.hint}
                </p>

                {(mode === "photo" || mode === "voice") && (
                  <div className="mt-5 flex h-40 items-center justify-center rounded-lg border border-dashed border-border-strong bg-background">
                    <p className="text-[0.8125rem] text-muted-foreground">
                      {mode === "photo" ? "Drop an image or click to upload" : "Tap to record"}
                    </p>
                  </div>
                )}

                {mode === "sensor" && (
                  <input
                    className="mt-5 w-full rounded-lg border border-border bg-background px-4 py-3 text-[0.875rem] outline-none focus:border-primary"
                    placeholder="PM2.5 value, µg/m³"
                    value={sensorValue}
                    onChange={(e) => setSensorValue(e.target.value)}
                  />
                )}

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  placeholder="Add context — what you see, smell or measure."
                  className="mt-4 w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-[0.875rem] outline-none focus:border-primary"
                />

                <div className="mt-6 flex items-center justify-between">
                  <p className="label-xs">Location · Panipat, Haryana</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOpen(false)}
                      className="rounded-md px-4 py-2 text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={mutation.isPending}
                      className="rounded-md bg-primary px-4 py-2 text-[0.8125rem] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {mutation.isPending ? "Submitting..." : "Submit report"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {submitted && (
            <div className="rise-in rounded-xl border border-border bg-surface px-7 py-8">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Check className="h-4 w-4" strokeWidth={1.6} />
              </span>
              <p className="mt-5 text-[1.125rem] tracking-tight text-foreground">Report received</p>
              <p className="mt-2 text-[0.875rem] text-muted-foreground">
                In this demo build the report is stored locally and is not sent anywhere.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setNote("");
                }}
                className="mt-6 text-[0.8125rem] text-primary hover:opacity-70"
              >
                Submit another →
              </button>
            </div>
          )}
        </div>

        <aside>
          <p className="label-xs">Recent in your region</p>
          <ul className="mt-5 divide-y divide-border border-y border-border">
            {recent.map((r) => (
              <li key={r.time} className="py-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[0.8125rem] text-foreground">{r.place}</span>
                  <span className="numeric text-[0.6875rem] text-muted-foreground">{r.time}</span>
                </div>
                <p className="mt-1 text-[0.8125rem] text-muted-foreground">{r.note}</p>
                <p className="label-xs mt-2">{r.kind}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Section>
  );
}
