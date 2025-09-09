"use client"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function TestAuthPage() {
  const { user, login, logout } = useAuth()
  const [email, setEmail] = useState("kishanravi887321@gmail.com")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const result = await login(email, password)
    if (result.success) {
      alert("Login successful! Check the navbar for profile button.")
    } else {
      alert("Login failed: " + result.error)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await logout()
    alert("Logged out!")
  }

  return (
    <div className="container mx-auto p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Test Authentication</h1>
      
      {user ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-100 rounded">
            <h2 className="font-semibold">✅ Logged in as:</h2>
            <p>{user.fullName}</p>
            <p className="text-sm text-gray-600">@{user.userName}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm">✅ You should now see your profile picture in the top-right navbar</p>
            <p className="text-sm">✅ Click on it to see the dropdown with logout option</p>
          </div>
          
          <Button onClick={handleLogout} variant="destructive">
            Logout (Alternative)
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-yellow-100 rounded">
            <p>❌ Not logged in. Please login to see the profile button.</p>
          </div>
          
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              onClick={handleLogin} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Logging in..." : "Quick Login"}
            </Button>
          </div>
          
          <p className="text-sm text-gray-600">
            After login, check the top-right corner of the navbar for your profile avatar.
          </p>
        </div>
      )}
    </div>
  )
}
