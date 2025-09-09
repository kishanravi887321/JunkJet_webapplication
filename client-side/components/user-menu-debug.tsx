"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, LogOut, UserCircle } from "lucide-react"
import { useAuth } from "@/lib/auth"

export function UserMenuDebug() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      console.log('🚪 Logout clicked!')
      await logout()
      console.log('✅ Logout successful')
      router.push("/")
    } catch (error) {
      console.error('❌ Logout failed:', error)
      router.push("/")
    }
  }

  const handleDropdownClick = () => {
    console.log('🖱️ Avatar clicked!')
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
        <div className="text-xs text-red-500">Not logged in</div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="text-xs text-green-500">Logged in as {user.fullName}</div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-10 rounded-full border border-red-500" 
            onClick={handleDropdownClick}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
              <AvatarFallback className="bg-blue-500 text-white">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.fullName}</p>
              <p className="text-xs leading-none text-muted-foreground">@{user.userName}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Alternative logout button for testing */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleLogout}
        className="ml-2"
      >
        Quick Logout
      </Button>
    </div>
  )
}
