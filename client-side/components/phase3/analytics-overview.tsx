"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Package, DollarSign, Leaf, Users } from "lucide-react"

const monthlyData = [
  { month: "Jan", waste: 2400, cost: 12000, suppliers: 15, impact: 85 },
  { month: "Feb", waste: 1398, cost: 8500, suppliers: 18, impact: 88 },
  { month: "Mar", waste: 9800, cost: 45000, suppliers: 22, impact: 92 },
  { month: "Apr", waste: 3908, cost: 18500, suppliers: 25, impact: 89 },
  { month: "May", waste: 4800, cost: 22000, suppliers: 28, impact: 94 },
  { month: "Jun", waste: 3800, cost: 17500, suppliers: 30, impact: 96 },
]

const materialDistribution = [
  { name: "Plastic", value: 35, color: "#4caf50" },
  { name: "Paper", value: 25, color: "#8bc34a" },
  { name: "Metal", value: 20, color: "#2196f3" },
  { name: "Glass", value: 12, color: "#ff9800" },
  { name: "Electronic", value: 8, color: "#9c27b0" },
]

const supplierPerformance = [
  { name: "EcoWaste Solutions", reliability: 98, volume: 1200, rating: 4.9 },
  { name: "Green Recyclers", reliability: 95, volume: 980, rating: 4.7 },
  { name: "Urban Waste Co", reliability: 92, volume: 850, rating: 4.5 },
  { name: "Clean Earth Ltd", reliability: 89, volume: 720, rating: 4.3 },
  { name: "Sustainable Materials", reliability: 87, volume: 650, rating: 4.2 },
]

export function AnalyticsOverview() {
  const totalWaste = monthlyData.reduce((sum, item) => sum + item.waste, 0)
  const totalCost = monthlyData.reduce((sum, item) => sum + item.cost, 0)
  const avgImpact = monthlyData.reduce((sum, item) => sum + item.impact, 0) / monthlyData.length
  const totalSuppliers = Math.max(...monthlyData.map((item) => item.suppliers))

  const wasteGrowth = ((monthlyData[monthlyData.length - 1].waste - monthlyData[0].waste) / monthlyData[0].waste) * 100
  const costEfficiency =
    ((monthlyData[0].cost / monthlyData[0].waste -
      monthlyData[monthlyData.length - 1].cost / monthlyData[monthlyData.length - 1].waste) /
      (monthlyData[0].cost / monthlyData[0].waste)) *
    100

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Waste Processed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{(totalWaste / 1000).toFixed(1)}K kg</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {wasteGrowth > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={wasteGrowth > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(wasteGrowth).toFixed(1)}%
              </span>
              <span className="ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{(totalCost / 1000).toFixed(0)}K</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {costEfficiency > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={costEfficiency > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(costEfficiency).toFixed(1)}% efficiency
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">Phase 2 partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{avgImpact.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Sustainability rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Processing Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Waste Processing Trend</CardTitle>
            <CardDescription>Monthly waste volume and cost analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="waste"
                  stroke="#4caf50"
                  strokeWidth={2}
                  name="Waste (kg)"
                />
                <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#2196f3" strokeWidth={2} name="Cost (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Material Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Material Type Distribution</CardTitle>
            <CardDescription>Breakdown of processed materials by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={materialDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {materialDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Score Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Sustainability Impact Trend</CardTitle>
            <CardDescription>Monthly sustainability and environmental impact scores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="impact" stroke="#4caf50" fill="#4caf50" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Supplier Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Supplier Performance</CardTitle>
            <CardDescription>Reliability and volume metrics for key suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplierPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="reliability" fill="#4caf50" name="Reliability %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Details */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Performance Details</CardTitle>
          <CardDescription>Comprehensive view of supplier metrics and ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supplierPerformance.map((supplier, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{supplier.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Volume: {supplier.volume} kg/month • Rating: {supplier.rating}/5.0
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">Reliability</div>
                    <div className="text-xs text-muted-foreground">{supplier.reliability}%</div>
                  </div>
                  <Progress value={supplier.reliability} className="w-24" />
                  <Badge
                    variant={
                      supplier.reliability >= 95 ? "default" : supplier.reliability >= 90 ? "secondary" : "destructive"
                    }
                  >
                    {supplier.reliability >= 95
                      ? "Excellent"
                      : supplier.reliability >= 90
                        ? "Good"
                        : "Needs Improvement"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
