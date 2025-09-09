"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { api, User as ApiUser, getToken, setToken, removeToken } from "./api"

export interface User {
  _id: string
  userName: string
  email: string
  fullName: string
  avatar?: string
  coverImage?: string
  isPhase1User: boolean
  isPhase2User: boolean
  isPhase3User: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  loading: boolean
  updateUser: (userData: Partial<User>) => void
}

interface RegisterData {
  userName: string
  email: string
  password: string
  fullName: string
  avatar?: File
  coverImage?: File
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = getToken()
    const userData = localStorage.getItem("userData")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        removeToken()
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.loginUser({ email, password })
      
      if (response.status === 200 && response.data) {
        const { userLoggedIn } = response.data
        setUser(userLoggedIn)
        localStorage.setItem("userData", JSON.stringify(userLoggedIn))
        return { success: true }
      } else {
        return { success: false, error: response.message || "Login failed" }
      }
    } catch (error: any) {
      return { success: false, error: error.message || "Network error. Please try again." }
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      const response = await api.registerUser(registerData)
      
      if (response.status === 201) {
        return { success: true }
      } else {
        return { success: false, error: response.message || "Registration failed" }
      }
    } catch (error: any) {
      return { success: false, error: error.message || "Network error. Please try again." }
    }
  }

  const logout = async () => {
    try {
      await api.logout()
      setUser(null)
    } catch (error) {
      // Even if API call fails, clear local state
      setUser(null)
      console.error('Logout error:', error)
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("userData", JSON.stringify(updatedUser))
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
