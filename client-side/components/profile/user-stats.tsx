"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recycle, TrendingUp, Award, Leaf } from "lucide-react"

interface UserStatsProps {
  stats: {
    totalWasteContributed: number
    itemsRecycled: number
    co2Saved: number
    treesEquivalent: number
    rank: string
    joinDate: string
  }
}

export function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-emerald-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Waste Contributed</CardTitle>
          <Recycle className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-700">{stats.totalWasteContributed} kg</div>
          <p className="text-xs text-gray-500 mt-1">Since {new Date(stats.joinDate).toLocaleDateString()}</p>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Items Recycled</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{stats.itemsRecycled}</div>
          <p className="text-xs text-gray-500 mt-1">Individual items processed</p>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">CO₂ Saved</CardTitle>
          <Leaf className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{stats.co2Saved} kg</div>
          <p className="text-xs text-gray-500 mt-1">Carbon footprint reduced</p>
        </CardContent>
      </Card>

      <Card className="border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Environmental Rank</CardTitle>
          <Award className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {stats.rank}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">≈ {stats.treesEquivalent} trees planted</p>
        </CardContent>
      </Card>
    </div>
  )
}
