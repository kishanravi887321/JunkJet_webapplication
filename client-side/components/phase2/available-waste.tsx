"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, MapPin, Calendar, Package, Loader2 } from "lucide-react"
import { getAllProducts, Product } from "@/lib/api"

const materialTypes = ["all", "plastic", "paper", "metal", "glass", "electronic", "organic", "textile", "mixed"]

export function AvailableWaste() {
  const [wasteItems, setWasteItems] = useState<Product[]>([])
  const [filteredItems, setFilteredItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [materialFilter, setMaterialFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")

  // Fetch products from API
  useEffect(() => {
    const fetchWasteItems = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await getAllProducts({ limit: 100 })
        
        if (response.success && response.data) {
          setWasteItems(response.data)
        } else {
          throw new Error(response.message || 'Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching waste items:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch waste items')
        setWasteItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchWasteItems()
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

  const handleContactSeller = (item: Product) => {
    // In real app, this would open a contact modal or redirect to messaging
    alert(`Contacting ${item.owner.fullName} about ${item.name}`)
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
                        Location not specified
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
                      <span className="font-medium">{item.owner.fullName}</span>
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
