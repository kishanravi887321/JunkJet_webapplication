"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface User {
  _id: string
  userName: string
  email: string
  fullName: string
  avatar?: string
  coverImage?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
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
    const token = localStorage.getItem("accessToken")
    const userData = localStorage.getItem("userData")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("userData")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.status === 200) {
        const { userLoggedIn, accessToken } = data.data
        setUser(userLoggedIn)
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("userData", JSON.stringify(userLoggedIn))
        return { success: true }
      } else {
        return { success: false, error: data.message || "Login failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      const formData = new FormData()
      formData.append("userName", registerData.userName)
      formData.append("email", registerData.email)
      formData.append("password", registerData.password)
      formData.append("fullName", registerData.fullName)

      if (registerData.avatar) {
        formData.append("avatar", registerData.avatar)
      }
      if (registerData.coverImage) {
        formData.append("coverImage", registerData.coverImage)
      }

      const response = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.status === 201) {
        return { success: true }
      } else {
        return { success: false, error: data.message || "Registration failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("userData")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
