"use client";

import { TopBar } from "@/components/top-bar";
import { SignUpForm } from "@/components/forms";

export default function SignUpPage() {
  return (
    <div className="flex flex-col h-full w-full items-center gap-5">
      <TopBar showLogo />
      <div className="pt-16">
        <h1 className="text-center my-2 font-semibold text-xl">Sign up to GroupGPT</h1>
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
