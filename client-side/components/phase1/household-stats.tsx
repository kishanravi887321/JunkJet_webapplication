"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Recycle, TrendingUp, Package, DollarSign, Leaf, Award } from "lucide-react"

export function HouseholdStats() {
  // Mock data - in real app, this would come from API
  const stats = {
    totalItems: 24,
    totalWeight: "156 kg",
    totalValue: "$340",
    recycledItems: 18,
    monthlyGoal: 200, // kg
    currentMonth: 156, // kg
    impactScore: 85,
    co2Saved: "45 kg",
  }

  const progressPercentage = (stats.currentMonth / stats.monthlyGoal) * 100

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items Listed</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalItems}</div>
          <p className="text-xs text-muted-foreground">{stats.recycledItems} successfully recycled</p>
        </CardContent>
      </Card>

      {/* Total Weight */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Weight</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalWeight}</div>
          <p className="text-xs text-muted-foreground">Waste diverted from landfills</p>
        </CardContent>
      </Card>

      {/* Total Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalValue}</div>
          <p className="text-xs text-muted-foreground">Earned from waste items</p>
        </CardContent>
      </Card>

      {/* Impact Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.impactScore}</div>
          <p className="text-xs text-muted-foreground">Sustainability rating</p>
        </CardContent>
      </Card>

      {/* Monthly Progress */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Recycle className="h-5 w-5 text-primary" />
            Monthly Recycling Goal
          </CardTitle>
          <CardDescription>Track your progress towards this month's recycling target</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {stats.currentMonth} kg / {stats.monthlyGoal} kg
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{Math.round(progressPercentage)}% complete</span>
            <Badge variant={progressPercentage >= 100 ? "default" : "secondary"}>
              {progressPercentage >= 100
                ? "Goal Achieved!"
                : `${Math.round(stats.monthlyGoal - stats.currentMonth)} kg to go`}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            Environmental Impact
          </CardTitle>
          <CardDescription>Your contribution to a sustainable future</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.co2Saved}</div>
              <div className="text-sm text-muted-foreground">CO₂ Emissions Saved</div>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.recycledItems}</div>
              <div className="text-sm text-muted-foreground">Items Recycled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
