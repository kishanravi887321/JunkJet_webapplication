"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Package, IndianRupee, Users, BarChart3, PieChart } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts"

export function Phase1Analytics() {
  // Mock data - in real app, this would come from API
  const stats = {
    totalWasteSold: "48.2",
    totalEarnings: "₹15,640",
    activeBuyers: 12,
    impactScore: 87.5,
    growthRate: 15.8,
    efficiencyGain: 8.2
  }

  // Waste selling trend data
  const wasteTrendData = [
    { month: "Jan", weight: 2800, earnings: 2100 },
    { month: "Feb", weight: 3200, earnings: 2400 },
    { month: "Mar", weight: 4800, earnings: 3600 },
    { month: "Apr", weight: 3900, earnings: 2925 },
    { month: "May", weight: 5200, earnings: 3900 },
    { month: "Jun", weight: 4500, earnings: 3375 }
  ]

  // Material type distribution
  const materialData = [
    { name: "Plastic", value: 35, color: "#22c55e" },
    { name: "Paper", value: 25, color: "#84cc16" },
    { name: "Metal", value: 20, color: "#3b82f6" },
    { name: "Glass", value: 12, color: "#f97316" },
    { name: "Electronic", value: 8, color: "#8b5cf6" }
  ]

  // Monthly earnings trend
  const earningsTrendData = [
    { month: "Jan", amount: 2100 },
    { month: "Feb", amount: 2400 },
    { month: "Mar", amount: 3600 },
    { month: "Apr", amount: 2925 },
    { month: "May", amount: 3900 },
    { month: "Jun", amount: 3375 }
  ]

  // Top buyer performance
  const buyerPerformanceData = [
    { name: "GreenTech Recyclers", purchases: 8, amount: 4200 },
    { name: "EcoWaste Solutions", purchases: 6, amount: 3800 },
    { name: "Sustainable Materials", purchases: 5, amount: 2900 },
    { name: "Clean Earth Ltd", purchases: 4, amount: 2400 },
    { name: "Urban Waste Co", purchases: 3, amount: 2340 }
  ]

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Analytics Overview</h2>
        <p className="text-muted-foreground">
          Comprehensive insights into your waste selling operations and performance metrics
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Waste Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalWasteSold}K kg</div>
            <p className="text-xs text-green-600">
              +{stats.growthRate}% vs last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalEarnings}</div>
            <p className="text-xs text-green-600">
              +{stats.efficiencyGain}% efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Buyers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.activeBuyers}</div>
            <p className="text-xs text-muted-foreground">Phase 2 partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.impactScore}</div>
            <p className="text-xs text-muted-foreground">Sustainability rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Selling Trend */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Waste Selling Trend
            </CardTitle>
            <CardDescription>Monthly waste volume and earnings analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={wasteTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  formatter={(value, name) => [
                    name === 'weight' ? `${value} kg` : formatCurrency(value as number),
                    name === 'weight' ? 'Weight (kg)' : 'Earnings (₹)'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stackId="2"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Material Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Material Type Distribution
            </CardTitle>
            <CardDescription>Breakdown of sold materials by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={materialData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }: any) => `${name} ${value}%`}
                >
                  {materialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Earnings Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Monthly Earnings Trend
            </CardTitle>
            <CardDescription>Track your earning progression over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={earningsTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(value) => `₹${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  formatter={(value) => [formatCurrency(value as number), 'Earnings']}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Buyer Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Buyer Performance
            </CardTitle>
            <CardDescription>Revenue and volume metrics for key buyers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={buyerPerformanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" tickFormatter={(value) => `₹${value}`} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  formatter={(value, name) => [
                    name === 'amount' ? formatCurrency(value as number) : value,
                    name === 'amount' ? 'Total Paid' : 'Purchases'
                  ]}
                />
                <Bar dataKey="amount" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Best Performing Material</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">Plastic</div>
                <p className="text-sm text-muted-foreground">35% of total sales</p>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-700">
                ₹5,474 earned
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Sale Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">₹325</div>
                <p className="text-sm text-muted-foreground">Per transaction</p>
              </div>
              <Badge variant="secondary">
                +12% vs last month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">₹18,000</div>
                <p className="text-sm text-muted-foreground">Goal for this month</p>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                87% achieved
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
