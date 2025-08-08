"use client";

import { TopBar } from "@/components/top-bar";
import { SignUpForm } from "@/components/forms";

export default function SignUpPage() {
  return (
    <div className="flex flex-col h-full w-full items-center">
      <TopBar showLogo />

      <div className="space-y-2 py-4">
        <h1 className="text-center font-semibold text-xl">Sign Up to GroupGPT</h1>

        <SignUpForm />

        <p className="text-center mt-2">Already have an account?&nbsp;
          <a href="/signin" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
