"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MapPin, 
  Clock, 
  Star, 
  IndianRupee, 
  Package, 
  Leaf, 
  Search, 
  Filter,
  User,
  MessageCircle,
  Phone,
  Mail
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { getUserTransactions } from "@/lib/api"

interface MarketplaceTransaction {
  _id: string
  seller: { fullName: string; email: string; avatar?: string; phone?: string }
  buyer?: { fullName: string; email: string; avatar?: string; phone?: string }
  transactionType: "buy" | "sell"
  materialType: string
  weight: number
  pricePerKg: number
  totalAmount: number
  status: string
  description?: string
  pickupLocation?: {
    address: string
    city: string
    state: string
    pincode: string
  }
  preferredPickupDate?: string
  createdAt: string
  sellerRating?: { rating: number; count: number }
  carbonSaved?: number
  images?: string[]
}

export function TransactionMarketplace() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<MarketplaceTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMaterial, setFilterMaterial] = useState<string>('all')
  const [filterLocation, setFilterLocation] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState<'latest' | 'price_low' | 'price_high' | 'rating'>('latest')

  // Mock data for demonstration - replace with actual API call
  const mockTransactions: MarketplaceTransaction[] = [
    {
      _id: "1",
      seller: { fullName: "Priya Sharma", email: "priya@email.com", avatar: "", phone: "+91-9876543210" },
      transactionType: "sell",
      materialType: "plastic",
      weight: 15,
      pricePerKg: 12,
      totalAmount: 180,
      status: "pending",
      description: "Clean PET bottles and containers. Good quality, sorted and washed.",
      pickupLocation: {
        address: "123 Green Avenue",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001"
      },
      preferredPickupDate: "2024-12-20",
      createdAt: "2024-12-15T10:30:00Z",
      sellerRating: { rating: 4.5, count: 23 },
      carbonSaved: 27,
      images: []
    },
    {
      _id: "2",
      seller: { fullName: "Raj Kumar", email: "raj@email.com", avatar: "", phone: "+91-9876543211" },
      transactionType: "sell",
      materialType: "paper",
      weight: 25,
      pricePerKg: 8,
      totalAmount: 200,
      status: "pending",
      description: "Old newspapers and magazines. Dry and well-maintained.",
      pickupLocation: {
        address: "456 Eco Street",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001"
      },
      preferredPickupDate: "2024-12-18",
      createdAt: "2024-12-14T14:20:00Z",
      sellerRating: { rating: 4.8, count: 15 },
      carbonSaved: 30,
      images: []
    },
    {
      _id: "3",
      seller: { fullName: "Anita Desai", email: "anita@email.com", avatar: "", phone: "+91-9876543212" },
      transactionType: "sell",
      materialType: "metal",
      weight: 10,
      pricePerKg: 35,
      totalAmount: 350,
      status: "pending",
      description: "Aluminum cans and small metal items. Mixed metals.",
      pickupLocation: {
        address: "789 Recycle Road",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001"
      },
      preferredPickupDate: "2024-12-22",
      createdAt: "2024-12-13T09:15:00Z",
      sellerRating: { rating: 4.2, count: 31 },
      carbonSaved: 25,
      images: []
    }
  ]

  useEffect(() => {
    fetchMarketplaceTransactions()
  }, [searchTerm, filterMaterial, filterLocation, priceRange, sortBy])

  const fetchMarketplaceTransactions = async () => {
    setLoading(true)
    try {
      // For demo purposes, using mock data
      // In real implementation, make API call to get marketplace transactions
      let filtered = [...mockTransactions]

      // Apply filters
      if (searchTerm) {
        filtered = filtered.filter(t => 
          t.materialType.includes(searchTerm.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.pickupLocation?.city.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (filterMaterial !== 'all') {
        filtered = filtered.filter(t => t.materialType === filterMaterial)
      }

      if (filterLocation) {
        filtered = filtered.filter(t => 
          t.pickupLocation?.city.toLowerCase().includes(filterLocation.toLowerCase()) ||
          t.pickupLocation?.state.toLowerCase().includes(filterLocation.toLowerCase())
        )
      }

      if (priceRange.min) {
        filtered = filtered.filter(t => t.pricePerKg >= parseFloat(priceRange.min))
      }

      if (priceRange.max) {
        filtered = filtered.filter(t => t.pricePerKg <= parseFloat(priceRange.max))
      }

      // Apply sorting
      switch (sortBy) {
        case 'price_low':
          filtered.sort((a, b) => a.pricePerKg - b.pricePerKg)
          break
        case 'price_high':
          filtered.sort((a, b) => b.pricePerKg - a.pricePerKg)
          break
        case 'rating':
          filtered.sort((a, b) => (b.sellerRating?.rating || 0) - (a.sellerRating?.rating || 0))
          break
        default:
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      setTransactions(filtered)
    } catch (error) {
      console.error('Error fetching marketplace transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContactSeller = (transaction: MarketplaceTransaction) => {
    // In real implementation, this could open a chat or contact form
    window.open(`mailto:${transaction.seller.email}?subject=Interest in ${transaction.materialType} - ${transaction.weight}kg`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reserved': return 'bg-blue-100 text-blue-800'
      case 'sold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Waste Materials Marketplace</h2>
        <p className="text-muted-foreground">
          Discover and purchase recyclable materials from households in your area
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search materials, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Material Type</Label>
              <Select value={filterMaterial} onValueChange={setFilterMaterial}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Materials</SelectItem>
                  <SelectItem value="plastic">Plastic</SelectItem>
                  <SelectItem value="paper">Paper</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="textile">Textile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              />
            </div>

            <div>
              <Label>Price Range (₹/kg)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marketplace Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transactions.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No materials found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          transactions.map((transaction) => (
            <Card key={transaction._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={transaction.seller.avatar} />
                      <AvatarFallback>
                        {transaction.seller.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{transaction.seller.fullName}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-muted-foreground">
                          {transaction.sellerRating?.rating.toFixed(1)} ({transaction.sellerRating?.count})
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>

                {/* Material Details */}
                <div className="space-y-3 mb-4">
                  <h3 className="text-lg font-semibold capitalize">
                    {transaction.materialType}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Weight</p>
                      <p className="font-medium">{transaction.weight}kg</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price/kg</p>
                      <p className="font-medium">₹{transaction.pricePerKg}</p>
                    </div>
                  </div>

                  <div className="text-center py-2 border rounded-lg bg-green-50">
                    <p className="text-lg font-bold text-green-600">
                      ₹{transaction.totalAmount}
                    </p>
                    <p className="text-xs text-green-700">Total Value</p>
                  </div>
                </div>

                {/* Description */}
                {transaction.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {transaction.description}
                  </p>
                )}

                {/* Location & Date */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{transaction.pickupLocation?.city}, {transaction.pickupLocation?.state}</span>
                  </div>
                  
                  {transaction.preferredPickupDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Pickup: {new Date(transaction.preferredPickupDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Leaf className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">{transaction.carbonSaved}kg CO₂ saved</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => handleContactSeller(transaction)}
                    disabled={transaction.seller.email === user?.email}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${transaction.seller.phone}`}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${transaction.seller.email}`}>
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Posted Time */}
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Posted {new Date(transaction.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {transactions.length > 0 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Materials
          </Button>
        </div>
      )}
    </div>
  )
}
