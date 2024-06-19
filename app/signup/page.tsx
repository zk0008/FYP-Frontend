"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpAndGetUser } from "../utils";

export default function LoginPage() {
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
          Group Chat Application
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-96 h-96 border p-3 justify-between items-center gap-3"
      >
        <h1 className="text-2xl font-semibold">Sign Up</h1>
        <div className="flex flex-col items-center">
          <label htmlFor="username">Username</label>
          <input
            className="rounded-md px-1 border-2 border-black w-3/4 h-10"
            type="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="email">Email</label>
          <input
            className="rounded-md px-1 border-2 border-black w-3/4 h-10"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="password">Password</label>
          <input
            className="rounded-md px-1 border-2 border-black w-3/4 h-10"
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
          Sign Up
        </button>
      </form>
    </div>
  );
}
