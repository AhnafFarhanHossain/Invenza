import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterForm() {
  return (
    <Card className="w-[360px] border-border/60 rounded-none bg-card/70 backdrop-blur-sm shadow-sm focus-within:ring-1 focus-within:ring-ring/50 focus-within:border-ring transition">
      <CardHeader className="space-y-1.5">
        <CardTitle className="text-xl font-semibold tracking-tight">Create account</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Enter your details to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <Button
          type="submit"
          size="sm"
          className="w-full rounded-none uppercase"
        >
          Create account
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/signin" className="underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
