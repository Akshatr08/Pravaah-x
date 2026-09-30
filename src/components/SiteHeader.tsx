import { Link } from "@tanstack/react-router";
import { Wordmark } from "./Wordmark";

const nav = [
  { to: "/", label: "Command Center" },
  { to: "/events", label: "Events" },
  { to: "/forecast", label: "Forecast" },
  { to: "/plume", label: "Plume" },
  { to: "/citizen", label: "Citizen Intelligence" },
  { to: "/network", label: "Network" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-10 px-6">
        <Link to="/" className="shrink-0">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-3 py-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <span className="hidden items-center gap-2 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-ok opacity-60 [animation:pravaah-pulse_2.8s_ease-out_infinite]" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-ok" />
            </span>
            <span className="label-xs">System Operational</span>
          </span>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-secondary text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Profile and menu"
          >
            AV
          </button>
        </div>
      </div>
    </header>
  );
}
