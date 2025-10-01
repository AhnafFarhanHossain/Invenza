import RegisterForm from "@/components/auth/register-form";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
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
            Create Your Account
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Join Invenza and streamline your inventory management.
          </p>
        </div>
        <RegisterForm />
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
