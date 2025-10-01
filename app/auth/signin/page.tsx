import LoginForm from "@/components/auth/login-form";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/invenza-white.png"
              alt="Invenza Logo"
              width={150}
              height={50}
              priority
            />
          </Link>
          <h1 className="mt-6 font-boldonse text-4xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Sign in to access your Invenza dashboard.
          </p>
        </div>
        <LoginForm />
        <p className="mt-8 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
