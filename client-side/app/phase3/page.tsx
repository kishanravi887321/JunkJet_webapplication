"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AnalyticsOverview } from "@/components/phase3/analytics-overview"
import { ProcurementDashboard } from "@/components/phase3/procurement-dashboard"
import { ImpactReporting } from "@/components/phase3/impact-reporting"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart3, ShoppingCart, Leaf, Settings, Building, TrendingUp } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function Phase3Page() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you'd check organization setup status
    setLoading(false)
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-primary">Loading...</div>
          <p className="text-muted-foreground">Setting up your organization analytics dashboard</p>
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
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-balance">Phase 3: Organization Analytics</h1>
          </div>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Welcome to your comprehensive analytics dashboard. Monitor waste procurement, track environmental impact,
            and generate detailed sustainability reports for stakeholders.
          </p>
        </div>

        {/* Quick Stats Banner */}
        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            <strong>Performance Update:</strong> Your organization has achieved 96% sustainability score this month,
            processing 8.9K kg of waste and saving 1.78K kg of CO₂ emissions.
          </AlertDescription>
        </Alert>

        {/* Main Dashboard */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="procurement" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Procurement</span>
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              <span className="hidden sm:inline">Impact Reports</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Analytics Overview</h2>
              <p className="text-muted-foreground">
                Comprehensive insights into your waste management operations and performance metrics
              </p>
            </div>
            <AnalyticsOverview />
          </TabsContent>

          <TabsContent value="procurement" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Procurement Management</h2>
              <p className="text-muted-foreground">
                Source waste materials from Phase 2 suppliers and manage procurement contracts
              </p>
            </div>
            <ProcurementDashboard />
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Environmental Impact & Reporting</h2>
              <p className="text-muted-foreground">
                Track sustainability metrics, generate reports, and showcase your environmental impact
              </p>
            </div>
            <ImpactReporting />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Organization Settings</h2>
              <p className="text-muted-foreground">
                Configure your organization profile, preferences, and system settings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Organization Profile
                  </CardTitle>
                  <CardDescription>Manage your organization information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium">Organization Name</div>
                    <div className="text-sm text-muted-foreground">Global Sustainability Corp</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Industry</div>
                    <div className="text-sm text-muted-foreground">Waste Management & Recycling</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">Industrial District, City Center</div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Preferences</CardTitle>
                  <CardDescription>Configure dashboard settings and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium">Dashboard Theme</div>
                    <div className="text-sm text-muted-foreground">Light Mode (Auto-detect)</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Report Frequency</div>
                    <div className="text-sm text-muted-foreground">Weekly Email Reports</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Data Retention</div>
                    <div className="text-sm text-muted-foreground">24 months</div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Configure Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
