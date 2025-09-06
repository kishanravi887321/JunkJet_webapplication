"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AddressRegistration } from "@/components/phase1/address-registration"
import { AddWasteItem } from "@/components/phase1/add-waste-item"
import { NearbyBuyers } from "@/components/phase1/nearby-buyers"
import { HouseholdStats } from "@/components/phase1/household-stats"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Plus, Search, BarChart3, CheckCircle, Home } from "lucide-react"
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
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="add-item" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Item</span>
              </TabsTrigger>
              <TabsTrigger value="find-buyers" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Find Buyers</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Your Impact Dashboard</h2>
                <p className="text-muted-foreground">
                  Track your waste management progress and environmental contribution
                </p>
              </div>
              <HouseholdStats key={refreshKey} />
            </TabsContent>

            <TabsContent value="add-item" className="space-y-6">
              <div className="max-w-2xl mx-auto">
                <AddWasteItem onSuccess={handleItemSuccess} />
              </div>
            </TabsContent>

            <TabsContent value="find-buyers" className="space-y-6">
              <div className="max-w-4xl mx-auto">
                <NearbyBuyers />
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Registration Complete
                  </CardTitle>
                  <CardDescription>
                    Your address has been successfully registered. You can now access all Phase 1 features.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                      <div>
                        <div className="font-medium">Address Registered</div>
                        <div className="text-sm text-muted-foreground">Connected to local waste management network</div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setIsAddressRegistered(false)}
                    >
                      Update Address Information
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ProtectedRoute>
  )
}
