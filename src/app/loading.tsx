export default function Loading() {
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
              <p className="text-sm font-semibold text-teal-700">
                Loading workspace
              </p>
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
