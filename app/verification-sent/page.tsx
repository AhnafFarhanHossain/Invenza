"use client";

import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";

export default function VerificationSent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mt-6 font-boldonse text-3xl font-bold text-gray-900">
          Confirm Your Email
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          We&apos;ve sent a verification link to your email address:
        </p>
        <p className="mt-2 text-xl font-semibold text-primary">{email}</p>
        <p className="mt-6 text-base text-gray-500">
          Please check your inbox and click the link to activate your account.
          If you don&apos;t see the email, please check your spam folder.
        </p>
      </div>
      <p className="mt-8 text-sm text-gray-500">
        Didn&apos;t receive the email?{" "}
        <a href="#" className="font-medium text-primary hover:underline">
          Resend verification link
        </a>
      </p>
    </div>
  );
}