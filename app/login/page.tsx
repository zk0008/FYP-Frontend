"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { TopBar } from "@/components/layout/top-bar";
import { LoginForm } from "@/components/forms";
import { useToast } from "@/hooks";

export default function LoginPage() {
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
    <div className="flex flex-col h-full w-full items-center gap-5">
      <TopBar showLogo title="Login" />
      <LoginForm />
    </div>
  )
}
