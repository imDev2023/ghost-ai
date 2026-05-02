import { BrainCircuit, Users, FileDown, Ghost } from "lucide-react";
import type { ReactNode } from "react";

interface Feature {
  icon: typeof BrainCircuit;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: BrainCircuit,
    title: "AI Architecture Generation",
    description:
      "Describe your system. AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileDown,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-base font-sans">
      {/* Left panel — 50% */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between px-14 py-10 bg-subtle">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-dim">
            <Ghost className="h-4 w-4 text-brand" />
          </div>
          <span className="text-sm font-medium text-copy-primary">Ghost AI</span>
        </div>

        {/* Headline + features */}
        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-copy-primary leading-tight tracking-tight">
            Design systems at the speed of thought.
          </h1>
          <p className="mt-4 text-sm text-copy-muted leading-relaxed">
            Describe your architecture in plain English. Ghost AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>

          <ul className="mt-10 space-y-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-dim">
                  <Icon className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-copy-primary">{title}</p>
                  <p className="mt-0.5 text-xs text-copy-muted leading-relaxed">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-xs text-copy-faint">
          © 2026 Ghost AI. All rights reserved.
        </p>
      </div>

      {/* Right panel — 50% */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
}
