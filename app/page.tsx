"use client";
import { useState } from "react";

export default function Home() {
  const [currentUser, setCurrentUser] = useState("User1");
  const chats = [
    {
      user: "User1",
      message: "Message1",
    },
    {
      user: "User2",
      message:
        "Hello there how are you doing this is a very long message just to test how good this thing is",
    },
    {
      user: "User3",
      message: "Message3",
    },
    {
      user: "User2",
      message: "Message4",
    },
    {
      user: "User1",
      message: "Message5",
    },
    {
      user: "User2",
      message: "Message6",
    },
    {
      user: "User1",
      message: "Message6",
    },
    {
      user: "User1",
      message:
        "Hello there how are you doing this is a very long message just to test how good this thing is",
    },
  ];
  return (
    <main className="flex flex-col h-full w-full items-center gap-5">
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
        <div className="flex flex-col gap-5 items-center justify-start w-3/4 bg-black overflow-y-scroll p-3">
          {chats.map((chat) => {
            return (
              <div
                key={chat.user + chat.message}
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
        </div>
        <div className="bg-black h-16 w-3/4 p-2 flex justify-between items-center gap-2">
          <input type="text" className="rounded-md p-1" />
          <button className="rounded-md w-28 px-2 font-bold bg-white active:bg-slate-400">
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
