"use client";

import { CircleOff, Volume2 } from "lucide-react";
import { useState } from "react";

import { ChatBubbleAction } from "@/components/ui/chat/chat-bubble";
import { useToast } from "@/hooks";

interface ReadMessageButtonProps {
  content: string;
}

export function ReadMessageButton({ content }: ReadMessageButtonProps) {
  const [isReading, setIsReading] = useState(false);
  const { toast } = useToast();

  const handleRead = async () => {
    setIsReading(true);

    try {
      const utterance = new SpeechSynthesisUtterance(content);
      speechSynthesis.speak(utterance);
      utterance.onend = () => setIsReading(false);
    } catch (error) {
      console.error("Failed to read message: ", error);
      toast({
        title: "Error",
        description: "Failed to read message. Please try again.",
        variant: "destructive",
      });
      setIsReading(false);
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsReading(false);
  };

  const handleClick = () => {
    isReading ? handleStop() : handleRead();
  };

  return (
    <ChatBubbleAction
      onClick={ handleClick }
      className="cursor-pointer"
      icon={ isReading ? <CircleOff className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
      title={ isReading ? "Stop reading" : "Read message" }
    />
  );
}
