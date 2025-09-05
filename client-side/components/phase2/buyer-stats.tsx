"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, DollarSign, Users, Target, Award, Recycle } from "lucide-react"

export function BuyerStats() {
  // Mock data - in real app, this would come from API
  const stats = {
    totalPurchases: 156,
    totalProcessed: "2,340 kg",
    totalRevenue: "$12,450",
    activeSources: 24,
    monthlyTarget: 3000, // kg
    currentMonth: 2340, // kg
    efficiency: 92,
    customerSatisfaction: 4.8,
    avgProcessingTime: "3.2 days",
  }

  const progressPercentage = (stats.currentMonth / stats.monthlyTarget) * 100

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Purchases */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalPurchases}</div>
          <p className="text-xs text-muted-foreground">Waste batches acquired</p>
        </CardContent>
      </Card>

      {/* Total Processed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
          <Recycle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalProcessed}</div>
          <p className="text-xs text-muted-foreground">Materials processed to date</p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalRevenue}</div>
          <p className="text-xs text-muted-foreground">Revenue from sales</p>
        </CardContent>
      </Card>

      {/* Active Sources */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.activeSources}</div>
          <p className="text-xs text-muted-foreground">Household suppliers</p>
        </CardContent>
      </Card>

      {/* Monthly Target Progress */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Monthly Processing Target
          </CardTitle>
          <CardDescription>Track your progress towards this month's processing goal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {stats.currentMonth} kg / {stats.monthlyTarget} kg
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{Math.round(progressPercentage)}% complete</span>
            <Badge variant={progressPercentage >= 100 ? "default" : "secondary"}>
              {progressPercentage >= 100
                ? "Target Achieved!"
                : `${Math.round(stats.monthlyTarget - stats.currentMonth)} kg to go`}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Performance Metrics
          </CardTitle>
          <CardDescription>Key performance indicators for your operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.efficiency}%</div>
              <div className="text-sm text-muted-foreground">Processing Efficiency</div>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.customerSatisfaction}</div>
              <div className="text-sm text-muted-foreground">Customer Rating</div>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.avgProcessingTime}</div>
              <div className="text-sm text-muted-foreground">Avg Processing Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
