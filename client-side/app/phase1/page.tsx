"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AddressRegistration } from "@/components/phase1/address-registration"
import { Phase1Dashboard } from "@/components/phase1/phase1-dashboard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Home } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function Phase1Page() {
  const { user, updateUser } = useAuth()
  const [isAddressRegistered, setIsAddressRegistered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    // Check if user has registered address using the isPhase1User flag
    if (user) {
      setIsAddressRegistered(user.isPhase1User || false)
    }
    setLoading(false)
  }, [user])

  const handleAddressSuccess = () => {
    setIsAddressRegistered(true)
    // Update user's phase status in local state
    if (user) {
      updateUser({ ...user, isPhase1User: true })
    }
  }

  const handleItemSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-primary">Loading...</div>
          <p className="text-muted-foreground">Setting up your household dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-balance">Phase 1: Household Dashboard</h1>
          </div>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Welcome to your household waste management hub. List your waste items, find nearby buyers, and track your
            environmental impact.
          </p>
        </div>

        {/* Address Registration Check */}
        {!isAddressRegistered && (
          <Alert>
            <Home className="h-4 w-4" />
            <AlertDescription>
              Please register your address first to access all Phase 1 features and connect with nearby buyers.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        {!isAddressRegistered ? (
          <div className="max-w-2xl mx-auto">
            <AddressRegistration onSuccess={handleAddressSuccess} />
          </div>
        ) : (
          <Phase1Dashboard refreshKey={refreshKey} onItemSuccess={handleItemSuccess} />
        )}
      </div>
    </ProtectedRoute>
  )
}
