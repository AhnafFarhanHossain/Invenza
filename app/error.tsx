"use client";

import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We encountered an unexpected error. Please try again or return to
            the home page.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} size="lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-left">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
