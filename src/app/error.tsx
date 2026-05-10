"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function Error({ error, unstable_retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-6 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center">
        <div className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold text-teal-700">
                Something went wrong
              </p>
              <h1 className="text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
                We could not load this page
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Try again in a moment. If the problem continues, contact your
                system administrator.
              </p>
            </div>

            <span className="inline-flex shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {error.digest ? `Error ${error.digest}` : "Error"}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
