"use client";

import { TopBar } from "@/components/top-bar";
import { SignUpForm } from "@/components/forms";

export default function SignUpPage() {
  return (
    <div className="flex flex-col h-full w-full items-center gap-5">
      <TopBar showLogo title="Sign Up" />
      <SignUpForm />
    </div>
  );
}
