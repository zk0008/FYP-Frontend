"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/top-bar/top-bar";

export default function HomePage() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignUpClick = () => {
    router.push("/sign-up");
  };

  return (
    <div className="flex flex-col h-full w-full items-center gap-5">
      <TopBar showLogo title="GroupGPT">
        <Button variant="ghost" onClick={ handleLoginClick }>Login</Button>
        <Button variant="default" onClick={ handleSignUpClick }>Sign Up</Button>
      </TopBar>

      <div className="flex justify-center items-center h-[calc(100%-80px)]">
        <p className="font-semibold">Welcome to GroupGPT</p>
      </div>
    </div>
  );
}