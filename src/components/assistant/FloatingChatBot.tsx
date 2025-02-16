import {FormEvent, KeyboardEvent, useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {AlertCircle, Loader2, MessageCircle, RefreshCw, Send, Sparkles, X} from 'lucide-react';
import {Message} from '../../types';
import MarkdownRenderer from "../common/MarkdownRenderer.tsx";

interface ChatBotProps {
  messages: Message[];
  onUserMessage: (message: string) => void;
  onUserInterrupt: () => void;
  onUserRetry: () => void;
  isStreaming: boolean;
  isConnecting: boolean;
  connectionError?: string;
  retryConnect?: () => void;
  onOpen?: () => void;
}

export default function FloatingChatBot({
                                          messages,
                                          onUserMessage,
                                          onUserInterrupt,
                                          onUserRetry,
                                          isStreaming = false,
                                          isConnecting = false,
                                          connectionError,
                                          retryConnect,
                                          onOpen,
                                        }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isInputDisabled = connectionError !== undefined || isConnecting || isStreaming;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  useEffect(() => {
    if (isOpen)
      onOpen?.();
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isInputDisabled) return;

    onUserMessage(input.trim());
    setInput('');
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const disableActionButton = !isStreaming && input.trim() === '';

  return (
    <div className="relative bottom-auto right-auto">
      {/* Floating Button */}
      <motion.button
        whileHover={{scale: 1.1}}
        whileTap={{scale: 0.9}}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-primary to-primary-700 hover:opacity-90 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all"
      >
        <MessageCircle className="w-6 h-6"/>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{opacity: 0, scale: 0.8, y: 60}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.8, y: 60}}
            className="fixed bottom-0 left-0 w-full h-[calc(100vh-4em)] sm:absolute sm:inset-auto sm:bottom-16 sm:right-0 sm:w-96 sm:h-[600px] sm:max-h-[calc(100vh-12rem)]
                     z-50 bg-gradient-to-b from-white to-primary-50
                     sm:rounded-2xl shadow-2xl overflow-hidden
                     flex flex-col"
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
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
                      onClick={retryConnect}
                      className="px-4 py-2 bg-gradient-to-r from-primary to-primary-700 text-white rounded-full hover:opacity-90 transition-opacity flex items-center space-x-2 mx-auto"
                    >
                      <RefreshCw className="w-4 h-4"/>
                      <span>Retry</span>
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((message, ind) => (
                  <div
                    key={ind}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    } relative`}
                  >
                    <motion.div
                      initial={{opacity: 0, y: 10}}
                      animate={{opacity: 1, y: 0}}
                      className={`
                        max-w-[85%] sm:max-w-[80%] p-4 shadow-lg
                        ${message.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-primary-700 text-white message-user'
                        : 'bg-white message-assistant'
                      }
                        relative
                      `}
                    >
                      {message.role === 'user' ? (
                        <p className="whitespace-pre-wrap"><MarkdownRenderer>{message.content}</MarkdownRenderer></p>
                      ) : (
                        <>
                          <p className="whitespace-pre-wrap text-gray-800">
                            <MarkdownRenderer>{message.content}</MarkdownRenderer>
                            {isStreaming && ind == messages.length - 1 && (
                              <span className="text-primary-600 animate-pulse">┃</span>
                            )}
                          </p>
                          {message.error && (
                            <div className="mt-2 flex items-center space-x-2 flex-wrap gap-2">
                              <p className="text-red-500 text-sm">{message.error}</p>
                              {ind === messages.length - 1 &&
                                <button
                                  onClick={onUserRetry}
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
                ))
              )}
              <div ref={messagesEndRef}/>
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="p-4 bg-white border-t border-primary-100"
            >
              <div className="flex space-x-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
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
                  className="outline-none flex-1 resize-none rounded-2xl border border-primary-700
                           focus:border-primary focus:ring-1 focus:ring-primary p-3
                           max-h-32 disabled:bg-primary-50 disabled:text-primary-500
                           placeholder-primary-400 text-sm sm:text-base"
                  rows={1}
                />
                <button
                  type={isStreaming ? "button" : "submit"}
                  disabled={disableActionButton}
                  className={`px-3 sm:px-4 py-2 rounded-full flex items-center space-x-1 sm:space-x-2 transition-all ${
                    disableActionButton
                      ? 'bg-primary-100 text-primary-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-primary-700 text-white hover:opacity-90 shadow-md hover:shadow-lg'
                  }`}
                  onClick={() => isStreaming && onUserInterrupt()}
                >
                  {isStreaming ? (
                    <>
                      <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin"/>
                      <span className="text-xs sm:text-sm">Stop</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 sm:w-5 h-4 sm:h-5"/>
                      <span className="text-xs sm:text-sm">Send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      {/*@ts-ignore*/}
      <style jsx>{`
          .message-user {
              border-radius: 24px 24px 4px 24px;
              box-shadow: 0 4px 15px rgba(76, 29, 149, 0.1);
          }

          .message-assistant {
              border-radius: 24px 24px 24px 4px;
              border: 1px solid rgba(76, 29, 149, 0.1);
          }
      `}</style>
    </div>
  );
}