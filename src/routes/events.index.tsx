import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section, DemoBadge } from "@/components/Primitives";
import { demoEvents, severityLabel } from "@/lib/demo-data";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Events — PRAVAAH-X" },
      {
        name: "description",
        content: "Every emerging atmospheric event currently tracked across the northern corridor.",
      },
      { property: "og:title", content: "Events — PRAVAAH-X" },
      {
        property: "og:description",
        content: "Emerging atmospheric events, their corridors and projected loads.",
      },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  return (
    <Section className="py-16">
      <PageHeader
        eyebrow="Events"
        title="Tracked atmospheric events"
        description="Each event is assembled from sensor anomalies, citizen reports, satellite signatures and wind alignment."
        action={<DemoBadge />}
      />

      <div className="mt-10 overflow-hidden rounded-xl border border-border">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface">
              {["Event", "Corridor", "Detected", "Current", "Projected 6h", "Movement", "Status"].map(
                (h) => (
                  <th key={h} className="label-xs px-5 py-3 font-normal">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {demoEvents.map((e) => (
              <tr key={e.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary">
                <td className="px-5 py-4">
                  <Link
                    to="/events/$eventId"
                    params={{ eventId: e.id }}
                    className="numeric text-[0.8125rem] text-foreground hover:text-primary"
                  >
                    {e.id}
                  </Link>
                </td>
                <td className="px-5 py-4 text-[0.8125rem] text-foreground">{e.corridor}</td>
                <td className="numeric px-5 py-4 text-[0.8125rem] text-muted-foreground">{e.detected}</td>
                <td className="numeric px-5 py-4 text-[0.9375rem] text-foreground">{e.current}</td>
                <td className="numeric px-5 py-4 text-[0.9375rem] text-foreground">{e.projected6h}</td>
                <td className="px-5 py-4 text-[0.8125rem] text-muted-foreground">{e.movement}</td>
                <td className="label-xs px-5 py-4">{severityLabel[e.severity]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
