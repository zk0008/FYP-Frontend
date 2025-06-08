"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { TopBar } from "@/components/top-bar";
import { SignInForm } from "@/components/forms";
import { useToast } from "@/hooks";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const confirmed = searchParams.get("confirmed") === "true";

  useEffect(() => {
    if (confirmed) {
      toast({
        title: "Account created successfully",
        description: "You can now log in with your credentials.",
      });
    }
  }, []);   // Alert should only be shown once on page load

  return (
    <div className="flex flex-col h-full w-full items-center">
      <TopBar showLogo />

      <h1 className="text-center my-4 font-semibold text-xl">Sign in to GroupGPT</h1>

      <SignInForm />

      <p className="text-center mt-2">Don't have an account?&nbsp;
        <a href="/signup" className="text-blue-500 hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  )
}
