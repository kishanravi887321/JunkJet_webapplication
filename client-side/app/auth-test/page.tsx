"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth"

// Types for better TypeScript support
interface LoginCredentials {
  email: string
  password: string
}

interface ApiResponse {
  success: boolean
  message: string
  data?: {
    userLoggedIn: {
      _id: string
      userName: string
      email: string
      fullName: string
    }
    accessToken: string
    refreshToken: string
  }
}

export default function TestAuthPage() {
  const { user, login } = useAuth()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "kishanravi887321@gmail.com",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Test backend connection
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking")

  useEffect(() => {
    checkBackendStatus()
  }, [])

  const checkBackendStatus = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/users/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        setBackendStatus("online")
      } else {
        setBackendStatus("offline")
      }
    } catch (error) {
      console.error("Backend check failed:", error)
      setBackendStatus("offline")
    }
  }

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const result = await login(credentials.email, credentials.password)
      
      if (result.success) {
        setMessage("✅ Login successful! Check the navbar for your profile.")
      } else {
        setError(`❌ Login failed: ${result.error}`)
      }
    } catch (error) {
      setError(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testDirectApiCall = async () => {
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data: ApiResponse = await response.json()
      
      if (response.ok && data.success) {
        setMessage(`✅ Direct API call successful! User: ${data.data?.userLoggedIn.fullName}`)
      } else {
        setError(`❌ API call failed: ${data.message}`)
      }
    } catch (error) {
      setError(`❌ API call error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Authentication Test Page</CardTitle>
          <CardDescription>
            Test login functionality and backend connectivity for production deployment
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Backend Status */}
          <div className="flex items-center justify-between p-3 border rounded">
            <span className="font-medium">Backend Status:</span>
            <span className={`px-2 py-1 rounded text-sm ${
              backendStatus === "online" ? "bg-green-100 text-green-800" :
              backendStatus === "offline" ? "bg-red-100 text-red-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {backendStatus === "checking" ? "Checking..." : 
               backendStatus === "online" ? "🟢 Online" : "🔴 Offline"}
            </span>
          </div>

          {/* Current User Status */}
          {user ? (
            <Alert>
              <AlertDescription>
                ✅ Already logged in as: <strong>{user.fullName}</strong> (@{user.userName})
                <br />
                <small>Check the navbar for your profile avatar and logout option.</small>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertDescription>
                ❌ Not logged in. Use the form below to test authentication.
              </AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={credentials.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleLogin} 
                disabled={loading || !credentials.email || !credentials.password}
                className="flex-1"
              >
                {loading ? "Testing..." : "🔐 Test Auth Hook Login"}
              </Button>
              
              <Button 
                onClick={testDirectApiCall} 
                disabled={loading || !credentials.email || !credentials.password}
                variant="outline"
                className="flex-1"
              >
                {loading ? "Testing..." : "🌐 Test Direct API Call"}
              </Button>
            </div>
          </div>

          {/* Results */}
          {message && (
            <Alert>
              <AlertDescription className="text-green-800">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Environment Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded text-sm">
            <h3 className="font-semibold mb-2">🔧 Environment Info:</h3>
            <div className="space-y-1">
              <div><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}</div>
              <div><strong>Node ENV:</strong> {process.env.NODE_ENV}</div>
              <div><strong>Deployment:</strong> {typeof window !== 'undefined' ? 'Client Side' : 'Server Side'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
