import Link from "next/link";
import type { ReactNode } from "react";

type RouteFeedbackTone = "neutral" | "danger" | "warning";

type RouteFeedbackPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  statusCode?: string;
  tone?: RouteFeedbackTone;
  children?: ReactNode;
};

const statusToneClassNames: Record<RouteFeedbackTone, string> = {
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
};

export function RouteFeedbackPanel({
  eyebrow,
  title,
  description,
  statusCode,
  tone = "neutral",
  children,
}: RouteFeedbackPanelProps) {
  return (
    <main className="min-h-screen bg-[#f6f8fb] px-6 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center">
        <div className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold text-teal-700">
                {eyebrow}
              </p>
              <h1 className="text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>

            {statusCode ? (
              <span
                className={`inline-flex shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold ${statusToneClassNames[tone]}`}
              >
                {statusCode}
              </span>
            ) : null}
          </div>

          {children ? (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {children}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export function RouteFeedbackLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center justify-center rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
    >
      {children}
    </Link>
  );
}

export function RouteSecondaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
    >
      {children}
    </Link>
  );
}

export function RouteLoadingSkeleton({ label }: { label: string }) {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen bg-[#f6f8fb] px-6 py-10"
    >
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center">
        <div className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <p className="text-sm font-semibold text-teal-700">{label}</p>
              <div className="mt-4 h-8 w-64 max-w-full animate-pulse rounded-md bg-slate-200" />
            </div>
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-teal-700" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                <div className="mt-4 h-8 w-20 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 p-4">
            <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
            <div className="mt-5 space-y-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-10 animate-pulse rounded bg-slate-100"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
