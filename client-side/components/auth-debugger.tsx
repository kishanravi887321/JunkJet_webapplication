"use client"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { getToken, getRefreshToken } from "@/lib/api"

export function AuthDebugger() {
  const { user, loading } = useAuth()

  const checkAuthState = () => {
    console.log('🔍 Authentication Debug Info:')
    console.log('User state:', user)
    console.log('Loading:', loading)
    console.log('Access Token:', getToken() ? 'EXISTS' : 'NOT FOUND')
    console.log('Refresh Token:', getRefreshToken() ? 'EXISTS' : 'NOT FOUND')
    console.log('LocalStorage userData:', localStorage.getItem('userData'))
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 p-4 bg-background border rounded-lg shadow-lg">
      <h3 className="font-semibold mb-2">Auth Debug</h3>
      <div className="space-y-2 text-sm">
        <div>User: {user ? user.fullName : 'Not logged in'}</div>
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>Token: {getToken() ? 'Exists' : 'None'}</div>
        <Button size="sm" onClick={checkAuthState}>
          Check Console
        </Button>
      </div>
    </div>
  )
}
