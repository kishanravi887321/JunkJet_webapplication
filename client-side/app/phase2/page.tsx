"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { OrganizationSetup } from "@/components/phase2/organization-setup"
import { AvailableWaste } from "@/components/phase2/available-waste"
import { InventoryManagement } from "@/components/phase2/inventory-management"
import { BuyerStats } from "@/components/phase2/buyer-stats"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building, Search, Package, BarChart3, CheckCircle, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function Phase2Page() {
  const { user } = useAuth()
  const [isOrganizationSetup, setIsOrganizationSetup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    // Check if user has completed organization setup
    // In a real app, you'd make an API call to check setup status
    setLoading(false)
    // For demo purposes, assume organization is not setup initially
    setIsOrganizationSetup(false)
  }, [user])

  const handleSetupSuccess = () => {
    setIsOrganizationSetup(true)
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
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="source-waste" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Source Waste</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="sales" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">Sales</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Operations Dashboard</h2>
                <p className="text-muted-foreground">Monitor your middle buyer operations and performance metrics</p>
              </div>
              <BuyerStats key={refreshKey} />
            </TabsContent>

            <TabsContent value="source-waste" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Source Waste Materials</h2>
                <p className="text-muted-foreground">
                  Browse and purchase waste materials from households in your network
                </p>
              </div>
              <AvailableWaste />
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Inventory Management</h2>
                <p className="text-muted-foreground">
                  Track your waste materials from purchase through processing to sale
                </p>
              </div>
              <InventoryManagement />
            </TabsContent>

            <TabsContent value="sales" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Sales to Organizations</h2>
                <p className="text-muted-foreground">
                  Connect with Phase 3 organizations to sell your processed materials
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Sales Dashboard</CardTitle>
                  <CardDescription>Manage your sales to Phase 3 organizations and track revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Sales Dashboard Coming Soon</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect with organizations to sell your processed materials at competitive prices.
                    </p>
                    <Button>Contact Organizations</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Organization Setup Complete
                  </CardTitle>
                  <CardDescription>
                    Your organization has been successfully registered. You can now access all Phase 2 features.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                      <div>
                        <div className="font-medium">Organization Registered</div>
                        <div className="text-sm text-muted-foreground">Connected to waste management network</div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setIsOrganizationSetup(false)}
                    >
                      Update Organization Information
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
