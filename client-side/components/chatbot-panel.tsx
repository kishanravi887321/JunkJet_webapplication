"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2, MessageCircle, X, Minimize2, Maximize2, GripVertical } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useChatbot } from "@/hooks/useApi"
import { useTheme } from "next-themes"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatbotPanelProps {
  isOpen: boolean
  onClose: () => void
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

export function ChatbotPanel({ isOpen, onClose, isMinimized = false, onToggleMinimize }: ChatbotPanelProps) {
  const [inputMessage, setInputMessage] = useState("")
  const [panelWidth, setPanelWidth] = useState(50) // Percentage of screen width
  const [isResizing, setIsResizing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { messages: chatMessages, loading: isLoading, sendMessage: sendChatMessage } = useChatbot()
  const { theme } = useTheme()

  // Check if mobile on client side
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }, 100)
    }
  }, [messages])

  // Handle panel resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const newWidth = Math.max(30, Math.min(80, ((window.innerWidth - e.clientX) / window.innerWidth) * 100))
      setPanelWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

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

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 transition-opacity duration-300 chatbot-panel-backdrop"
        onClick={onClose}
      />
      
      {/* Resizable Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full z-50 transition-all duration-300 ease-in-out"
        style={{ 
          width: isMobile ? '100%' : `${panelWidth}%`
        }}
      >
        {/* Resize Handle - Hidden on mobile */}
        {!isMobile && (
          <div
            className="absolute left-0 top-0 w-1 h-full bg-border hover:bg-primary/50 cursor-col-resize z-10 chatbot-resize-handle group"
            onMouseDown={handleResizeStart}
          >
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Chat Panel */}
        <Card className={`h-full ${isMobile ? 'ml-0' : 'ml-1'} rounded-l-lg rounded-r-none border-l-2 border-r-0 border-y-0 bg-background/95 dark:bg-card/95 backdrop-blur-sm shadow-2xl`}>
          <div className={`h-full flex flex-col ${isMinimized ? 'max-h-20' : ''}`}>
            {/* Header */}
            <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-400/20 dark:to-green-400/20 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">Junkjet AI Assistant</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {user ? `Hello ${user.fullName || user.userName}!` : 'Always here to help'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPanelWidth(40)}
                    className="text-xs hover:bg-background/80 hidden md:flex"
                  >
                    40%
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPanelWidth(60)}
                    className="text-xs hover:bg-background/80 hidden md:flex"
                  >
                    60%
                  </Button>
                  {onToggleMinimize && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onToggleMinimize}
                      className="h-9 w-9 hover:bg-background/80"
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-9 w-9 hover:bg-destructive/20 hover:text-destructive"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex gap-4 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.sender === "user"
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                  : "bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-800/50 dark:to-green-800/50 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-700"
                              }`}
                            >
                              {message.sender === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                            </div>
                            <div className="flex flex-col gap-2">
                              <div
                                className={`rounded-2xl px-5 py-4 shadow-sm border ${
                                  message.sender === "user"
                                    ? "chatbot-message-user text-white border-blue-200 dark:border-blue-800"
                                    : "chatbot-message-bot text-foreground"
                                }`}
                              >
                                <p className={`text-sm leading-relaxed whitespace-pre-line ${
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
                        <div className="flex gap-4 justify-start">
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-800/50 dark:to-green-800/50 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-700 flex items-center justify-center">
                              <Bot className="h-5 w-5" />
                            </div>
                            <div className="chatbot-message-bot rounded-2xl px-5 py-4 shadow-sm">
                              <div className="flex items-center gap-3">
                                <Loader2 className="h-5 w-5 animate-spin text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm text-muted-foreground">Thinking...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Input Area */}
                <div className="flex-shrink-0 border-t bg-background/50 dark:bg-card/50 p-6">
                  <div className="flex gap-3">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={user ? "Ask me anything about waste management..." : "Please log in to chat"}
                      disabled={isLoading || !user}
                      className="flex-1 h-12 border-border dark:border-border bg-background dark:bg-background focus:ring-emerald-500 dark:focus:ring-emerald-400 text-base"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading || !user}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md transition-all duration-200 px-6 h-12"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  {!user && (
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-3 flex items-center gap-2">
                      <span>⚠️</span>
                      Please log in to use the chatbot
                    </p>
                  )}
                  
                  {/* Panel Size Indicator */}
                  <div className="mt-3 text-xs text-muted-foreground text-center">
                    {isMobile ? 'Full screen mode' : `Panel width: ${Math.round(panelWidth)}% • Drag left edge to resize`}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </>
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

      {/* Side Panel Chatbot */}
      <ChatbotPanel 
        isOpen={isOpen} 
        onClose={handleClose}
        isMinimized={isMinimized}
        onToggleMinimize={handleToggleMinimize}
      />
    </>
  )
}
