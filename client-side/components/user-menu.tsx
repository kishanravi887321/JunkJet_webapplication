"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { useState } from "react"

export function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error('Logout failed:', error)
      router.push("/")
    }
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/register">Sign Up</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Avatar Button */}
      <Button 
        variant="ghost" 
        className="relative h-10 w-10 rounded-full p-0 overflow-hidden" 
        onClick={toggleMenu}
      >
        {user.avatar ? (
          // Show profile picture if available
          <img 
            src={user.avatar} 
            alt={user.fullName}
            className="h-full w-full rounded-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback to initials */}
        <div 
          className={`h-full w-full rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold ${user.avatar ? 'hidden' : 'flex'}`}
        >
          {user.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
      </Button>

      {/* Simple Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-medium">{user.fullName}</p>
            <p className="text-xs text-gray-500">@{user.userName}</p>
          </div>
          
          <div className="py-1">
            <Link 
              href="/profile" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              👤 Profile
            </Link>
            <Link 
              href="/settings" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              ⚙️ Settings
            </Link>
            <hr className="my-1" />
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              🚪 Log out
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  )
}
