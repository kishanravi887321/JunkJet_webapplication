"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Send, Bot, User, Loader2, MessageCircle, X, Minimize2, Maximize2 } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useChatbot } from "@/hooks/useApi"
import { useTheme } from "next-themes"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface FloatingChatbotProps {
  isOpen: boolean
  onClose: () => void
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

export function FloatingChatbot({ isOpen, onClose, isMinimized = false, onToggleMinimize }: FloatingChatbotProps) {
  const [inputMessage, setInputMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { messages: chatMessages, loading: isLoading, sendMessage: sendChatMessage } = useChatbot()
  const { theme } = useTheme()

  // Convert chatbot messages to our Message format
  const messages: Message[] = [
    {
      id: "welcome",
      content:
        "🌱 Welcome to Junkjet! I'm your AI assistant for sustainable waste management.\n\n" +
        "I can help you with:\n" +
        "• 📦 Buying and selling waste materials\n" +
        "• 🔍 Finding nearby buyers or sellers\n" +
        "• 💰 Getting price estimates\n" +
        "• 📚 Understanding our 3-phase ecosystem\n" +
        "• 🌍 Environmental impact tracking\n\n" +
        "What would you like to know?",
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
      console.error("Chat error:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) return null

  const chatContent = (
    <div className={`${isMinimized ? 'h-16' : 'h-[500px]'} flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-400/20 dark:to-green-400/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Junkjet AI</h3>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onToggleMinimize && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleMinimize}
              className="h-8 w-8 hover:bg-background/80"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                          : "bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-800/50 dark:to-green-800/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700"
                      }`}
                    >
                      {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm border ${
                          message.sender === "user"
                            ? "chatbot-message-user text-white border-blue-200 dark:border-blue-800"
                            : "chatbot-message-bot text-foreground"
                        }`}
                      >
                        <p className={`text-sm leading-relaxed ${
                          message.sender === "user" 
                            ? "text-white" 
                            : "text-foreground"
                        }`}>
                          {message.content}
                        </p>
                      </div>
                      <p className={`text-xs px-2 ${
                        message.sender === "user" 
                          ? "text-blue-200 text-right" 
                          : "text-muted-foreground text-left"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-800/50 dark:to-green-800/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-background border border-border dark:bg-card dark:border-border rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t bg-background/50 dark:bg-card/50 p-4">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={user ? "Ask me anything about waste management..." : "Please log in to chat"}
                disabled={isLoading || !user}
                className="flex-1 border-border dark:border-border bg-background dark:bg-background focus:ring-emerald-500 dark:focus:ring-emerald-400"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading || !user}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md transition-all duration-200 px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!user && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                <span>⚠️</span>
                Please log in to use the chatbot
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 max-w-[calc(100vw-2rem)] floating-chatbot-shadow border-2 border-border dark:border-border bg-background/95 dark:bg-card/95 backdrop-blur-sm">
        {chatContent}
      </Card>
    </div>
  )
}

// Floating Chatbot Button Component
export function FloatingChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsMinimized(false)
      setHasNewMessage(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleToggle}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group relative"
          >
            <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
            {hasNewMessage && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white chatbot-pulse"></div>
            )}
          </Button>
        </div>
      )}

      {/* Floating Chatbot */}
      <FloatingChatbot 
        isOpen={isOpen} 
        onClose={handleClose}
        isMinimized={isMinimized}
        onToggleMinimize={handleToggleMinimize}
      />
    </>
  )
}
