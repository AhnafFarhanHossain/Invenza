"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl font-light text-slate-900 dark:text-white tracking-tight">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-medium text-slate-600 dark:text-slate-400 mb-4">
            Page not found
          </h2>
          <p className="text-slate-500 dark:text-slate-500 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <button onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </button>
          </Button>
        </div>
      </div>
    </div>
  );
}
