import Spinner from "@/components/spinner";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
