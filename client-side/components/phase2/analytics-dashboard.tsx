"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  ScatterChart,
  Scatter,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  Building2,
  IndianRupee,
  Recycle,
  Users,
  Package,
  Factory,
} from "lucide-react"

// Mock data - in real app, this would come from API
const areaWasteData = [
  { area: "Downtown", wasteCollected: 2500, revenue: 185000, transactions: 45 },
  { area: "Industrial Zone", wasteCollected: 3200, revenue: 240000, transactions: 62 },
  { area: "Residential East", wasteCollected: 1800, revenue: 135000, transactions: 38 },
  { area: "Commercial District", wasteCollected: 2800, revenue: 210000, transactions: 54 },
  { area: "Suburbs North", wasteCollected: 1500, revenue: 112500, transactions: 28 },
  { area: "Tech Park", wasteCollected: 2200, revenue: 165000, transactions: 41 },
  { area: "Old City", wasteCollected: 1900, revenue: 142500, transactions: 35 },
  { area: "New Development", wasteCollected: 1600, revenue: 120000, transactions: 30 },
]

const monthlyWasteData = [
  { month: "Jan", collected: 12500, sold: 11800, revenue: 885000, profit: 125000 },
  { month: "Feb", collected: 13200, sold: 12900, revenue: 967500, profit: 145000 },
  { month: "Mar", collected: 14800, sold: 14200, revenue: 1065000, profit: 165000 },
  { month: "Apr", collected: 15500, sold: 15100, revenue: 1132500, profit: 185000 },
  { month: "May", collected: 16200, sold: 15800, revenue: 1185000, profit: 195000 },
  { month: "Jun", collected: 17100, sold: 16600, revenue: 1245000, profit: 215000 },
  { month: "Jul", collected: 18200, sold: 17500, revenue: 1312500, profit: 235000 },
  { month: "Aug", collected: 19500, sold: 18900, revenue: 1417500, profit: 265000 },
  { month: "Sep", collected: 20100, sold: 19200, revenue: 1440000, profit: 275000 },
]

const industryData = [
  { name: "Plastic Recycling Co.", percentage: 25, value: 4500, color: "#0088FE" },
  { name: "Paper Mills Ltd.", percentage: 20, value: 3600, color: "#00C49F" },
  { name: "Metal Processing Inc.", percentage: 18, value: 3240, color: "#FFBB28" },
  { name: "Glass Industries", percentage: 15, value: 2700, color: "#FF8042" },
  { name: "E-waste Solutions", percentage: 12, value: 2160, color: "#8884D8" },
  { name: "Textile Recyclers", percentage: 6, value: 1080, color: "#82CA9D" },
  { name: "Others", percentage: 4, value: 720, color: "#FFC658" },
]

const transactionFlowData = [
  { month: "Jan", buying: 580000, selling: 885000, netProfit: 305000 },
  { month: "Feb", buying: 620000, selling: 967500, netProfit: 347500 },
  { month: "Mar", buying: 680000, selling: 1065000, netProfit: 385000 },
  { month: "Apr", buying: 720000, selling: 1132500, netProfit: 412500 },
  { month: "May", buying: 750000, selling: 1185000, netProfit: 435000 },
  { month: "Jun", buying: 780000, selling: 1245000, netProfit: 465000 },
  { month: "Jul", buying: 820000, selling: 1312500, netProfit: 492500 },
  { month: "Aug", buying: 880000, selling: 1417500, netProfit: 537500 },
  { month: "Sep", buying: 920000, selling: 1440000, netProfit: 520000 },
]

const materialTypeData = [
  { material: "Plastic", volume: 35, revenue: 420000, efficiency: 85 },
  { material: "Paper", volume: 28, revenue: 315000, efficiency: 92 },
  { material: "Metal", volume: 15, revenue: 285000, efficiency: 95 },
  { material: "Glass", volume: 12, revenue: 180000, efficiency: 78 },
  { material: "Electronic", volume: 6, revenue: 225000, efficiency: 88 },
  { material: "Organic", volume: 4, revenue: 60000, efficiency: 65 },
]

const supplierPerformanceData = [
  { supplier: "GreenHomes Co-op", wasteSupplied: 2500, reliability: 95, avgPrice: 75 },
  { supplier: "EcoVillage Society", wasteSupplied: 2200, reliability: 88, avgPrice: 82 },
  { supplier: "Urban Collectors", wasteSupplied: 1800, reliability: 92, avgPrice: 78 },
  { supplier: "Residential Network", wasteSupplied: 2800, reliability: 85, avgPrice: 80 },
  { supplier: "Community Groups", wasteSupplied: 1500, reliability: 90, avgPrice: 77 },
]

const operationalMetrics = [
  { metric: "Collection Efficiency", current: 94, target: 95, trend: "up" },
  { metric: "Processing Speed", current: 87, target: 90, trend: "up" },
  { metric: "Quality Score", current: 91, target: 92, trend: "stable" },
  { metric: "Customer Satisfaction", current: 4.6, target: 4.8, trend: "up" },
  { metric: "Waste Utilization", current: 96, target: 98, trend: "up" },
  { metric: "Cost Efficiency", current: 89, target: 90, trend: "down" },
]

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("3m")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  const formatCurrency = (value: number) => `₹${(value / 1000).toFixed(0)}K`
  const formatWeight = (value: number) => `${value.toFixed(0)} kg`

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Phase 2 Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive waste management insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Waste Processed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156.8 tons</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹14.4L</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> +5 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industry Partners</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> +2 new partnerships
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Areas with Most Waste Collection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Waste Collection by Area
            </CardTitle>
            <CardDescription>Top performing collection areas by volume and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={areaWasteData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => [
                  name === 'wasteCollected' ? `${value} kg` : 
                  name === 'revenue' ? `₹${(Number(value) / 1000).toFixed(0)}K` : value,
                  name === 'wasteCollected' ? 'Waste Collected' :
                  name === 'revenue' ? 'Revenue' : 'Transactions'
                ]} />
                <Legend />
                <Bar yAxisId="left" dataKey="wasteCollected" fill="#3b82f6" name="Waste (kg)" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} name="Revenue (₹)" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 2. Monthly Waste Collection Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              Monthly Collection Trends
            </CardTitle>
            <CardDescription>Waste collection and processing over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyWasteData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  `${value} kg`,
                  name === 'collected' ? 'Collected' : 'Sold'
                ]} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="collected" 
                  stackId="1"
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorCollected)"
                  name="Collected (kg)"
                />
                <Area 
                  type="monotone" 
                  dataKey="sold" 
                  stackId="2"
                  stroke="#6366f1" 
                  fillOpacity={1} 
                  fill="url(#colorSold)"
                  name="Sold (kg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Industry Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-500" />
              Industry Partners Distribution
            </CardTitle>
            <CardDescription>Waste sales breakdown by industry type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} tons`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {industryData.slice(0, 4).map((industry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: industry.color }}
                  />
                  <span className="text-muted-foreground">{industry.name}</span>
                  <Badge variant="secondary">{industry.percentage}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 4. Money Flow Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-orange-500" />
              Transaction Money Flow
            </CardTitle>
            <CardDescription>Buying vs selling with profit analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={transactionFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  `₹${(Number(value) / 1000).toFixed(0)}K`,
                  name === 'buying' ? 'Buying Cost' :
                  name === 'selling' ? 'Selling Revenue' : 'Net Profit'
                ]} />
                <Legend />
                <Bar dataKey="buying" fill="#ef4444" name="Buying Cost" />
                <Bar dataKey="selling" fill="#22c55e" name="Selling Revenue" />
                <Line type="monotone" dataKey="netProfit" stroke="#f59e0b" strokeWidth={3} name="Net Profit" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Material Type Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Recycle className="h-5 w-5 text-teal-500" />
              Material Type Performance
            </CardTitle>
            <CardDescription>Efficiency and revenue by material type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={materialTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="material" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="volume" fill="#06b6d4" name="Volume %" />
                <Bar yAxisId="left" dataKey="efficiency" fill="#8b5cf6" name="Efficiency %" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} name="Revenue (₹)" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Supplier Performance Scatter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-500" />
              Supplier Performance Matrix
            </CardTitle>
            <CardDescription>Reliability vs volume supplied analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis 
                  type="number" 
                  dataKey="wasteSupplied" 
                  name="Waste Supplied"
                  label={{ value: 'Waste Supplied (tons)', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="reliability" 
                  name="Reliability"
                  label={{ value: 'Reliability %', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => [
                    name === 'wasteSupplied' ? `${value} tons` : `${value}%`,
                    name === 'wasteSupplied' ? 'Waste Supplied' : 'Reliability'
                  ]}
                />
                <Scatter name="Suppliers" data={supplierPerformanceData} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Operational Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Operational Metrics Overview
          </CardTitle>
          <CardDescription>Key performance indicators and targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {operationalMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{metric.metric}</span>
                  {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                  {metric.trend === 'stable' && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                </div>
                <div className="text-2xl font-bold mb-1">
                  {metric.metric === 'Customer Satisfaction' ? metric.current : `${metric.current}%`}
                </div>
                <div className="text-xs text-muted-foreground">
                  Target: {metric.metric === 'Customer Satisfaction' ? metric.target : `${metric.target}%`}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metric.current >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ 
                      width: `${metric.metric === 'Customer Satisfaction' 
                        ? (metric.current / 5) * 100 
                        : metric.current}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
