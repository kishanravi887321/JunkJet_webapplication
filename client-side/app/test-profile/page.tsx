"use client"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function ProfileTestPage() {
  const { user, updateUser } = useAuth()
  const [newAvatarUrl, setNewAvatarUrl] = useState("")

  const checkUserData = () => {
    console.log('👤 User Data:', user)
    console.log('🖼️ Avatar URL:', user?.avatar)
    console.log('📱 All localStorage:', localStorage.getItem('userData'))
  }

  const updateAvatar = () => {
    if (newAvatarUrl && user) {
      updateUser({ avatar: newAvatarUrl })
      alert('Avatar updated! Check the navbar.')
    }
  }

  const testAvatars = [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=100&h=100&fit=crop&crop=face"
  ]

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">❌ Not logged in</h1>
        <p>Please login first to test profile pictures.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Profile Picture Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Current User:</h2>
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Username:</strong> @{user.userName}</p>
          <p><strong>Avatar URL:</strong> {user.avatar || 'None'}</p>
        </div>

        <Button onClick={checkUserData} variant="outline" className="w-full">
          Check Console for User Data
        </Button>

        <div className="space-y-2">
          <h3 className="font-semibold">Test Avatar URLs:</h3>
          {testAvatars.map((url, index) => (
            <div key={index} className="flex items-center space-x-2">
              <img src={url} alt={`Test ${index + 1}`} className="w-8 h-8 rounded-full" />
              <Button 
                size="sm" 
                onClick={() => {
                  updateUser({ avatar: url })
                  alert('Avatar updated!')
                }}
              >
                Use This
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Custom Avatar URL:</h3>
          <Input
            placeholder="Enter image URL"
            value={newAvatarUrl}
            onChange={(e) => setNewAvatarUrl(e.target.value)}
          />
          <Button onClick={updateAvatar} className="w-full">
            Update Avatar
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Remove Avatar:</h3>
          <Button 
            variant="destructive" 
            onClick={() => {
              updateUser({ avatar: undefined })
              alert('Avatar removed!')
            }}
            className="w-full"
          >
            Remove Avatar (Show Initials)
          </Button>
        </div>

        <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded">
          <p>💡 <strong>Tips:</strong></p>
          <p>• After updating, check the navbar avatar</p>
          <p>• Use square images for best results</p>
          <p>• Image URLs must be publicly accessible</p>
        </div>
      </div>
    </div>
  )
}
