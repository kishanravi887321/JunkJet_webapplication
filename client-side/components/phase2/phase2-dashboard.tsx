"use client"

import { useState } from "react"
import { AvailableWaste } from "./available-waste"
import { InventoryManagement } from "./inventory-management"
import { BuyerStats } from "./buyer-stats"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { RealTimeAnalyticsDashboard } from "./real-time-analytics"
import { OrganizationSetup } from "./organization-setup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Search, Package, BarChart3, CheckCircle, Edit, TrendingUp } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface Phase2DashboardProps {
  refreshKey: number
}

export function Phase2Dashboard({ refreshKey }: Phase2DashboardProps) {
  const { user } = useAuth()
  const [showUpdateForm, setShowUpdateForm] = useState(false)

  const handleOrganizationUpdate = () => {
    setShowUpdateForm(false)
    // Optionally refresh data here
  }

  if (showUpdateForm) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Update Organization Details</h2>
          <Button variant="outline" onClick={() => setShowUpdateForm(false)}>
            Cancel
          </Button>
        </div>
        <OrganizationSetup 
          onSuccess={handleOrganizationUpdate}
          isUpdate={true}
        />
      </div>
    )
  }

  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Analytics</span>
        </TabsTrigger>
        <TabsTrigger value="available-waste" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Find Waste</span>
        </TabsTrigger>
        <TabsTrigger value="inventory" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <span className="hidden sm:inline">Inventory</span>
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Buyer Overview</h2>
          <p className="text-muted-foreground">
            Quick summary of your waste sourcing performance
          </p>
        </div>
        <BuyerStats key={refreshKey} />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold">Analytics Dashboard</h3>
            <p className="text-muted-foreground">Comprehensive insights into your waste management operations</p>
          </div>
        </div>
        <RealTimeAnalyticsDashboard />
      </TabsContent>

      <TabsContent value="available-waste" className="space-y-6">
        <div className="max-w-4xl mx-auto">
          <AvailableWaste />
        </div>
      </TabsContent>

      <TabsContent value="inventory" className="space-y-6">
        <div className="max-w-4xl mx-auto">
          <InventoryManagement />
        </div>
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Phase 2 Registration Complete
            </CardTitle>
            <CardDescription>
              Your organization has been successfully registered as a waste buyer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <div>
                  <div className="font-medium">Organization Registered</div>
                  <div className="text-sm text-muted-foreground">Active waste buyer in the network</div>
                </div>
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">User: {user?.fullName}</div>
                  <div className="text-sm text-muted-foreground">Email: {user?.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Phase 2 User
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowUpdateForm(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Organization Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
