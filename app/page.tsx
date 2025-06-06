"use client";

import { TopBar } from "@/components/top-bar/top-bar";

export default function HomePage() {
  return (
    <div className="flex flex-col h-full w-full items-center gap-5">
      <TopBar showLogo title="Home Page"/>
      <div className="flex justify-center items-center h-[calc(100%-80px)]">
        <p className="font-semibold">Welcome to GroupGPT</p>
      </div>
    </div>
  );
}