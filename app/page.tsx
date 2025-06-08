"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/top-bar/top-bar";

export default function HomePage() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/signin");
  };

  const handleSignUpClick = () => {
    router.push("/signup");
  };

  return (
    <div className="flex flex-col h-full w-full items-center gap-5">
      <TopBar showLogo title="GroupGPT">
        <Button
          variant="ghost"
          onClick={ handleLoginClick }
        >
          Sign In
        </Button>
        <Button
          variant="default"
          onClick={ handleSignUpClick }
          className="hidden sm:flex"  // Hide button on small screens
        >
          Sign Up
        </Button>
      </TopBar>

      <div className="flex justify-center items-center h-[calc(100%-80px)]">
        <p className="font-semibold">Welcome to GroupGPT</p>
      </div>
    </div>
  );
}