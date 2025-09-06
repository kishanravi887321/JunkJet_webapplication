"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, History, TrendingUp, ShoppingCart, Zap } from "lucide-react"
import { TransactionDashboard } from "@/components/transactions/transaction-dashboard"
import { TransactionHistory } from "@/components/transactions/transaction-history"
import { QuickBuySell } from "@/components/transactions/quick-buy-sell"

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Transaction Center</h1>
            <p className="text-muted-foreground">
              Manage all your buying and selling activities in one place
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quick Sell</p>
                <p className="font-semibold">Instant Cash</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Smart Buy</p>
                <p className="font-semibold">Best Rates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <History className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Track History</p>
                <p className="font-semibold">Complete Records</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Zap className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eco Impact</p>
                <p className="font-semibold">Carbon Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="quick-trade" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Trade
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Transaction Dashboard</h2>
              <p className="text-muted-foreground">
                Overview of your recent activities and performance metrics
              </p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Live Data
            </Badge>
          </div>
          <TransactionDashboard />
        </TabsContent>

        <TabsContent value="quick-trade" className="space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-bold">Quick Trade</h2>
            <p className="text-muted-foreground">
              Create instant buy or sell transactions for household materials
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">Fast Setup</Badge>
              <Badge variant="secondary">Market Rates</Badge>
              <Badge variant="secondary">Instant Matching</Badge>
            </div>
          </div>
          <QuickBuySell />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Transaction History</h2>
              <p className="text-muted-foreground">
                Complete record of all your buying and selling activities
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">Searchable</Badge>
              <Badge variant="outline">Filterable</Badge>
              <Badge variant="outline">Exportable</Badge>
            </div>
          </div>
          <TransactionHistory />
        </TabsContent>
      </Tabs>

      {/* Footer Info */}
      <Card className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-green-800">Making Recycling Profitable</h3>
            <p className="text-green-700">
              Join thousands of households earning money while contributing to a cleaner environment
            </p>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-green-800">₹50L+</div>
                <div className="text-green-600">Total Earned</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-800">2.5M+</div>
                <div className="text-green-600">kg Recycled</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-800">500T+</div>
                <div className="text-green-600">CO₂ Saved</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
