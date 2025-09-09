"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TestDropdownPage() {
  const handleClick = () => {
    console.log('✅ Dropdown item clicked!')
    alert('Dropdown works!')
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test Dropdown Menu</h1>
      
      <div className="space-y-4">
        <p>Click the button below to test if dropdown menus work:</p>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-2 border-red-500">
              Click Me - Test Dropdown
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Test Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleClick} className="cursor-pointer">
              ✅ Test Item 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleClick} className="cursor-pointer">
              ✅ Test Item 2
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleClick} className="cursor-pointer text-red-600">
              🚪 Test Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <p className="text-sm text-gray-600">
          If this dropdown works, then the issue is with the UserMenu component specifically.
          If this doesn't work, then there's an issue with the dropdown menu component.
        </p>
      </div>
    </div>
  )
}
