"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Package, 
  Star, 
  MessageCircle,
  ExternalLink,
  Filter,
  Users,
  Target,
  Loader2
} from "lucide-react"
import { useAuth } from "@/lib/auth"

interface UserProfile {
  _id: string
  fullName: string
  email: string
  userName: string
  avatar?: string
  phone?: string
  isPhase1User: boolean
  isPhase2User: boolean
  isPhase3User: boolean
  location?: {
    city: string
    state: string
    pincode: string
    country: string
  }
  rating?: {
    average: number
    count: number
  }
  recentTransactions?: number
  preferredMaterials?: string[]
  distance?: number
}

const materialTypes = ["plastic", "paper", "metal", "glass", "electronic", "organic", "textile", "mixed"]
const rangeOptions = [
  { label: "1-5 km", value: 5 },
  { label: "5-10 km", value: 10 },
  { label: "10-20 km", value: 20 },
  { label: "20-30 km", value: 30 },
  { label: "30-50 km", value: 50 }
]

export function FindUsers() {
  const { user } = useAuth()
  const [searchType, setSearchType] = useState<"buyers" | "sellers">("buyers")
  const [materialType, setMaterialType] = useState("")
  const [location, setLocation] = useState("")
  const [rangeKm, setRangeKm] = useState<number>(10)
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)

  // Mock users data - replace with actual API call
  const mockUsers: UserProfile[] = [
    {
      _id: "1",
      fullName: "Priya Sharma",
      email: "priya.sharma@email.com",
      userName: "priya_eco",
      avatar: "",
      phone: "+91-9876543210",
      isPhase1User: true,
      isPhase2User: false,
      isPhase3User: false,
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India"
      },
      rating: { average: 4.5, count: 23 },
      recentTransactions: 15,
      preferredMaterials: ["plastic", "paper"],
      distance: 2.5
    },
    {
      _id: "2",
      fullName: "Green Earth Recycling",
      email: "contact@greenearth.com",
      userName: "green_earth",
      avatar: "",
      phone: "+91-9876543211",
      isPhase1User: false,
      isPhase2User: true,
      isPhase3User: false,
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400002",
        country: "India"
      },
      rating: { average: 4.8, count: 156 },
      recentTransactions: 89,
      preferredMaterials: ["metal", "electronic", "glass"],
      distance: 4.1
    },
    {
      _id: "3",
      fullName: "Raj Kumar",
      email: "raj.kumar@email.com",
      userName: "raj_waste",
      avatar: "",
      phone: "+91-9876543212",
      isPhase1User: true,
      isPhase2User: false,
      isPhase3User: false,
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400003",
        country: "India"
      },
      rating: { average: 4.2, count: 31 },
      recentTransactions: 8,
      preferredMaterials: ["paper", "textile"],
      distance: 7.8
    }
  ]

  const handleSearch = async () => {
    if (!materialType && !location) {
      setError("Please select material type or enter location")
      return
    }

    setLoading(true)
    setError("")
    setUsers([])

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Apply heuristic filtering
      let filteredUsers = [...mockUsers]

      // Filter by user type (buyers vs sellers)
      if (searchType === "buyers") {
        filteredUsers = filteredUsers.filter(u => u.isPhase2User || u.isPhase3User)
      } else {
        filteredUsers = filteredUsers.filter(u => u.isPhase1User)
      }

      // Filter by material preference
      if (materialType) {
        filteredUsers = filteredUsers.filter(u => 
          u.preferredMaterials?.includes(materialType)
        )
      }

      // Filter by location
      if (location) {
        filteredUsers = filteredUsers.filter(u => 
          u.location?.city.toLowerCase().includes(location.toLowerCase()) ||
          u.location?.state.toLowerCase().includes(location.toLowerCase()) ||
          u.location?.pincode.includes(location)
        )
      }

      // Filter by range
      filteredUsers = filteredUsers.filter(u => (u.distance || 0) <= rangeKm)

      // Sort by heuristic score (rating × recent transactions ÷ distance)
      filteredUsers.sort((a, b) => {
        const scoreA = ((a.rating?.average || 0) * (a.recentTransactions || 1)) / Math.max(a.distance || 1, 0.1)
        const scoreB = ((b.rating?.average || 0) * (b.recentTransactions || 1)) / Math.max(b.distance || 1, 0.1)
        return scoreB - scoreA
      })

      setUsers(filteredUsers)
      setSearched(true)
      
    } catch (error: any) {
      setError(error.message || "Failed to search users")
    } finally {
      setLoading(false)
    }
  }

  const handleContactUser = (user: UserProfile) => {
    // Open email client
    window.open(`mailto:${user.email}?subject=Interest in Waste Transaction&body=Hi ${user.fullName}, I found you through JunkJet and would like to discuss a potential transaction.`)
  }

  const getUserTypeLabel = (user: UserProfile) => {
    if (user.isPhase3User) return "Waste Management Company"
    if (user.isPhase2User) return "Organization Buyer"
    if (user.isPhase1User) return "Household Seller"
    return "User"
  }

  const getUserTypeBadge = (user: UserProfile) => {
    if (user.isPhase3User) return "bg-purple-100 text-purple-800"
    if (user.isPhase2User) return "bg-blue-100 text-blue-800"
    if (user.isPhase1User) return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Find Users
        </CardTitle>
        <CardDescription>
          Discover buyers and sellers in your area using our smart matching algorithm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Looking for</Label>
              <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyers">Buyers</SelectItem>
                  <SelectItem value="sellers">Sellers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Material Type</Label>
              <Select value={materialType} onValueChange={setMaterialType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="City, State, or Pincode"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Search Range</Label>
              <Select value={rangeKm.toString()} onValueChange={(value) => setRangeKm(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Find Users
              </>
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search Results */}
        {searched && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {users.length > 0 ? `Found ${users.length} ${searchType}` : `No ${searchType} found`}
              </h3>
              {users.length > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <Target className="h-3 w-3 mr-1" />
                  Sorted by match score
                </Badge>
              )}
            </div>

            {users.length === 0 && searched && !loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No users found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or expanding the search range
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {users.map((foundUser, index) => (
                  <Card key={foundUser._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={foundUser.avatar} />
                            <AvatarFallback>
                              {foundUser.fullName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{foundUser.fullName}</h4>
                              <Badge className={getUserTypeBadge(foundUser)}>
                                {getUserTypeLabel(foundUser)}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">@{foundUser.userName}</p>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{foundUser.location?.city}, {foundUser.location?.state}</span>
                                <span className="text-muted-foreground">({foundUser.distance}km)</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span>{foundUser.rating?.average.toFixed(1)} ({foundUser.rating?.count})</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                <span>{foundUser.recentTransactions} transactions</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mt-2">
                              {foundUser.preferredMaterials?.map((material) => (
                                <Badge key={material} variant="outline" className="text-xs">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <User className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{foundUser.fullName}</DialogTitle>
                                <DialogDescription>
                                  {getUserTypeLabel(foundUser)} • {foundUser.location?.city}, {foundUser.location?.state}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src={foundUser.avatar} />
                                    <AvatarFallback>
                                      {foundUser.fullName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold">{foundUser.fullName}</h3>
                                    <p className="text-sm text-muted-foreground">@{foundUser.userName}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                      <span className="text-sm">{foundUser.rating?.average.toFixed(1)} ({foundUser.rating?.count} reviews)</span>
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <Label>Location</Label>
                                    <p>{foundUser.location?.city}, {foundUser.location?.state}</p>
                                    <p className="text-muted-foreground">{foundUser.location?.pincode}</p>
                                  </div>
                                  <div>
                                    <Label>Distance</Label>
                                    <p>{foundUser.distance}km away</p>
                                  </div>
                                  <div>
                                    <Label>Recent Transactions</Label>
                                    <p>{foundUser.recentTransactions} completed</p>
                                  </div>
                                  <div>
                                    <Label>User Type</Label>
                                    <p>{getUserTypeLabel(foundUser)}</p>
                                  </div>
                                </div>

                                <div>
                                  <Label>Preferred Materials</Label>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {foundUser.preferredMaterials?.map((material) => (
                                      <Badge key={material} variant="outline">
                                        {material}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button className="flex-1" onClick={() => handleContactUser(foundUser)}>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Contact via Email
                                  </Button>
                                  {foundUser.phone && (
                                    <Button variant="outline" asChild>
                                      <a href={`tel:${foundUser.phone}`}>
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button size="sm" onClick={() => handleContactUser(foundUser)}>
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-800 mb-2">How our smart matching works</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Users are ranked by compatibility score (rating × activity ÷ distance)</li>
              <li>• Material preferences are matched with your requirements</li>
              <li>• Location proximity and user type are considered</li>
              <li>• Recent activity indicates user engagement</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
