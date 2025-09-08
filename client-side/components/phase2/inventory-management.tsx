"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, TrendingUp, Plus, Edit, Trash2 } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  materialType: string
  quantity: number
  unit: string
  processedQuantity: number
  status: "raw" | "processing" | "processed" | "sold"
  purchasePrice: number
  expectedSalePrice: number
  location: string
  lastUpdated: string
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Plastic Bottles Collection",
      materialType: "plastic",
      quantity: 500,
      unit: "pieces",
      processedQuantity: 350,
      status: "processing",
      purchasePrice: 125,
      expectedSalePrice: 200,
      location: "Warehouse A",
      lastUpdated: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Cardboard Batch #1",
      materialType: "paper",
      quantity: 200,
      unit: "kg",
      processedQuantity: 200,
      status: "processed",
      purchasePrice: 300,
      expectedSalePrice: 450,
      location: "Processing Unit B",
      lastUpdated: "2024-01-14T14:20:00Z",
    },
    {
      id: "3",
      name: "Aluminum Cans Lot",
      materialType: "metal",
      quantity: 1000,
      unit: "cans",
      processedQuantity: 0,
      status: "raw",
      purchasePrice: 400,
      expectedSalePrice: 600,
      location: "Storage C",
      lastUpdated: "2024-01-13T09:15:00Z",
    },
    {
      id: "4",
      name: "Glass Bottles Mixed",
      materialType: "glass",
      quantity: 150,
      unit: "bottles",
      processedQuantity: 150,
      status: "sold",
      purchasePrice: 180,
      expectedSalePrice: 270,
      location: "Sold",
      lastUpdated: "2024-01-12T16:45:00Z",
    },
  ])

  const [selectedMaterial, setSelectedMaterial] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "raw":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      case "processed":
        return "bg-green-500"
      case "sold":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "raw":
        return "Raw Material"
      case "processing":
        return "Processing"
      case "processed":
        return "Ready to Sell"
      case "sold":
        return "Sold"
      default:
        return status
    }
  }

  const filteredInventory =
    selectedMaterial === "all" ? inventory : inventory.filter((item) => item.materialType === selectedMaterial)

  const totalValue = inventory.reduce((sum, item) => sum + item.expectedSalePrice, 0)
  const totalInvestment = inventory.reduce((sum, item) => sum + item.purchasePrice, 0)
  const potentialProfit = totalValue - totalInvestment

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{totalInvestment}</div>
            <p className="text-xs text-muted-foreground">Money invested in materials</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{totalValue}</div>
            <p className="text-xs text-muted-foreground">Potential sale value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{potentialProfit}</div>
            <p className="text-xs text-muted-foreground">
              {((potentialProfit / totalInvestment) * 100).toFixed(1)}% margin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Inventory */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Inventory Management
              </CardTitle>
              <CardDescription>Track and manage your waste material inventory from purchase to sale</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="ready">Ready to Sell</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="material-filter">Filter by Material:</Label>
                <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All materials" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Materials</SelectItem>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="paper">Paper</SelectItem>
                    <SelectItem value="metal">Metal</SelectItem>
                    <SelectItem value="glass">Glass</SelectItem>
                    <SelectItem value="electronic">Electronic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredInventory.map((item) => (
                  <Card
                    key={item.id}
                    className="border-l-4"
                    style={{ borderLeftColor: getStatusColor(item.status).replace("bg-", "#") }}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">{item.name}</h4>
                            <Badge variant="outline">{item.materialType}</Badge>
                            <Badge className={getStatusColor(item.status)}>{getStatusText(item.status)}</Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Quantity: </span>
                              <span className="font-medium">
                                {item.quantity} {item.unit}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Location: </span>
                              <span className="font-medium">{item.location}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Purchase: </span>
                              <span className="font-medium">₹{item.purchasePrice}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Expected Sale: </span>
                              <span className="font-medium text-primary">₹{item.expectedSalePrice}</span>
                            </div>
                          </div>

                          {item.status === "processing" && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Processing Progress</span>
                                <span>{Math.round((item.processedQuantity / item.quantity) * 100)}%</span>
                              </div>
                              <Progress value={(item.processedQuantity / item.quantity) * 100} className="h-2" />
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="processing">
              <div className="space-y-4">
                {inventory
                  .filter((item) => item.status === "processing")
                  .map((item) => (
                    <Card key={item.id}>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{item.name}</h4>
                            <Badge variant="outline">Processing</Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>
                                Progress: {item.processedQuantity} / {item.quantity} {item.unit}
                              </span>
                              <span>{Math.round((item.processedQuantity / item.quantity) * 100)}%</span>
                            </div>
                            <Progress value={(item.processedQuantity / item.quantity) * 100} />
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm">Update Progress</Button>
                            <Button variant="outline" size="sm">
                              Mark as Complete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="ready">
              <div className="space-y-4">
                {inventory
                  .filter((item) => item.status === "processed")
                  .map((item) => (
                    <Card key={item.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} {item.unit} • Expected: ₹{item.expectedSalePrice}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm">List for Sale</Button>
                            <Button variant="outline" size="sm">
                              Contact Buyers
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Material Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["plastic", "paper", "metal", "glass"].map((material) => {
                        const count = inventory.filter((item) => item.materialType === material).length
                        const percentage = (count / inventory.length) * 100
                        return (
                          <div key={material} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{material}</span>
                              <span>
                                {count} items ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["raw", "processing", "processed", "sold"].map((status) => {
                        const count = inventory.filter((item) => item.status === status).length
                        const percentage = (count / inventory.length) * 100
                        return (
                          <div key={status} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{getStatusText(status)}</span>
                              <span>
                                {count} items ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
