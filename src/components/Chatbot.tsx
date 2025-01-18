import React, {useState, useRef, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {MessageCircle, X, Send, Loader2, RefreshCw, Sparkles, AlertCircle} from 'lucide-react';

type MessageType = 'user' | 'assistant';
type StreamStatus = 'stream-start' | 'stream-data' | 'stream-end' | 'stream-error';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  streamStatus?: StreamStatus;
  parentId?: string;
}

interface ChatBotProps {
  messages: Message[];
  onMessage: (message: string) => void;
  onInterrupt: () => void;
  onRetry: (messageId: string) => void;
}

export default function ChatBot({messages: propMessages, onMessage, onInterrupt, onRetry}: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isInputDisabled = React.useMemo(() => {
    const lastAssistantMessage = [...propMessages]
      .reverse()
      .find(m => m.type === 'assistant');

    return lastAssistantMessage?.streamStatus === 'stream-start' ||
      lastAssistantMessage?.streamStatus === 'stream-data' ||
      isConnecting;
  }, [propMessages, isConnecting]);

  useEffect(() => {
    if (isOpen) {
      setIsConnecting(true);
      setConnectionError(null);

      const timer = setTimeout(() => {
        if (Math.random() > 0) {
          setConnectionError('Failed to connect');
          setIsConnecting(false);
        } else {
          setIsConnecting(false);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [propMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isInputDisabled) return;

    onMessage(input.trim());
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const groupedMessages = React.useMemo(() => {
    const groups: Message[][] = [];
    let currentGroup: Message[] = [];

    propMessages.forEach((message) => {
      if (message.type === 'user' || message.streamStatus === 'stream-start') {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [propMessages]);

  const handleRetryConnection = () => {
    setIsConnecting(true);
    setConnectionError(null);

    setTimeout(() => {
      setIsConnecting(false);
    }, 1500);
  };

  const enableActionButton = isInputDisabled ? isConnecting || connectionError !== null : input.trim() === '';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{opacity: 0, scale: 0.8, y: 20}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.8, y: 20}}
            className="absolute bottom-16 right-0 w-96 h-[600px] bg-gradient-to-b from-white to-primary-50 rounded-2xl shadow-2xl overflow-hidden border border-primary-100"
          >
            {/* Header */}
            <div
              className="bg-gradient-to-r from-primary to-primary-700 text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary-300"/>
                <h2 className="text-lg font-semibold">AI Assistant</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>

            {/* Messages Container */}
            <div className="h-[calc(100%-8rem)] overflow-y-auto p-4 space-y-6">
              {isConnecting ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto"/>
                    <p className="text-primary-900">Establishing connection...</p>
                  </div>
                </div>
              ) : connectionError ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto"/>
                    <p className="text-red-500">{connectionError}</p>
                    <button
                      onClick={handleRetryConnection}
                      className="px-4 py-2 bg-gradient-to-r from-primary to-primary-700 text-white rounded-full hover:opacity-90 transition-opacity flex items-center space-x-2 mx-auto"
                    >
                      <RefreshCw className="w-4 h-4"/>
                      <span>Retry</span>
                    </button>
                  </div>
                </div>
              ) : (
                groupedMessages.map((group, index) => {
                  const mainMessage = group[0];
                  const isStreaming = group.length > 1 &&
                    group[group.length - 1].streamStatus !== 'stream-end' &&
                    group[group.length - 1].streamStatus !== 'stream-error';

                  return (
                    <div
                      key={mainMessage.id}
                      className={`flex ${
                        mainMessage.type === 'user' ? 'justify-end' : 'justify-start'
                      } relative`}
                    >
                      <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        className={`
                          max-w-[80%] p-4 shadow-lg
                          ${mainMessage.type === 'user'
                          ? 'bg-gradient-to-br from-primary to-primary-700 text-white message-user'
                          : 'bg-white message-assistant'
                        }
                          relative
                        `}
                      >
                        {mainMessage.type === 'user' ? (
                          <p className="whitespace-pre-wrap">{mainMessage.content}</p>
                        ) : (
                          <>
                            <p className="whitespace-pre-wrap text-gray-800">
                              {group.map(msg => msg.content).join('')}
                              {isStreaming && (
                                <span className="text-primary-600 animate-pulse">┃</span>
                              )}
                            </p>
                            {group[group.length - 1].streamStatus === 'stream-error' && (
                              <div className="mt-2 flex items-center space-x-2">
                                <p className="text-red-500 text-sm">Error occurred</p>
                                {index === groupedMessages.length - 1 &&
                                  <button
                                    onClick={() => onRetry(mainMessage.id)}
                                    className="text-sm bg-primary-100 hover:bg-primary-200 text-primary-900 px-3 py-1 rounded-full flex items-center space-x-1 transition-colors"
                                  >
                                    <RefreshCw className="w-3 h-3"/>
                                    <span>Retry</span>
                                  </button>
                                }
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef}/>
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-primary-100"
            >
              <div className="flex space-x-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isInputDisabled}
                  placeholder={
                    isConnecting
                      ? 'Connecting...'
                      : connectionError
                        ? 'Connection failed'
                        : isInputDisabled
                          ? 'Please wait...'
                          : 'Type your message...'
                  }
                  className="flex-1 resize-none rounded-2xl border border-primary-200 focus:border-primary focus:ring-1 focus:ring-primary p-3 max-h-32 disabled:bg-primary-50 disabled:text-primary-500 placeholder-primary-400"
                  rows={1}
                />
                <button
                  type={isInputDisabled ? "button" : "submit"}
                  disabled={enableActionButton}
                  className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all ${
                    enableActionButton ? 'bg-primary-100 text-primary-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-primary-700 text-white hover:opacity-90 shadow-md hover:shadow-lg'
                  }`}
                  onClick={() => isInputDisabled && !isConnecting && !connectionError && onInterrupt()}
                >
                  {isInputDisabled && !isConnecting && !connectionError ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin"/>
                      <span className="text-sm">
                        Stop
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5"/>
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{scale: 1.1}}
        whileTap={{scale: 0.9}}
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-primary to-primary-700 hover:opacity-90 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all"
      >
        <MessageCircle className="w-6 h-6"/>
      </motion.button>

      <style jsx>{`
          .message-user {
              border-radius: 24px 24px 4px 24px;
              box-shadow: 0 4px 15px rgba(76, 29, 149, 0.1);
          }

          .message-assistant {
              border-radius: 24px 24px 24px 4px;
              border: 1px solid rgba(76, 29, 149, 0.1);
          }

          .message-user::before,
          .message-assistant::before {
              content: '';
              position: absolute;
              bottom: 0;
              width: 20px;
              height: 20px;
          }

          .message-user::before {
              right: -10px;
              border-left: 10px solid #4c1d95;
              border-right: 10px solid transparent;
              border-bottom: 10px solid #4c1d95;
              border-top: 10px solid transparent;
          }

          .message-assistant::before {
              left: -10px;
              border-left: 10px solid transparent;
              border-right: 10px solid white;
              border-bottom: 10px solid white;
              border-top: 10px solid transparent;
          }
      `}</style>
    </div>
  );
}