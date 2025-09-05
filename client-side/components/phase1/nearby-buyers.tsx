"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, MapPin, Phone, ExternalLink } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface Buyer {
  orgName: string
  materialType: string
  distanceKm: number
  contact: string
  locationUrl: string
  hexId: string
}

const materialTypes = ["plastic", "paper", "metal", "glass", "electronic", "organic", "textile", "mixed"]

const rangeOptions = ["1-5 km", "5-10 km", "10-20 km", "20-30 km", "30-50 km"]

export function NearbyBuyers() {
  const { user } = useAuth()
  const [materialType, setMaterialType] = useState("")
  const [rangeKm, setRangeKm] = useState("")
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!user || !materialType || !rangeKm) return

    setLoading(true)
    setError("")
    setBuyers([])

    try {
      const response = await fetch("http://localhost:8000/location/finduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          materialType,
          rangeKm,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setBuyers(data.matches || [])
        setSearched(true)
      } else {
        setError(data.message || "No buyers found in the specified range")
        setBuyers([])
        setSearched(true)
      }
    } catch (error) {
      setError("Network error. Please try again.")
      setBuyers([])
      setSearched(true)
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Find Nearby Buyers
        </CardTitle>
        <CardDescription>Discover waste buyers in your area who are interested in your materials.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="materialType">Material Type</Label>
            <Select onValueChange={setMaterialType} value={materialType}>
              <SelectTrigger>
                <SelectValue placeholder="Select material type" />
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

          <div className="space-y-2">
            <Label htmlFor="range">Search Range</Label>
            <Select onValueChange={setRangeKm} value={rangeKm}>
              <SelectTrigger>
                <SelectValue placeholder="Select search range" />
              </SelectTrigger>
              <SelectContent>
                {rangeOptions.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleSearch} className="w-full" disabled={loading || !materialType || !rangeKm}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Find Buyers
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {searched && buyers.length === 0 && !error && (
          <Alert>
            <AlertDescription>
              No buyers found for {materialType} within {rangeKm}. Try expanding your search range or check back later.
            </AlertDescription>
          </Alert>
        )}

        {buyers.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Found {buyers.length} buyer(s)</h3>
            <div className="grid gap-4">
              {buyers.map((buyer, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-lg">{buyer.orgName}</h4>
                          <Badge variant="secondary">{buyer.materialType}</Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{buyer.distanceKm.toFixed(1)} km away</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <span>{buyer.contact}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={buyer.locationUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Location
                          </a>
                        </Button>
                        <Button size="sm" asChild>
                          <a href={`tel:${buyer.contact}`}>
                            <Phone className="mr-2 h-4 w-4" />
                            Contact
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
