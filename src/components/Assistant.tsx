import {useRef, useState} from "react";
import {assistantApi} from "../utils/api.ts";
import {Message} from "../types";
import FloatingChatBot from "./FloatingChatBot.tsx";

export function Assistant() {
  const [messages, setMessages] = useState<Array<Message>>([
    {role: 'assistant', content: 'Hello, how can I help?'},
  ]);

  const [isStreaming, setIsStreaming] = useState(false);
  const abortController = useRef<AbortController | null>(null)
  const [isConnecting, setIsConnecting] = useState(true); /* DEMO behaviour as placeholder for future implementation changes and improvemnts */

  const abort = () => {
    abortController.current?.abort();
    abortController.current = null;
  }

  const updateSteamingMessage = (chunk: string, error?: string) => {
    setMessages(prev => {
      const newMessages = prev.slice(0, prev.length - 1)
      newMessages.push({
        role: 'assistant',
        content: prev[prev.length - 1].content + chunk,
        error
      })
      return newMessages;
    });
  }

  const streamResponse = async (history: Message[]) => {
    setMessages(() => [...history, {role: "assistant", content: ''}]);
    setIsStreaming(true);
    abort()
    const myController = new AbortController();
    abortController.current = myController;

    try {
      await assistantApi.streamChat(history, (chunk) => {
        if (myController == abortController.current) updateSteamingMessage(chunk);
      }, myController.signal);
    } catch (err) {
      updateSteamingMessage("", err instanceof Error ? err.message : "Error occurred");
    } finally {
      setIsStreaming(false);
    }
  }

  const handleSendMessage = (currentMessage: string) => {
    const updatedMessages = [...messages, {role: 'user', content: currentMessage} as Message];
    streamResponse(updatedMessages).then()
  };

  const handleRetry = async () => {
    const updatedMessages = messages.slice(0, messages.length - 1)
    streamResponse(updatedMessages).then()
  }

  return <FloatingChatBot
    messages={messages}
    onUserMessage={handleSendMessage} onUserInterrupt={abort} onUserRetry={handleRetry} isStreaming={isStreaming}
    isConnecting={isConnecting} onOpen={() => setTimeout(() => setIsConnecting(false), 1000)}/>
}