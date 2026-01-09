"use client";

import { useState, useRef, useEffect } from "react";
import { useAccentColor } from "../contexts/AccentColorContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type Language = "english" | "filipino";

const translations = {
  english: {
    initialMessage: "Hello! I'm your AI assistant. How can I help you today?",
    placeholder: "Type your message...",
    online: "Online",
    errorMessage: "Sorry, I encountered an error. Please try again.",
  },
  filipino: {
    initialMessage:
      "Kumusta! Ako ang iyong AI assistant. Paano kita matutulungan ngayon?",
    placeholder: "I-type ang iyong mensahe...",
    online: "Naka-online",
    errorMessage: "Paumanhin, may naganap na error. Subukan ulit po.",
  },
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("english");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: translations.english.initialMessage,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { accentColorValue } = useAccentColor();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Update initial message when language changes
    if (messages.length === 1 && messages[0].role === "assistant") {
      setMessages([
        {
          role: "assistant",
          content: translations[language].initialMessage,
          timestamp: new Date(),
        },
      ]);
    }
  }, [language]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: translations[language].errorMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
          style={{
            backgroundColor: accentColorValue,
            color: "white",
          }}
          aria-label="Open AI Assistant"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col">
          {/* Header */}
          <div
            className="p-4 rounded-t-xl flex items-center justify-between"
            style={{
              backgroundColor: `${accentColorValue}10`,
              borderBottom: `1px solid ${accentColorValue}20`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: accentColorValue }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  AI Assistant
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {translations[language].online}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={() =>
                  setLanguage(language === "english" ? "filipino" : "english")
                }
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:shadow-md border"
                style={{
                  backgroundColor: accentColorValue,
                  color: "white",
                  borderColor: accentColorValue,
                }}
                title={`Switch to ${
                  language === "english" ? "Filipino" : "English"
                }`}
              >
                {language === "english" ? "EN" : "FIL"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors"
                aria-label="Close AI Assistant"
              >
                <svg
                  className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "rounded-br-sm"
                      : "rounded-bl-sm bg-zinc-100 dark:bg-zinc-800"
                  }`}
                  style={
                    message.role === "user"
                      ? {
                          backgroundColor: accentColorValue,
                          color: "white",
                        }
                      : {}
                  }
                >
                  <p
                    className={`text-sm whitespace-pre-wrap break-words ${
                      message.role === "user"
                        ? "text-white"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-white/70"
                        : "text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg rounded-bl-sm px-4 py-2">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: accentColorValue,
                        animationDelay: "0ms",
                      }}
                    />
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: accentColorValue,
                        animationDelay: "150ms",
                      }}
                    />
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: accentColorValue,
                        animationDelay: "300ms",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={translations[language].placeholder}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 transition-all"
                style={
                  {
                    "--tw-ring-color": accentColorValue,
                  } as React.CSSProperties
                }
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = accentColorValue;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "";
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: accentColorValue,
                  color: "white",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
