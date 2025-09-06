"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  _id: string
  userName: string
  email: string
  fullName: string
  avatar: string
  coverImage: string
  isPhase1User: boolean
  isPhase2User: boolean
  isPhase3User: boolean
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData')
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('userData')
        }
      }
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
