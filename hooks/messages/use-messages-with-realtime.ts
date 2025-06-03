import { useCallback, useMemo, useState } from 'react';
import { useMessages } from './use-messages';
import { useRealtimeMessages } from './use-realtime-messages';

import { Message } from '@/types';

export function useMessagesWithRealtime({ chatroomId } : { chatroomId: string }) {
  const { messages: initialMessages, loading, error } = useMessages({ chatroomId });
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>(initialMessages);

  const handleNewMessage = useCallback((newMessage: Message) => {
    setRealtimeMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  useRealtimeMessages({
    chatroomId,
    onNewMessage: handleNewMessage,
  });

  // Combine initial messages with realtime messages
  const allMessages = useMemo(() => {
    const messagesMap = new Map<string, Message>();

    initialMessages.forEach((msg) => {
      messagesMap.set(msg.messageId, msg);
    });
    
    realtimeMessages.forEach((msg) => {
      if (!messagesMap.has(msg.messageId)) {
        messagesMap.set(msg.messageId, msg);
      }
    });

    return Array.from(messagesMap.values()).sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
    );
  }, [initialMessages, realtimeMessages]);

  return { messages: allMessages, loading, error };
}
