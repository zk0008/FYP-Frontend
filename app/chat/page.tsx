"use client";
import { useEffect, useRef, useState } from "react";
import {
  getChats,
  getUser,
  insertChat,
  logOutUser,
  promptModel,
  subscribeToChat,
} from "../utils";
import { Chat } from "../types";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChatPage() {
  const router = useRouter();
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);

  const handleLogOut = async () => {
    await logOutUser();
    router.push("/");
  };

  const handlePrompt = async () => {
    const res = await promptModel(chats);
    await insertChat("AI Chatbot", res);
  };

  const loadChats = async () => {
    const data = await getChats();
    if (data) setChats(data);
  };

  const getAndSetUsername = async () => {
    const user = await getUser();
    setCurrentUsername(user?.user_metadata.username);
  };

  const handleClick = async () => {
    await insertChat(currentUsername, currentMessage);
    setCurrentMessage("");
    await loadChats();
  };

  useEffect(() => {
    getAndSetUsername();
    loadChats();
    subscribeToChat(loadChats);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <div className="flex flex-col h-full w-full items-center gap-5">
      <div className="flex justify-between items-center py-2 p-4 h-20 bg-black border-b w-full">
        <h1 className="flex items-center text-2xl font-semibold text-white">
          Group Chat Application
        </h1>
      </div>
      {currentUsername ? (
        <div className="flex items-center flex-col w-full h-3/4">
          <div className="flex justify-start items-center h-10 gap-1 w-3/4 mb-5">
            <h1 className="flex items-center font-bold text-xl w-fit">
              Welcome, {currentUsername}
            </h1>
            <button
              className="border-2 border-black rounded-md w-28 p-2 font-bold bg-white active:bg-slate-400"
              onClick={handleLogOut}
            >
              Log out
            </button>
          </div>
          <div className="h-full flex flex-col gap-5 items-center justify-start w-3/4 bg-black overflow-y-scroll p-3 border-2 border-black">
            {chats.map((chat, index) => {
              return (
                <div
                  key={index}
                  className={`flex w-full ${
                    currentUsername == chat.username
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`w-1/2 rounded-lg flex flex-col justify-between gap-1 p-2 ${
                      currentUsername == chat.username
                        ? "bg-blue-200"
                        : "bg-white"
                    }`}
                  >
                    <h1 className="font-semibold text-xl">{chat.username}</h1>
                    <p className="text-wrap break-words">{chat.message}</p>
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef}></div>
          </div>
          <div className="bg-black h-16 w-3/4 p-2 flex justify-between items-center gap-2">
            <input
              type="text"
              className="rounded-md p-1 w-full h-full"
              value={currentMessage}
              onChange={(e) => {
                e.preventDefault();
                setCurrentMessage(e.target.value);
              }}
            />
            <button
              className="h-full rounded-md w-28 px-2 font-bold bg-white active:bg-slate-400"
              onClick={handleClick}
            >
              Send
            </button>
          </div>
          <button
            className="border-2 border-black rounded-md w-28 p-2 font-bold bg-white active:bg-slate-400"
            onClick={handlePrompt}
          >
            Prompt
          </button>
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
