"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpAndGetUser } from "../utils/auth";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await signUpAndGetUser(email, password, username);
    if (user) router.push("/chat");
  };

  return (
    <div className="flex flex-col h-full w-full items-center gap-5">
      <div className="flex justify-between items-center py-2 p-4 h-20 bg-black border-b w-full">
        <h1 className="flex items-center text-2xl font-semibold text-white">
          GroupGPT
        </h1>
      </div>
      <div className="flex justify-center items-center h-[calc(100%-80px)]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-96 border p-4 justify-center items-center gap-5"
        >
          <h1 className="text-2xl font-semibold">Sign Up</h1>
          <div className="flex flex-col items-center w-3/4">
            <label htmlFor="username">Username</label>
            <input
              className="rounded-md px-1 border-2 border-black w-full h-8"
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="rounded-lg p-1 border-2 bg-black w-3/4 h-10 font-semibold text-white hover:bg-neutral-700 active:bg-neutral-400"
            type="submit"
          >
            Sign Up
          </button>
          <Link
            href="/login"
            className="rounded-lg p-1 border-2 w-3/4 h-10 font-semibold text-center hover:bg-slate-200 active:bg-slate-400"
          >
            Log In
          </Link>
        </form>
      </div>
    </div>
  );
}
