import { ChatInterface } from "@/components/chatbot/chat-interface"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function ChatbotPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Assistant</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get instant help with waste management questions, recycling tips, and guidance on using Junkjet's
              three-phase system effectively.
            </p>
          </div>
          <ChatInterface />
        </div>
      </div>
    </ProtectedRoute>
  )
}
