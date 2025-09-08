"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Loader2,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import {
  getAreaWasteCollection,
  getMonthlyTrends,
  getIndustryDistribution,
  getTransactionFlow
} from "@/lib/api"

interface AnalyticsData {
  areaData: Array<{
    area: string
    wasteCollected: number
    revenue: number
    transactions: number
  }>
  monthlyData: Array<{
    month: string
    collected: number
    sold: number
    revenue: number
    profit: number
  }>
  industryData: Array<{
    name: string
    percentage: number
    value: number
    color: string
  }>
  transactionFlow: Array<{
    month: string
    buying: number
    selling: number
    netProfit: number
  }>
}

export function RealTimeAnalyticsDashboard() {
  const { user } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("3m")

  const fetchAnalyticsData = async () => {
    if (!user?.email) return

    try {
      setLoading(true)
      setError(null)

      // Fetch all analytics data in parallel
      const [areaResponse, monthlyResponse, industryResponse, flowResponse] = await Promise.all([
        getAreaWasteCollection(user.email),
        getMonthlyTrends(user.email),
        getIndustryDistribution(user.email),
        getTransactionFlow(user.email)
      ])

      setAnalyticsData({
        areaData: areaResponse.data || [],
        monthlyData: monthlyResponse.data || [],
        industryData: industryResponse.data || [],
        transactionFlow: flowResponse.data || []
      })
    } catch (err) {
      console.error('Error fetching analytics data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [user?.email, timeRange])

  const formatCurrency = (value: number) => `₹${(value / 1000).toFixed(0)}K`
  const formatWeight = (value: number) => `${value.toFixed(0)} kg`

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" className="ml-2" onClick={fetchAnalyticsData}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!analyticsData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No analytics data available. Start collecting waste to see insights.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Real-Time Analytics</h2>
          <p className="text-muted-foreground">Live data from your waste management operations</p>
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
          <Button variant="outline" onClick={fetchAnalyticsData}>
            Refresh
          </Button>
        </div>
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
            <CardDescription>Real-time collection data from different areas</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.areaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={analyticsData.areaData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" angle={-45} textAnchor="end" height={80} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => [
                    name === 'wasteCollected' ? `${value} kg` : 
                    name === 'revenue' ? formatCurrency(Number(value)) : value,
                    name === 'wasteCollected' ? 'Waste Collected' :
                    name === 'revenue' ? 'Revenue' : 'Transactions'
                  ]} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="wasteCollected" fill="#3b82f6" name="Waste (kg)" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} name="Revenue (₹)" />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No area data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. Monthly Waste Collection Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              Monthly Collection Trends
            </CardTitle>
            <CardDescription>Monthly collection and processing trends</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No monthly data available
              </div>
            )}
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
            <CardDescription>Current waste sales breakdown by industry</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.industryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.industryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.industryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} tons`, name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {analyticsData.industryData.slice(0, 4).map((industry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: industry.color }}
                      />
                      <span className="text-muted-foreground truncate">{industry.name}</span>
                      <Badge variant="secondary">{industry.percentage}%</Badge>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No industry data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. Money Flow Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-orange-500" />
              Transaction Money Flow
            </CardTitle>
            <CardDescription>Real-time buying vs selling with profit analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.transactionFlow.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={analyticsData.transactionFlow} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    formatCurrency(Number(value)),
                    name === 'buying' ? 'Buying Cost' :
                    name === 'selling' ? 'Selling Revenue' : 'Net Profit'
                  ]} />
                  <Legend />
                  <Bar dataKey="buying" fill="#ef4444" name="Buying Cost" />
                  <Bar dataKey="selling" fill="#22c55e" name="Selling Revenue" />
                  <Line type="monotone" dataKey="netProfit" stroke="#f59e0b" strokeWidth={3} name="Net Profit" />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No transaction flow data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Quick Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {analyticsData.areaData.reduce((sum, area) => sum + area.wasteCollected, 0).toLocaleString()} kg
              </div>
              <div className="text-sm text-blue-600">Total Waste Collected</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(analyticsData.areaData.reduce((sum, area) => sum + area.revenue, 0))}
              </div>
              <div className="text-sm text-green-600">Total Revenue</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analyticsData.industryData.length}
              </div>
              <div className="text-sm text-purple-600">Industry Partners</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {analyticsData.areaData.reduce((sum, area) => sum + area.transactions, 0)}
              </div>
              <div className="text-sm text-orange-600">Total Transactions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
