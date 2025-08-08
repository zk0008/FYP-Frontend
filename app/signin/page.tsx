"use client";

import { TopBar } from "@/components/top-bar";
import { SignInForm } from "@/components/forms";

export default function SignInPage() {
  return (
    <div className="flex flex-col h-full w-full items-center">
      <TopBar showLogo />

      <div className="space-y-2 py-4">
        <h1 className="text-center font-semibold text-xl">Sign In to GroupGPT</h1>

        <SignInForm />

        <p className="text-center mt-2">Don&apos;t have an account?&nbsp;
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
}
