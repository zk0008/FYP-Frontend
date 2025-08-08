"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/top-bar";

const COUNTDOWN_SECONDS = 5;

export default function ConfirmedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isLoading, setIsLoading] = useState(true);

  const success = searchParams.get("success") === "true";

  useEffect(() => {
    setIsLoading(false);

    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      router.push("/signin");  // Automatically redirect to sign-in after countdown
    }
  }, [success, countdown, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center">
        <TopBar showLogo />
        <div className="flex items-center gap-2 py-4">
          <LoaderCircle className="animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full items-center">
      <TopBar showLogo />

      {success ? (
        <div className="text-center space-y-4 py-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-xl font-semibold text-gray-900">
              Sign Up Confirmed
            </h1>

            <p className="text-gray-600">
              Your email has been verified. You can now sign in to start using GroupGPT.
            </p>

            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Redirecting to sign-in page in {countdown} seconds...
              </p>

              <div className="space-y-2">
                <Button onClick={() => router.push("/signin")} className="w-full">
                  Sign In Now
                </Button>
                <Button onClick={() => router.push("/")} className="w-full" variant="link">
                  Return to Home
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-xl font-semibold text-gray-900">
              Sign Up Failed
            </h1>

            <p className="text-gray-600">
              We couldn&apos;t verify your email. The confirmation link may be invalid, expired, or already used.
            </p>

            <div className="space-y-2">
              <Button onClick={() => router.push("/signup")} className="w-full">
                Try Signing Up Again
              </Button>
              <Button onClick={() => router.push("/signin")} className="w-full" variant="outline">
                Sign In Instead
              </Button>
              <Button onClick={() => router.push("/")} className="w-full" variant="link">
                Return to Home
              </Button>
            </div>
          </div>
        )}
    </div>
  );
}