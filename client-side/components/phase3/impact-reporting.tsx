"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Leaf, Award, Target, TrendingUp, Download, Share, Globe, Recycle, Zap, Droplets } from "lucide-react"

const sustainabilityData = [
  { month: "Jan", co2Saved: 1200, energySaved: 850, waterSaved: 2400, wasteProcessed: 5600 },
  { month: "Feb", co2Saved: 1350, energySaved: 920, waterSaved: 2650, wasteProcessed: 6200 },
  { month: "Mar", co2Saved: 1580, energySaved: 1100, waterSaved: 3100, wasteProcessed: 7800 },
  { month: "Apr", co2Saved: 1420, energySaved: 980, waterSaved: 2850, wasteProcessed: 6900 },
  { month: "May", co2Saved: 1650, energySaved: 1150, waterSaved: 3200, wasteProcessed: 8200 },
  { month: "Jun", co2Saved: 1780, energySaved: 1250, waterSaved: 3450, wasteProcessed: 8900 },
]

const impactByMaterial = [
  { material: "Plastic", co2Impact: 2400, energyImpact: 1800, recyclingRate: 85 },
  { material: "Paper", co2Impact: 1800, energyImpact: 1200, recyclingRate: 92 },
  { material: "Metal", co2Impact: 3200, energyImpact: 2400, recyclingRate: 78 },
  { material: "Glass", co2Impact: 1200, energyImpact: 800, recyclingRate: 88 },
  { material: "Electronic", co2Impact: 4200, energyImpact: 3600, recyclingRate: 65 },
]

const certifications = [
  { name: "ISO 14001", status: "Active", validUntil: "2025-12-31", description: "Environmental Management System" },
  { name: "Carbon Neutral", status: "Active", validUntil: "2024-12-31", description: "Net Zero Carbon Emissions" },
  {
    name: "Circular Economy",
    status: "Pending",
    validUntil: "2024-06-30",
    description: "Circular Business Model Certification",
  },
  { name: "B-Corp", status: "Active", validUntil: "2026-03-15", description: "Benefit Corporation Certification" },
]

const sdgGoals = [
  { goal: "SDG 12: Responsible Consumption", progress: 85, target: "Reduce waste by 50%" },
  { goal: "SDG 13: Climate Action", progress: 78, target: "Carbon neutral by 2025" },
  { goal: "SDG 15: Life on Land", progress: 92, target: "Zero landfill waste" },
  { goal: "SDG 17: Partnerships", progress: 88, target: "100+ supplier partnerships" },
]

export function ImpactReporting() {
  const totalCO2Saved = sustainabilityData.reduce((sum, item) => sum + item.co2Saved, 0)
  const totalEnergySaved = sustainabilityData.reduce((sum, item) => sum + item.energySaved, 0)
  const totalWaterSaved = sustainabilityData.reduce((sum, item) => sum + item.waterSaved, 0)
  const totalWasteProcessed = sustainabilityData.reduce((sum, item) => sum + item.wasteProcessed, 0)

  const avgRecyclingRate = impactByMaterial.reduce((sum, item) => sum + item.recyclingRate, 0) / impactByMaterial.length

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Impact Overview</TabsTrigger>
          <TabsTrigger value="environmental">Environmental Metrics</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="reports">Generate Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Emissions Saved</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{(totalCO2Saved / 1000).toFixed(1)}K kg</div>
                <p className="text-xs text-muted-foreground">Equivalent to 2,400 trees planted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Energy Saved</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{(totalEnergySaved / 1000).toFixed(1)}K kWh</div>
                <p className="text-xs text-muted-foreground">Powers 150 homes for a month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Water Conserved</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{(totalWaterSaved / 1000).toFixed(1)}K L</div>
                <p className="text-xs text-muted-foreground">Enough for 800 people daily</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recycling Rate</CardTitle>
                <Recycle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{avgRecyclingRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Above industry average of 75%</p>
              </CardContent>
            </Card>
          </div>

          {/* Impact Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Environmental Impact Trends</CardTitle>
                <CardDescription>Monthly environmental savings and impact metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sustainabilityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="co2Saved" stroke="#4caf50" strokeWidth={2} name="CO₂ Saved (kg)" />
                    <Line
                      type="monotone"
                      dataKey="energySaved"
                      stroke="#2196f3"
                      strokeWidth={2}
                      name="Energy Saved (kWh)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact by Material Type</CardTitle>
                <CardDescription>Environmental impact breakdown by material category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={impactByMaterial}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="material" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="co2Impact" fill="#4caf50" name="CO₂ Impact (kg)" />
                    <Bar dataKey="energyImpact" fill="#2196f3" name="Energy Impact (kWh)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* SDG Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                UN Sustainable Development Goals Progress
              </CardTitle>
              <CardDescription>Track progress towards UN SDG targets and commitments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sdgGoals.map((sdg, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{sdg.goal}</div>
                        <div className="text-sm text-muted-foreground">{sdg.target}</div>
                      </div>
                      <Badge variant={sdg.progress >= 80 ? "default" : "secondary"}>{sdg.progress}%</Badge>
                    </div>
                    <Progress value={sdg.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Environmental Metrics</CardTitle>
              <CardDescription>Comprehensive environmental impact analysis and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={sustainabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="wasteProcessed"
                    stackId="1"
                    stroke="#4caf50"
                    fill="#4caf50"
                    fillOpacity={0.6}
                    name="Waste Processed (kg)"
                  />
                  <Area
                    type="monotone"
                    dataKey="co2Saved"
                    stackId="2"
                    stroke="#2196f3"
                    fill="#2196f3"
                    fillOpacity={0.6}
                    name="CO₂ Saved (kg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Material Recycling Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {impactByMaterial.map((material, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{material.material}</span>
                        <span className="text-sm text-muted-foreground">{material.recyclingRate}%</span>
                      </div>
                      <Progress value={material.recyclingRate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environmental Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Zero Landfill Achievement</div>
                      <div className="text-sm text-muted-foreground">100% waste diverted from landfills</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Carbon Neutral Operations</div>
                      <div className="text-sm text-muted-foreground">Net zero carbon emissions achieved</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Efficiency Leader</div>
                      <div className="text-sm text-muted-foreground">Top 5% in industry efficiency</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Certifications</CardTitle>
              <CardDescription>Track and manage your environmental and sustainability certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{cert.name}</div>
                      <div className="text-sm text-muted-foreground">{cert.description}</div>
                      <div className="text-xs text-muted-foreground">
                        Valid until: {new Date(cert.validUntil).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge
                      variant={
                        cert.status === "Active" ? "default" : cert.status === "Pending" ? "secondary" : "destructive"
                      }
                    >
                      {cert.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Impact Reports</CardTitle>
              <CardDescription>Create comprehensive sustainability and impact reports for stakeholders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Available Report Types</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      Monthly Sustainability Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      Annual Impact Assessment
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      Carbon Footprint Analysis
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      Waste Diversion Report
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Share & Export</h4>
                  <div className="space-y-3">
                    <Button className="w-full">
                      <Share className="mr-2 h-4 w-4" />
                      Share Impact Dashboard
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data (CSV)
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Globe className="mr-2 h-4 w-4" />
                      Public Impact Page
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
