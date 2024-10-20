"use client";
import { useEffect, useRef, useState } from "react";
import {
  embedDocument,
  promptAdvanced,
  promptModel,
  promptPdf,
  promptRag,
} from "../utils/api";
import { Chat } from "../types";
import {
  getChats,
  insertChat,
  sendTopicInvite,
  subscribeToChat,
} from "../utils/db";
import { getUser } from "../utils/auth";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "regenerator-runtime/runtime";
import { getDocument, getDocumentNames, sendToBucket } from "../utils/storage";

export default function ChatBox({ topic }: { topic: string }) {
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [openToolbar, setOpenToolbar] = useState<boolean>(true);
  const [openDocuments, setOpendDocuments] = useState<boolean>(false);
  const [file, setFile] = useState<any>(null);
  const [documentList, setDocumentList] = useState<string[]>([]);
  const [invitedUser, setInvitedUser] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);

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
    setGenerating(true);
    const res = await promptPdf(topic, query);
    setGenerating(false);
    await insertChat("AI Chatbot", res, topic);
    const msg = new SpeechSynthesisUtterance(res);
    window.speechSynthesis.speak(msg);
  };

  const handleRagClick = async () => {
    await insertChat(currentUsername, currentMessage, topic);
    const query = currentMessage;
    setCurrentMessage("");
    setGenerating(true);
    const res = await promptRag(topic, query);
    setGenerating(false);
    await insertChat("AI Chatbot", res, topic);
    const msg = new SpeechSynthesisUtterance(res);
    window.speechSynthesis.speak(msg);
  };

  const handleAdvancedClick = async () => {
    await insertChat(currentUsername, currentMessage, topic);
    const query = currentMessage;
    setCurrentMessage("");
    setGenerating(true);
    const res = await promptAdvanced(chats, topic, query);
    setGenerating(false);
    await insertChat("AI Chatbot", res, topic);
    const msg = new SpeechSynthesisUtterance(res);
    window.speechSynthesis.speak(msg);
  };

  const handlePrompt = async () => {
    setGenerating(true);
    const res = await promptModel(chats);
    await insertChat("AI Chatbot", res, topic);
    setGenerating(false);
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

  const loadDocuments = async () => {
    const data = await getDocumentNames(topic);
    setDocumentList(data);
  };

  const getAndSetUsername = async () => {
    const user = await getUser();
    setCurrentUsername(user?.user_metadata.username);
  };

  const uploadFile = async () => {
    if (!file) return;

    await sendToBucket(topic, file);
    embedDocument(topic, file.name);

    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    loadDocuments();
  };

  const downloadDocument = async (documentName: string) => {
    await getDocument(topic, documentName);
  };

  const inviteUser = async () => {
    await sendTopicInvite(invitedUser, topic);
    setInvitedUser("");
  };

  useEffect(() => {
    getAndSetUsername();
  }, []);

  useEffect(() => {
    if (topic !== "") {
      loadChats();
      subscribeToChat(loadChats);
      loadDocuments();
    }
  }, [topic]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, listening]);

  return (
    <div className="flex flex-col h-full w-4/5 bg-neutral-800">
      {topic === "" ? (
        <div className="flex h-full w-full justify-center items-center">
          <p className="text-white font-bold text-center text-2xl">
            Create or select a chat room on the left sidebar
          </p>
        </div>
      ) : (
        <>
          <div className="flex w-full flex-col items-start pt-2 pl-2">
            <div className="flex justify-center items-center text-white font-bold text-xl gap-1">
              <button
                onClick={() => {
                  setOpendDocuments(!openDocuments);
                }}
              >
                {openDocuments ? <FaAngleUp /> : <FaAngleDown />}
              </button>
              <p>Documents</p>
            </div>
            {openDocuments && (
              <div className="flex flex-col gap-2 max-h-56 w-full p-2 overflow-y-auto">
                {documentList.map((doc, index) => (
                  <div
                    key={index}
                    className="flex gap-5 justify-between items-center"
                  >
                    <p className="text-white text-sm">{doc}</p>
                    <button
                      onClick={() => {
                        downloadDocument(doc);
                      }}
                      className="font-semibold px-2 bg-green-200 rounded-md hover:bg-green-300"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="h-full flex flex-col gap-5 items-center justify-start overflow-y-scroll p-3">
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
            {generating && (
              <div className={`flex w-full justify-start`}>
                <div
                  className={`max-w-[60%] min-w-[200px] rounded-lg flex flex-col justify-between gap-1 p-2 bg-green-100`}
                >
                  <h1 className="font-semibold text-xl">AI Chatbot</h1>
                  <p className="text-wrap break-words">
                    Generating a response...
                  </p>
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
                {/* Upload tools */}
                <div className="flex justify-start items-center gap-1">
                  <p className="font-semibold text-white">File Upload: </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="text-white"
                    onChange={(event) => {
                      if (event.target.files) setFile(event.target.files[0]);
                    }}
                  />
                  <button
                    onClick={uploadFile}
                    className="border-2 border-black w-20 rounded-md p-2 font-bold bg-white active:bg-slate-400 hover:bg-slate-300"
                  >
                    Upload
                  </button>
                </div>

                {/* Invite user tools */}
                <div className="flex justify-start items-center gap-2">
                  <p className="font-semibold text-white">Invite user: </p>
                  <input
                    value={invitedUser}
                    onChange={(e) => {
                      e.preventDefault();
                      setInvitedUser(e.target.value);
                    }}
                    className="text-left px-2 w-40 h-10 font-bold bg-white rounded-md"
                  />
                  <button
                    onClick={inviteUser}
                    className="border-2 border-black w-20 rounded-md p-2 font-bold bg-white active:bg-slate-400 hover:bg-slate-300"
                  >
                    Add
                  </button>
                </div>

                {/* Speech tools */}
                <div className="flex justify-end items-center gap-1">
                  <p className="font-semibold text-white">
                    Microphone: {listening ? "🟢" : "🔴"}
                  </p>
                  <button
                    className="border-2 border-black w-20 rounded-md p-2 font-bold bg-white active:bg-slate-400 hover:bg-slate-300"
                    onClick={startRecording}
                  >
                    Start
                  </button>
                  <button
                    className="border-2 border-black w-20 rounded-md p-2 font-bold bg-white active:bg-slate-400 hover:bg-slate-300"
                    onClick={stopRecording}
                  >
                    Stop
                  </button>
                  <button
                    className="border-2 border-black w-20 rounded-md p-2 font-bold bg-white active:bg-slate-400 hover:bg-slate-300"
                    onClick={resetTranscript}
                  >
                    Restart
                  </button>
                  <button
                    className="border-2 border-black w-20 rounded-md p-2 font-bold bg-white active:bg-slate-400 hover:bg-slate-300"
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
              className="h-10 rounded-md w-44 px-2 font-bold bg-white active:bg-slate-400 hover:bg-slate-300"
              onClick={handleClick}
            >
              Send
            </button>
            <button
              className="h-10 rounded-md w-44 px-2 font-bold bg-white active:bg-slate-400 hover:bg-slate-300"
              onClick={handlePrompt}
            >
              Quick Reply
            </button>
            <button
              className="h-10 rounded-md w-44 px-2 font-bold bg-white active:bg-slate-400 hover:bg-slate-300"
              onClick={handlePdfClick}
            >
              PDF Query
            </button>
            <button
              className="h-10 rounded-md w-44 px-2 font-bold bg-white active:bg-slate-400 hover:bg-slate-300"
              onClick={handleRagClick}
            >
              RAG Query
            </button>
            <button
              className="h-10 rounded-md w-64 px-2 font-bold bg-white active:bg-slate-400 hover:bg-slate-300"
              onClick={handleAdvancedClick}
            >
              Advanced Query
            </button>
          </div>
        </>
      )}
    </div>
  );
}
