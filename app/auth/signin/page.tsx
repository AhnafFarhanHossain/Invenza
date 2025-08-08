import LoginForm from "@/components/auth/login-form";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-2">
      <div className="absolute top-2 left-2">
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-none hover:bg-soft-gray transition"
        >
          <MoveLeft className="mr-1 h-4 w-4" />
          Go back
        </Link>
      </div>
      <LoginForm />
    </div>
  );
}
