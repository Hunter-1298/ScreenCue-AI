"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { LiquidGlass } from "./components/LiquidGlass";
import "./App.css";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you said: "${userMessage.content}". This is a demo response with the beautiful liquid glass styling!`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black/30 backdrop-blur-[20px] flex flex-col">
      {/* Header */}
      <LiquidGlass
        variant="panel"
        intensity="medium"
        rippleEffect={false}
        flowOnHover={false}
        stretchOnDrag={false}
        className="p-6 border-b border-white/10"
      >
        <div className="flex items-center gap-3 bg-black/60">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white m-0">
              AI Assistant
            </h1>
            <p className="text-sm text-white/70 m-0">Powered by ScreenCueAI</p>
          </div>
        </div>
      </LiquidGlass>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 h-[calc(100vh-140px)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <LiquidGlass
              variant="card"
              intensity="subtle"
              className={`max-w-[70%] pl-20 rounded-[20px] ${
                message.role === "user"
                  ? "bg-gradient-to-br from-blue-500/20 to-purple-600/20"
                  : "bg-white/5"
              }`}
            >
              <p className="text-white text-sm leading-relaxed m-0 mb-2 pl-4">
                {message.content}
              </p>
              <span className="text-xs text-white/50 block pl-4">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </LiquidGlass>

            {message.role === "user" && (
              <div className="pl-20 w-8 h-8 rounded-full bg-gradient-to-br from-green-500/30 to-blue-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-white pl-30" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <LiquidGlass
              variant="card"
              intensity="subtle"
              className="bg-white/5 pl-4 rounded-[20px]"
            >
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </LiquidGlass>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-[10px] rounded-2xl overflow-hidden">
        <div className="flex gap-3 items-end">
          <LiquidGlass
            variant="card"
            intensity="subtle"
            className="flex-1 bg-white/5 rounded-2xl overflow-hidden"
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className=" bg-transparent text-white border-none outline-none pl-4 text-sm leading-relaxed resize-none min-h-[48px] max-h-32 font-inherit placeholder:text-white/50 placeholder:opacity-70"
              rows={1}
            />
          </LiquidGlass>

          <LiquidGlass
            variant="button"
            intensity="medium"
            onClick={handleSendMessage}
            className="bg-gradient-to-br from-blue-500/30 to-purple-600/30 p-3 rounded-[10px] min-w-[58px] h-12 cursor-pointer transition-all duration-300 flex items-center justify-center hover:from-blue-500/40 hover:to-purple-600/40"
          >
            <Send className="w-16 h-8 text-white" />
          </LiquidGlass>
        </div>
      </div>
    </div>
  );
}

export default App;
