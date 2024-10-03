"use client";
import { useEffect, useRef, useState } from "react";
import { promptModel, promptPdf } from "../utils/api";
import { Chat } from "../types";
import { getChats, insertChat, subscribeToChat } from "../utils/db";
import { getUser } from "../utils/auth";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "regenerator-runtime/runtime";

export default function ChatBox({ topic }: { topic: string }) {
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [openToolbar, setOpenToolbar] = useState<boolean>(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startRecording = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopRecording = async () => {
    await SpeechRecognition.stopListening();
    await insertChat(currentUsername, transcript, topic);
    resetTranscript();
  };

  const handleClick = async () => {
    await insertChat(currentUsername, currentMessage, topic);
    setCurrentMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  };

  const cancelRecording = async () => {
    await SpeechRecognition.stopListening();
    resetTranscript();
  };

  // TODO: refactor this to be more resuable
  const handlePdfClick = async () => {
    await insertChat(currentUsername, currentMessage, topic);
    const query = currentMessage;
    setCurrentMessage("");
    const res = await promptPdf(currentMessage);
    await insertChat("AI Chatbot", res, topic);
    const msg = new SpeechSynthesisUtterance(res);
    window.speechSynthesis.speak(msg);
  };

  const handlePrompt = async () => {
    const res = await promptModel(chats);
    await insertChat("AI Chatbot", res, topic);
    const msg = new SpeechSynthesisUtterance(res);
    window.speechSynthesis.speak(msg);
  };

  const changeSize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on scroll height
    }
  };

  const loadChats = async () => {
    const data = await getChats(topic);
    if (data) setChats(data);
  };

  const getAndSetUsername = async () => {
    const user = await getUser();
    setCurrentUsername(user?.user_metadata.username);
  };

  useEffect(() => {
    getAndSetUsername();
  }, []);

  useEffect(() => {
    loadChats();
    subscribeToChat(loadChats);
  }, [topic]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, listening]);

  return (
    <div className="flex flex-col h-full w-4/5 bg-neutral-800">
      {topic === "" ? (
        <div className="flex h-full w-full justify-center items-center">
          <p className="text-white font-bold text-center text-2xl">
            Add or select a chat on the left sidebar
          </p>
        </div>
      ) : (
        <>
          <div className="h-full flex flex-col gap-5 items-center justify-start  overflow-y-scroll p-3 border-2 border-black">
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
                    className={`max-w-[60%] min-w-[200px] rounded-lg flex flex-col justify-between gap-1 p-2 ${
                      currentUsername == chat.username
                        ? "bg-blue-100"
                        : chat.username == "AI Chatbot"
                        ? "bg-green-100"
                        : "bg-white"
                    }`}
                  >
                    <h1 className="font-semibold text-xl">{chat.username}</h1>
                    <p className="text-wrap break-words">{chat.message}</p>
                  </div>
                </div>
              );
            })}
            {listening && (
              <div className={`flex w-full justify-end`}>
                <div
                  className={`max-w-[60%] min-w-[200px] rounded-lg flex flex-col justify-between gap-1 p-2 bg-white`}
                >
                  <h1 className="font-semibold text-xl">{currentUsername}</h1>
                  <p className="text-wrap break-words">{transcript}</p>
                </div>
              </div>
            )}
            <div ref={chatBottomRef}></div>
          </div>
          <div className="flex flex-col justify-start items-start gap-3 p-2">
            <div className="flex justify-center items-center text-white font-bold text-xl gap-1">
              <button
                onClick={() => {
                  setOpenToolbar(!openToolbar);
                }}
              >
                {openToolbar ? <FaAngleDown /> : <FaAngleUp />}
              </button>
              <p>Toolbar</p>
            </div>
            {openToolbar && (
              <>
                {/* Speech tools */}
                <div className="flex justify-end items-center gap-1">
                  <p className="font-semibold text-white">
                    Microphone: {listening ? "🟢" : "🔴"}
                  </p>
                  <button
                    className="border-2 border-black w-20 rounded-md p-2 font-bold bg-white active:bg-slate-400"
                    onClick={startRecording}
                  >
                    Start
                  </button>
                  <button
                    className="border-2 border-black w-20 rounded-md p-2 font-bold bg-white active:bg-slate-400"
                    onClick={stopRecording}
                  >
                    Stop
                  </button>
                  <button
                    className="border-2 border-black w-20 rounded-md p-2 font-bold bg-white active:bg-slate-400"
                    onClick={resetTranscript}
                  >
                    Restart
                  </button>
                  <button
                    className="border-2 border-black w-20 rounded-md p-2 font-bold bg-white active:bg-slate-400"
                    onClick={cancelRecording}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="p-2 flex justify-between items-center gap-2">
            <textarea
              ref={textareaRef}
              className="rounded-md px-1 py-2 w-full focus:outline-none resize-none max-h-[300px] overflow-y-auto"
              rows={1}
              value={currentMessage}
              onChange={(e) => {
                e.preventDefault();
                setCurrentMessage(e.target.value);
                changeSize();
              }}
            />
            <button
              className="h-10 rounded-md w-28 px-2 font-bold bg-white active:bg-slate-400"
              onClick={handleClick}
            >
              Send
            </button>
            <button
              className="h-10 rounded-md w-28 px-2 font-bold bg-white active:bg-slate-400"
              onClick={handlePrompt}
            >
              Prompt
            </button>
          </div>
        </>
      )}
    </div>
  );
}
