"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Filter, Package, Calendar, MapPin, Star, Phone, Mail, ExternalLink } from "lucide-react"

interface ProcurementOpportunity {
  id: string
  supplierName: string
  materialType: string
  quantity: number
  unit: string
  pricePerUnit: number
  totalPrice: number
  quality: "Premium" | "Standard" | "Basic"
  location: string
  distance: number
  availableDate: string
  description: string
  supplierRating: number
  certifications: string[]
  contact: {
    phone: string
    email: string
  }
}

interface ActiveContract {
  id: string
  supplierName: string
  materialType: string
  contractValue: number
  deliverySchedule: string
  status: "Active" | "Pending" | "Completed" | "Delayed"
  progress: number
  nextDelivery: string
}

const procurementOpportunities: ProcurementOpportunity[] = [
  {
    id: "1",
    supplierName: "EcoWaste Solutions",
    materialType: "plastic",
    quantity: 5000,
    unit: "kg",
    pricePerUnit: 2.5,
    totalPrice: 12500,
    quality: "Premium",
    location: "Industrial District A",
    distance: 15,
    availableDate: "2024-01-20",
    description: "High-quality sorted plastic waste, ready for processing. Includes PET bottles and containers.",
    supplierRating: 4.9,
    certifications: ["ISO 14001", "Waste Management License"],
    contact: {
      phone: "+1-555-0123",
      email: "procurement@ecowaste.com",
    },
  },
  {
    id: "2",
    supplierName: "Green Recyclers",
    materialType: "paper",
    quantity: 3000,
    unit: "kg",
    pricePerUnit: 1.8,
    totalPrice: 5400,
    quality: "Standard",
    location: "Commercial Zone B",
    distance: 22,
    availableDate: "2024-01-18",
    description: "Mixed paper waste including cardboard and office paper. Well-sorted and dry.",
    supplierRating: 4.7,
    certifications: ["Environmental Compliance", "Quality Assurance"],
    contact: {
      phone: "+1-555-0124",
      email: "sales@greenrecyclers.com",
    },
  },
  {
    id: "3",
    supplierName: "Metal Masters",
    materialType: "metal",
    quantity: 2000,
    unit: "kg",
    pricePerUnit: 4.2,
    totalPrice: 8400,
    quality: "Premium",
    location: "Industrial Park C",
    distance: 8,
    availableDate: "2024-01-22",
    description: "Aluminum and steel scrap, sorted by type. High purity levels suitable for direct processing.",
    supplierRating: 4.8,
    certifications: ["Metal Purity Certificate", "Safety Standards"],
    contact: {
      phone: "+1-555-0125",
      email: "orders@metalmasters.com",
    },
  },
]

const activeContracts: ActiveContract[] = [
  {
    id: "C001",
    supplierName: "EcoWaste Solutions",
    materialType: "plastic",
    contractValue: 50000,
    deliverySchedule: "Weekly",
    status: "Active",
    progress: 75,
    nextDelivery: "2024-01-16",
  },
  {
    id: "C002",
    supplierName: "Urban Waste Co",
    materialType: "glass",
    contractValue: 25000,
    deliverySchedule: "Bi-weekly",
    status: "Delayed",
    progress: 45,
    nextDelivery: "2024-01-19",
  },
  {
    id: "C003",
    supplierName: "Clean Earth Ltd",
    materialType: "electronic",
    contractValue: 75000,
    deliverySchedule: "Monthly",
    status: "Pending",
    progress: 0,
    nextDelivery: "2024-01-25",
  },
]

export function ProcurementDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [materialFilter, setMaterialFilter] = useState("all")
  const [qualityFilter, setQualityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("price")

  const filteredOpportunities = procurementOpportunities
    .filter((opp) => {
      const matchesSearch =
        opp.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMaterial = materialFilter === "all" || opp.materialType === materialFilter
      const matchesQuality = qualityFilter === "all" || opp.quality === qualityFilter
      return matchesSearch && matchesMaterial && matchesQuality
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.pricePerUnit - b.pricePerUnit
        case "quantity":
          return b.quantity - a.quantity
        case "rating":
          return b.supplierRating - a.supplierRating
        case "distance":
          return a.distance - b.distance
        default:
          return 0
      }
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Pending":
        return "bg-yellow-500"
      case "Delayed":
        return "bg-red-500"
      case "Completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleCreateContract = (opportunity: ProcurementOpportunity) => {
    alert(
      `Creating contract with ${opportunity.supplierName} for ${opportunity.quantity} ${opportunity.unit} of ${opportunity.materialType}`,
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Procurement Opportunities</TabsTrigger>
          <TabsTrigger value="contracts">Active Contracts</TabsTrigger>
          <TabsTrigger value="analytics">Procurement Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Filter Opportunities
              </CardTitle>
              <CardDescription>Find the best waste procurement opportunities for your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search suppliers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Material Type</Label>
                  <Select value={materialFilter} onValueChange={setMaterialFilter}>
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <Label>Quality</Label>
                  <Select value={qualityFilter} onValueChange={setQualityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All qualities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Qualities</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price (Low to High)</SelectItem>
                      <SelectItem value="quantity">Quantity (High to Low)</SelectItem>
                      <SelectItem value="rating">Rating (High to Low)</SelectItem>
                      <SelectItem value="distance">Distance (Near to Far)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setSearchTerm("")
                      setMaterialFilter("all")
                      setQualityFilter("all")
                      setSortBy("price")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opportunities List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Available Opportunities ({filteredOpportunities.length})</h3>
            </div>

            {filteredOpportunities.length === 0 ? (
              <Alert>
                <Package className="h-4 w-4" />
                <AlertDescription>
                  No procurement opportunities match your current filters. Try adjusting your search criteria.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-6">
                {filteredOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xl font-semibold">{opportunity.supplierName}</h4>
                              <Badge variant="outline">{opportunity.materialType}</Badge>
                              <Badge variant={opportunity.quality === "Premium" ? "default" : "secondary"}>
                                {opportunity.quality}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  {opportunity.location} ({opportunity.distance} km)
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{opportunity.supplierRating}/5.0</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Available: {new Date(opportunity.availableDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              ₹{opportunity.totalPrice.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ₹{opportunity.pricePerUnit}/{opportunity.unit}
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Quantity: </span>
                              <span>
                                {opportunity.quantity.toLocaleString()} {opportunity.unit}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Certifications: </span>
                              <span>{opportunity.certifications.join(", ")}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Contact: </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4" />
                              <span>{opportunity.contact.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4" />
                              <span>{opportunity.contact.email}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t">
                          <Button onClick={() => handleCreateContract(opportunity)}>Create Contract</Button>
                          <Button variant="outline">
                            <Phone className="mr-2 h-4 w-4" />
                            Contact Supplier
                          </Button>
                          <Button variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Active Contracts ({activeContracts.length})</h3>

            <div className="grid gap-4">
              {activeContracts.map((contract) => (
                <Card key={contract.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{contract.supplierName}</h4>
                          <Badge variant="outline">{contract.materialType}</Badge>
                          <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Contract Value: </span>
                            <span className="font-medium">₹{contract.contractValue.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Schedule: </span>
                            <span className="font-medium">{contract.deliverySchedule}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Progress: </span>
                            <span className="font-medium">{contract.progress}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Next Delivery: </span>
                            <span className="font-medium">{new Date(contract.nextDelivery).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Contract
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Procurement Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">₹12.5L</div>
                <p className="text-sm text-muted-foreground">Active contracts this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Supplier Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">4.8</div>
                <p className="text-sm text-muted-foreground">Out of 5.0 stars</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">15%</div>
                <p className="text-sm text-muted-foreground">Savings vs market rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
