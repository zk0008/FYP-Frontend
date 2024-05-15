"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const supabase = createClient();

  const myRef = useRef(null);
  const [currentUser, setCurrentUser] = useState("User1");
  const [currentMessage, setCurrentMessage] = useState("");
  const [chats, setChats] = useState<any[]>([]);

  const prompt = async () => {
    const data = await fetch("/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chats),
    });
    const res = await data.json();
    console.log(res);
    await supabase.from("chats").insert(res);
  };

  const fetchChats = async () => {
    const { data, error } = await supabase.from("chats").select("*");
    if (data) {
      setChats(data);
    }
  };

  const addChat = async () => {
    await supabase
      .from("chats")
      .insert([{ user: currentUser, message: currentMessage }]);
    setCurrentMessage("");
    await fetchChats();
  };

  useEffect(() => {
    fetchChats();
    supabase
      .channel("chats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        (payload: any) => {
          fetchChats();
        }
      )
      .subscribe();
  }, []);

  useEffect(() => {
    myRef.current.scrollIntoView({ behavior: "smooth" });
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
          <div ref={myRef}></div>
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
            onClick={addChat}
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
