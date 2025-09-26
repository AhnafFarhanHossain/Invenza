import RegisterForm from "@/components/auth/register-form";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 font-sans">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-none hover:bg-soft-gray transition"
        >
          <MoveLeft className=" mr-1 h-4 w-4" />
          Go back
        </Link>
      </div>
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
