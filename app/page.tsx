import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-full grid place-items-center px-6">
      <section className="max-w-2xl text-center">
        <h1 className="text-2xl font-bold tracking-tight leading-tight">
          <span className="text-dark-base">👋Welcome to</span>{" "}
          <span className="relative inline-block text-foreground">
            Invenza
          </span>
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-dark-base">
          Your all-in-one solution for order tracking and inventory management.
        </p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <Button size="sm" className="px-5 rounded-none text-light-base">
            <Link href={"/auth/signin"}>Sign In</Link>
          </Button>
          <Button size="sm" className="px-5 rounded-none" variant="outline">
            <Link href={"/auth/register"}>Register</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
