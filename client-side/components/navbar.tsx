"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  MessageCircle,
  Users,
  Building,
  BarChart3,
  User,
  Info,
  Menu,
  Search,
  Sun,
  Moon,
  Recycle,
  Package,
} from "lucide-react"
import { useTheme } from "next-themes"
import type { Route } from "@/lib/routes"
import { UserMenu } from "@/components/user-menu"

const iconMap = {
  Home,
  MessageCircle,
  Users,
  Building,
  BarChart3,
  User,
  Info,
  Menu,
  Search,
  Sun,
  Moon,
  Package,
}

interface NavbarProps {
  routes: Route[]
}

export function Navbar({ routes }: NavbarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const mainRoutes = routes.filter((route) => !route.path.startsWith("/auth"))

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
            <Recycle className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-primary">Junkjet</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 flex-1">
          {mainRoutes.map((route) => {
            const Icon = iconMap[route.icon as keyof typeof iconMap] || Home
            const isActive = pathname === route.path

            return (
              <Link
                key={route.path}
                href={route.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{route.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Search Bar & User Menu */}
        <div className="hidden md:flex items-center space-x-4 ml-auto">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8 w-64" />
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          <UserMenu />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-6">
                {mainRoutes.map((route) => {
                  const Icon = iconMap[route.icon as keyof typeof iconMap] || Home
                  const isActive = pathname === route.path

                  return (
                    <Link
                      key={route.path}
                      href={route.path}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{route.name}</span>
                    </Link>
                  )
                })}

                <div className="pt-4 border-t">
                  <div className="relative mb-4">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-8" />
                  </div>

                  {mounted && (
                    <Button
                      variant="outline"
                      className="w-full justify-start mb-4 bg-transparent"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun className="h-4 w-4 mr-2" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Moon className="h-4 w-4 mr-2" />
                          Dark Mode
                        </>
                      )}
                    </Button>
                  )}

                  <div className="w-full">
                    <UserMenu />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
