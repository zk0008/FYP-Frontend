"use client";
import { useEffect, useRef, useState } from "react";
import { getChats, insertChat, promptModel, subscribeToChat } from "./utils";
import { Chat } from "./types";

export default function Home() {
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<string>("User1");
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);

  const prompt = async () => {
    const res = await promptModel(chats);
    await insertChat("AI Chatbot", res);
  };

  const loadChats = async () => {
    const data = await getChats();
    if (data) setChats(data);
  };

  const handleClick = async () => {
    await insertChat(currentUser, currentMessage);
    setCurrentMessage("");
    await loadChats();
  };

  useEffect(() => {
    loadChats();
    subscribeToChat(loadChats);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <div className="flex flex-col h-full w-full items-center gap-5">
      <div className="flex justify-between items-center py-2 p-4 h-20 bg-black border-b">
        <h1 className="flex items-center text-2xl font-semibold text-white">
          Group Chat Application
        </h1>
      </div>
      <div className="flex items-center flex-col w-full h-3/4">
        <div className="flex justify-start items-center h-10 gap-1 w-3/4 mb-5">
          <h1 className="flex items-center font-bold text-xl w-fit">
            Username:
          </h1>
          <input
            type="text"
            className="border-black border w-52 p-2 font-semibold"
            defaultValue="User1"
            onChange={(e) => {
              e.preventDefault();
              setCurrentUser(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-5 items-center justify-start w-3/4 bg-black overflow-y-scroll p-3 border-2 border-black">
          {chats.map((chat, index) => {
            return (
              <div
                key={index}
                className={`flex w-full ${
                  currentUser == chat.user ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`w-1/2 rounded-lg flex flex-col justify-between gap-1 p-2 ${
                    currentUser == chat.user ? "bg-blue-200" : "bg-white"
                  }`}
                >
                  <h1 className="font-semibold text-xl">{chat.user}</h1>
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
            className="rounded-md p-1"
            value={currentMessage}
            onChange={(e) => {
              e.preventDefault();
              setCurrentMessage(e.target.value);
            }}
          />
          <button
            className="rounded-md w-28 px-2 font-bold bg-white active:bg-slate-400"
            onClick={handleClick}
          >
            Send
          </button>
        </div>
      </div>
      <button
        className="rounded-md w-28 px-2 font-bold bg-white active:bg-slate-400"
        onClick={prompt}
      >
        Prompt
      </button>
    </div>
  );
}
