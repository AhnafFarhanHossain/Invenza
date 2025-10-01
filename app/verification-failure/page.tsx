"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { AlertTriangle, Mail } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function VerificationFailure() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const email = searchParams.get("email");
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await axios.post("/api/auth/resend-verification", { email });
      toast.success("Verification email resent successfully!");
      router.push(`/verification-sent?email=${email}`);
    } catch (err) {
      toast.error("Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  const getErrorMessage = () => {
    switch (error) {
      case "notoken":
        return "No verification token was provided.";
      case "invalid":
        return "The verification link is invalid or has expired.";
      case "server":
        return "An unexpected server error occurred.";
      default:
        return "An unknown error occurred.";
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-danger/10">
          <AlertTriangle className="h-10 w-10 text-danger" />
        </div>
        <h1 className="mt-6 font-boldonse text-3xl font-bold text-gray-900">
          Verification Failed
        </h1>
        <p className="mt-4 text-lg text-gray-600">{getErrorMessage()}</p>
        <p className="mt-6 text-base text-gray-500">
          Please choose an option below to continue.
        </p>
        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={handleResend}
            disabled={isResending}
            className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Mail className="mr-2 h-5 w-5" />
            {isResending ? "Resending..." : "Resend Verification Link"}
          </button>
          <Link
            href="/auth/register"
            className="w-full rounded-md border border-gray-300 bg-transparent px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Back to Registration
          </Link>
        </div>
      </div>
    </div>
  );
}