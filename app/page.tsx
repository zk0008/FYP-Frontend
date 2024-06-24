"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logInAndGetUser } from "./utils";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await logInAndGetUser(email, password);
    if (user) router.push("/chat");
  };

  return (
    <div className="flex flex-col h-full w-full items-center gap-5">
      <div className="flex justify-between items-center py-2 p-4 h-20 bg-black border-b w-full">
        <h1 className="flex items-center text-2xl font-semibold text-white">
          Group Chat Application
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-96 border p-4 justify-center items-center gap-5"
      >
        <h1 className="text-2xl font-semibold">Log In</h1>
        <div className="flex flex-col items-center w-3/4">
          <label htmlFor="email">Email</label>
          <input
            className="rounded-md px-1 border-2 border-black w-full h-8"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col items-center w-3/4">
          <label htmlFor="password">Password</label>
          <input
            className="rounded-md px-1 border-2 border-black w-full h-8"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="rounded-lg p-1 border-2 bg-black w-3/4 h-10 font-semibold text-white"
          type="submit"
        >
          Log In
        </button>
        <Link
          href="/signup"
          className="rounded-lg p-1 border-2 w-3/4 h-10 font-semibold text-center"
        >
          Sign Up
        </Link>
      </form>
    </div>
  );
}
