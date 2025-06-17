"use client";

import { useEffect, useState } from "react";
import { getUser, signOutUser } from "../utils/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "regenerator-runtime/runtime";
import ChatBox from "./chat";
import {
  startNewTopic,
  getTopics,
  subscribeToTopics,
  acceptTopicInvite,
  declineTopicInvite,
} from "../utils/db";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

export default function ChatPage() {
  const router = useRouter();
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [topics, setTopics] = useState<string[]>([]);
  const [invites, setInvites] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState<string>("");
  const [openAddTopic, setOpenAddTopic] = useState<boolean>(false);

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  const getAndSetUsername = async () => {
    const user = await getUser();
    setCurrentUsername(user?.user_metadata.username);
    loadTopics();
  };

  const loadTopics = async () => {
    let user;
    if (currentUsername == "") {
      const temp = await getUser();
      user = temp?.user_metadata.username;
    } else {
      user = currentUsername;
    }
    const data = await getTopics(user);
    setTopics(data[0]);
    setInvites(data[1]);
  };

  const accept = async (topic: string) => {
    await acceptTopicInvite(currentUsername, topic);
    setCurrentTopic(topic);
  };

  const decline = async (topic: string) => {
    await declineTopicInvite(currentUsername, topic);
  };

  const addChatRoom = async () => {
    await startNewTopic(currentUsername, newTopic);
    setCurrentTopic(newTopic);
    setNewTopic("");
    setOpenAddTopic(false);
  };

  useEffect(() => {
    getAndSetUsername();
    subscribeToTopics(loadTopics);
  }, []);

  useEffect(() => {
    setOpenAddTopic(false);
  }, [currentTopic]);

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
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
      {currentUsername ? (
        <div className="flex items-center justify-between flex-row w-full h-[calc(100%-80px)]">
          <div className="flex flex-col justify-between h-full w-1/5 items-center  bg-neutral-950 p-2">
            <div className="flex flex-col w-full items-center gap-2 overflow-y-auto">
              <button
                onClick={() => {
                  setOpenAddTopic(true);
                }}
                className="text-left p-2 w-full h-10 font-bold text-white rounded-md hover:bg-neutral-800 active:bg-neutral-900"
              >
                + Create Chat Room
              </button>
              {openAddTopic && (
                <div className="flex justify-between items-center w-full gap-2">
                  <input
                    onChange={(e) => {
                      e.preventDefault();
                      setNewTopic(e.target.value);
                    }}
                    className="text-left px-2 w-4/5 h-10 font-bold bg-white rounded-md"
                  />
                  <button
                    onClick={addChatRoom}
                    className="font-bold p-2 h-10 w-1/5 ont-bold bg-green-200 rounded-md hover:bg-green-300"
                  >
                    Add
                  </button>
                </div>
              )}
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
            <div className="flex flex-col w-full items-center gap-2 overflow-y-auto">
              <p className="text-left p-2 w-full h-10 font-bold text-white">
                Chat Room Invites
              </p>
              {invites.map((top, index) => (
                <div
                  className="flex items-center w-full p-2 h-10 justify-between"
                  key={index}
                >
                  <div className="text-ellipsis overflow-x-clip text-left font-semibold text-white w-3/5">
                    {top}
                  </div>
                  <div className="flex justify-center items-end gap-3">
                    <FaCheckCircle
                      className="text-green-300 hover:text-green-500 cursor-pointer"
                      onClick={() => {
                        accept(top);
                      }}
                    />
                    <FaCircleXmark
                      className="text-red-300 hover:text-red-500 cursor-pointer"
                      onClick={() => {
                        decline(top);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ChatBox topic={currentTopic} />
        </div>
      ) : (
        <div className="flex items-center justify-center flex-row w-full h-[calc(100%-80px)]">
          <div className="flex justify-center items-center gap-3">
            <p>You must be logged in to view this page</p>
            <Link
              href="/"
              className="border-2 border-black rounded-md w-28 p-2 font-bold bg-white hover:bg-slate-200 active:bg-slate-400"
            >
              Log In Here
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
