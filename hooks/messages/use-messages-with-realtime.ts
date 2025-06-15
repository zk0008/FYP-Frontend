import { useCallback, useEffect, useMemo, useState } from "react";

import { Message } from "@/types";

import { useFetchMessages } from "./use-fetch-messages";
import { useRealtimeMessages } from "./use-realtime-messages";

export function useMessagesWithRealtime({ chatroomId } : { chatroomId: string }) {
  const { messages: initialMessages, loading, error } = useFetchMessages({ chatroomId });
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>(initialMessages);
  const [deletedMessageIds, setDeletedMessageIds] = useState<Set<string>>(new Set());

  // Reset states when chatroomId changes
  useEffect(() => {
    setRealtimeMessages([]);
    setDeletedMessageIds(new Set());
  }, [chatroomId]);

  const handleNewMessage = useCallback((newMessage: Message) => {
    setRealtimeMessages((prevMessages) => {
      // Check if the message already exists
      const exists = prevMessages.some((msg) => msg.messageId === newMessage.messageId);
      if (exists) {
        return prevMessages;
      }
      return [...prevMessages, newMessage];
    });
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    setRealtimeMessages((prevMessages) => prevMessages.filter((msg) => msg.messageId !== messageId));

    setDeletedMessageIds((prevDeleted) => new Set(prevDeleted).add(messageId));

  }, []);

  useRealtimeMessages({
    chatroomId,
    onNewMessage: handleNewMessage,
    onDeleteMessage: handleDeleteMessage
  });

  // Combine initial messages with realtime messages
  const allMessages = useMemo(() => {
    const messagesMap = new Map<string, Message>();

    // Add initial messages (excluding deleted ones)
    initialMessages.forEach((msg) => {
      if (!deletedMessageIds.has(msg.messageId)) {
        messagesMap.set(msg.messageId, msg);
      }
    });
    
    // Add realtime messages (deleted ones are already filtered out)
    realtimeMessages.forEach((msg) => {
      messagesMap.set(msg.messageId, msg);
    });

    return Array.from(messagesMap.values()).sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
    );
  }, [initialMessages, realtimeMessages, deletedMessageIds]);

  return { messages: allMessages, loading, error };
}
