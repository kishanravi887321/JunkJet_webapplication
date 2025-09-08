"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Package, MapPin, Calendar, Filter } from "lucide-react"

interface WasteItem {
  _id: string
  name: string
  tag: string
  productId: string
  quantity: string
  materialType: string
  description: string
  price: string
  productImage?: string
  createdAt: string
  user: {
    fullName: string
    location?: string
  }
}

const materialTypes = ["all", "plastic", "paper", "metal", "glass", "electronic", "organic", "textile", "mixed"]

export function AvailableWaste() {
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([])
  const [filteredItems, setFilteredItems] = useState<WasteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [materialFilter, setMaterialFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockWasteItems: WasteItem[] = [
      {
        _id: "1",
        name: "Plastic Bottles",
        tag: "clean, recyclable",
        productId: "WASTE-1234567890-123",
        quantity: "50 pieces",
        materialType: "plastic",
        description: "Clean plastic water bottles, various sizes. Good condition for recycling.",
        price: "₹2,085",
        productImage: "/pile-of-plastic-bottles.png",
        createdAt: "2024-01-15T10:30:00Z",
        user: {
          fullName: "John Smith",
          location: "Downtown Area",
        },
      },
      {
        _id: "2",
        name: "Cardboard Boxes",
        tag: "flat-packed, dry",
        productId: "WASTE-1234567891-124",
        quantity: "20 kg",
        materialType: "paper",
        description: "Various sized cardboard boxes, flattened and dry. Perfect for recycling.",
        price: "₹1,251",
        createdAt: "2024-01-14T14:20:00Z",
        user: {
          fullName: "Sarah Johnson",
          location: "Residential District",
        },
      },
      {
        _id: "3",
        name: "Aluminum Cans",
        tag: "clean, sorted",
        productId: "WASTE-1234567892-125",
        quantity: "100 cans",
        materialType: "metal",
        description: "Clean aluminum beverage cans, sorted and ready for processing.",
        price: "₹3,336",
        productImage: "/aluminum-cans.jpg",
        createdAt: "2024-01-13T09:15:00Z",
        user: {
          fullName: "Mike Davis",
          location: "Industrial Zone",
        },
      },
      {
        _id: "4",
        name: "Glass Bottles",
        tag: "mixed colors, clean",
        productId: "WASTE-1234567893-126",
        quantity: "30 bottles",
        materialType: "glass",
        description: "Mixed color glass bottles, cleaned and sorted by color.",
        price: "₹1,668",
        createdAt: "2024-01-12T16:45:00Z",
        user: {
          fullName: "Emily Chen",
          location: "City Center",
        },
      },
      {
        _id: "5",
        name: "Old Electronics",
        tag: "working condition",
        productId: "WASTE-1234567894-127",
        quantity: "5 devices",
        materialType: "electronic",
        description: "Old smartphones and tablets in working condition. Good for refurbishment.",
        price: "₹6,672",
        productImage: "/old-electronics.jpg",
        createdAt: "2024-01-11T11:30:00Z",
        user: {
          fullName: "David Wilson",
          location: "Tech District",
        },
      },
    ]

    setTimeout(() => {
      setWasteItems(mockWasteItems)
      setFilteredItems(mockWasteItems)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = wasteItems

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tag.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by material type
    if (materialFilter !== "all") {
      filtered = filtered.filter((item) => item.materialType === materialFilter)
    }

    // Filter by price range
    if (priceFilter !== "all") {
      filtered = filtered.filter((item) => {
        const price = Number.parseInt(item.price.replace(/[^0-9]/g, ""))
        switch (priceFilter) {
          case "low":
            return price < 30
          case "medium":
            return price >= 30 && price <= 60
          case "high":
            return price > 60
          default:
            return true
        }
      })
    }

    setFilteredItems(filtered)
  }, [wasteItems, searchTerm, materialFilter, priceFilter])

  const handleContactSeller = (item: WasteItem) => {
    // In real app, this would open a contact modal or redirect to messaging
    alert(`Contacting ${item.user.fullName} about ${item.name}`)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="text-lg font-medium">Loading available waste items...</div>
            <div className="text-sm text-muted-foreground">Fetching latest inventory from households</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filter Available Waste
          </CardTitle>
          <CardDescription>Find waste items that match your processing capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Items</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material Type</Label>
              <Select value={materialFilter} onValueChange={setMaterialFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All materials" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Materials" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price Range</Label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Under ₹2,500</SelectItem>
                  <SelectItem value="medium">₹2,500 - ₹5,000</SelectItem>
                  <SelectItem value="high">Over ₹5,000</SelectItem>
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
                  setPriceFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Available Waste Items ({filteredItems.length})</h3>
          <Badge variant="secondary">
            {filteredItems.length} of {wasteItems.length} items
          </Badge>
        </div>

        {filteredItems.length === 0 ? (
          <Alert>
            <Package className="h-4 w-4" />
            <AlertDescription>
              No waste items match your current filters. Try adjusting your search criteria or check back later for new
              listings.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {item.user.location || "Location not specified"}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{item.materialType}</Badge>
                  </div>
                </CardHeader>

                {item.productImage && (
                  <div className="px-6 pb-3">
                    <img
                      src={item.productImage || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{item.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium text-primary">{item.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Listed by:</span>
                      <span className="font-medium">{item.user.fullName}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Tags: </span>
                      <span className="text-primary">{item.tag}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                    <Button size="sm" onClick={() => handleContactSeller(item)}>
                      Contact Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
