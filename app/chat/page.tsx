"use client";
import { useEffect, useState } from "react";
import { getUser, logOutUser } from "../utils/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "regenerator-runtime/runtime";
import ChatBox from "./chat";
import { getTopics } from "../utils/db";

export default function ChatPage() {
  const router = useRouter();
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [topics, setTopics] = useState<string[]>([]);

  const handleLogOut = async () => {
    await logOutUser();
    router.push("/");
  };

  const getAndSetUsername = async () => {
    const user = await getUser();
    setCurrentUsername(user?.user_metadata.username);
  };

  const loadTopics = async () => {
    const data = await getTopics();
    setTopics(data);
  };

  useEffect(() => {
    getAndSetUsername();
    loadTopics();
  }, []);

  return (
    <div className="flex flex-col h-full w-full items-center">
      <div className="flex justify-between items-center py-2 p-4 h-20 bg-black border-b w-full">
        <h1 className="flex items-center text-2xl font-semibold text-white">
          GroupGPT
        </h1>
        {currentUsername && (
          <div className="flex justify-center items-center h-10 gap-3">
            <h1 className="flex items-center font-bold text-white text-xl w-fit">
              Welcome, {currentUsername}
            </h1>
            <button
              className="border-2 border-black rounded-md w-28 p-2 font-bold bg-white active:bg-slate-400"
              onClick={handleLogOut}
            >
              Log out
            </button>
          </div>
        )}
      </div>
      {currentUsername ? (
        <div className="flex items-center justify-between flex-row w-full h-[calc(100%-80px)]">
          <div className="flex flex-col h-full w-1/5 items-center bg-neutral-950 gap-2 overflow-y-auto p-2">
            <button className="text-left p-2 w-full h-10 font-bold text-white rounded-md hover:bg-neutral-800 active:bg-neutral-900">
              + Add chat room
            </button>
            {topics.map((top, index) => (
              <button
                className={`text-ellipsis overflow-x-clip text-left p-2 w-full h-10 font-semibold text-white rounded-md ${
                  currentTopic == top
                    ? "bg-neutral-600"
                    : "hover:bg-neutral-600"
                }`}
                key={index}
                onClick={() => {
                  setCurrentTopic(top);
                }}
              >
                {top}
              </button>
            ))}
          </div>
          <ChatBox topic={currentTopic} />
        </div>
      ) : (
        <div className="flex justify-center items-center gap-2">
          <p>You must be logged in to view this page</p>
          <Link
            href="/"
            className="border-2 border-black rounded-md w-28 p-2 font-bold bg-white active:bg-slate-400"
          >
            Log In Here
          </Link>
        </div>
      )}
    </div>
  );
}
