"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useChatbot } from "@/hooks/useApi"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export function ChatInterface() {
  const [inputMessage, setInputMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { messages: chatMessages, loading: isLoading, sendMessage: sendChatMessage } = useChatbot()

  // Convert chatbot messages to our Message format
  const messages: Message[] = [
    {
      id: "1",
      content:
        "Hello! I'm your Junkjet AI assistant. I can help you with waste management questions, recycling tips, and navigating our three-phase system. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
    ...chatMessages.map((msg, index) => ({
      id: `msg-${index}`,
      content: msg.text,
      sender: msg.isUser ? ("user" as const) : ("bot" as const),
      timestamp: msg.timestamp,
    }))
  ]

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]')
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || !user) return

    try {
      await sendChatMessage(inputMessage)
      setInputMessage("")
    } catch (error) {
      // Error is already handled by the hook
      console.error("Chat error:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-green-50">
        <CardTitle className="flex items-center gap-2 text-emerald-800">
          <Bot className="h-5 w-5" />
          Junkjet AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4 max-h-[400px] overflow-y-auto" ref={scrollAreaRef}>
          <div className="space-y-4 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user" ? "bg-emerald-600 text-white" : "bg-green-100 text-emerald-700"
                    }`}
                  >
                    {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.sender === "user" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-emerald-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-emerald-700 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about waste management, recycling, or how Junkjet works..."
              disabled={isLoading || !user}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading || !user}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {!user && <p className="text-sm text-gray-500 mt-2">Please log in to use the chatbot</p>}
        </div>
      </CardContent>
    </Card>
  )
}
