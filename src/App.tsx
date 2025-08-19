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
      content:
        "Hello! I have seen what you are currently working on. How can I assist?",
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
    <div className="app">
      {/* Header */}
      <LiquidGlass
        variant="panel"
        intensity="medium"
        rippleEffect={false}
        flowOnHover={false}
        stretchOnDrag={false}
        className="header"
      >
        <div className="header-content">
          <div className="avatar">
            <Bot className="avatar-icon" />
          </div>
          <div>
            <h1 className="header-title">AI Assistant</h1>
            <p className="header-subtitle">Powered by ScreenCueAI</p>
          </div>
        </div>
      </LiquidGlass>

      {/* Messages Area */}
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role === "user" ? "message-user" : "message-assistant"}`}
          >
            {message.role === "assistant" && (
              <div className="message-avatar assistant-avatar">
                <Bot className="message-avatar-icon" />
              </div>
            )}

            <LiquidGlass
              variant="card"
              intensity="subtle"
              className={`message-bubble ${
                message.role === "user"
                  ? "message-bubble-user"
                  : "message-bubble-assistant"
              }`}
            >
              <p className="message-text">{message.content}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </LiquidGlass>

            {message.role === "user" && (
              <div className="message-avatar user-avatar">
                <User className="message-avatar-icon" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="message message-assistant">
            <div className="message-avatar assistant-avatar">
              <Bot className="message-avatar-icon" />
            </div>
            <LiquidGlass
              variant="card"
              intensity="subtle"
              className="message-bubble message-bubble-assistant"
            >
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div
                  className="typing-dot"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="typing-dot"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </LiquidGlass>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-container">
          <LiquidGlass
            variant="card"
            intensity="subtle"
            className="input-wrapper"
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="message-input"
              rows={1}
            />
          </LiquidGlass>

          <LiquidGlass
            variant="button"
            intensity="medium"
            onClick={handleSendMessage}
            className="send-button"
          >
            <Send className="send-icon" />
          </LiquidGlass>
        </div>
      </div>
    </div>
  );
}

export default App;
