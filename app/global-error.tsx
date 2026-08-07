"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Required top-level fallback for errors thrown outside (or by) the
 * [locale] layout itself, where next-intl's provider may not be available.
 * English-only by necessity — there's no locale context to translate from.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" dir="ltr">
      <body className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-4 max-w-md text-gray-500">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-white px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
