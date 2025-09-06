"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { OrganizationSetup } from "@/components/phase2/organization-setup"
import { Phase2Dashboard } from "@/components/phase2/phase2-dashboard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function Phase2Page() {
  const { user, updateUser } = useAuth()
  const [isOrganizationSetup, setIsOrganizationSetup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    // Check if user has completed organization setup using the isPhase2User flag
    if (user) {
      setIsOrganizationSetup(user.isPhase2User || false)
    }
    setLoading(false)
  }, [user])

  const handleSetupSuccess = () => {
    setIsOrganizationSetup(true)
    // Update user's phase status in local state
    if (user) {
      updateUser({ ...user, isPhase2User: true })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-primary">Loading...</div>
          <p className="text-muted-foreground">Setting up your middle buyer dashboard</p>
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
              <Building className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-balance">Phase 2: Middle Buyer Dashboard</h1>
          </div>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Welcome to your middle buyer operations hub. Source waste from households, manage your processing
            operations, and connect with organizations.
          </p>
        </div>

        {/* Organization Setup Check */}
        {!isOrganizationSetup && (
          <Alert>
            <Building className="h-4 w-4" />
            <AlertDescription>
              Please complete your organization setup first to access all Phase 2 features and start sourcing waste
              materials.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        {!isOrganizationSetup ? (
          <div className="max-w-4xl mx-auto">
            <OrganizationSetup onSuccess={handleSetupSuccess} />
          </div>
        ) : (
          <Phase2Dashboard refreshKey={refreshKey} />
        )}
      </div>
    </ProtectedRoute>
  )
}
