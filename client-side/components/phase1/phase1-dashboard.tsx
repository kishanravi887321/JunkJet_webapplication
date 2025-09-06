"use client"

import { useState } from "react"
import { AddWasteItem } from "./add-waste-item"
import { NearbyBuyers } from "./nearby-buyers"
import { HouseholdStats } from "./household-stats"
import { AddressRegistration } from "./address-registration"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Plus, Search, BarChart3, CheckCircle, Settings, Edit } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface Phase1DashboardProps {
  refreshKey: number
  onItemSuccess: () => void
}

export function Phase1Dashboard({ refreshKey, onItemSuccess }: Phase1DashboardProps) {
  const { user, updateUser } = useAuth()
  const [showUpdateForm, setShowUpdateForm] = useState(false)

  const handleAddressUpdate = () => {
    setShowUpdateForm(false)
    // Optionally refresh data here
  }

  if (showUpdateForm) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Update Address Information</h2>
          <Button variant="outline" onClick={() => setShowUpdateForm(false)}>
            Cancel
          </Button>
        </div>
        <AddressRegistration 
          onSuccess={handleAddressUpdate}
          isUpdate={true}
        />
      </div>
    )
  }

  return (
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
          <AddWasteItem onSuccess={onItemSuccess} />
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
              Phase 1 Registration Complete
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

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">User: {user?.fullName}</div>
                  <div className="text-sm text-muted-foreground">Email: {user?.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Phase 1 User
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowUpdateForm(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Address Information
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
