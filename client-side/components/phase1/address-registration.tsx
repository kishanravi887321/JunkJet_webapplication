"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MapPin, Phone, Home, ExternalLink } from "lucide-react"
import { useRegisterPhase1User } from "@/hooks/useApi"

interface AddressData {
  phoneNumber: string
  houseName: string
  country: string
  pincode: string
  landmark: string
  state: string
  city: string
  latitude: number
  longitude: number
  email: string
  locationUrl: string
}

interface AddressRegistrationProps {
  onSuccess: () => void
  isUpdate?: boolean
}

export function AddressRegistration({ onSuccess, isUpdate = false }: AddressRegistrationProps) {
  const { execute: registerPhase1User, loading, error: apiError } = useRegisterPhase1User()
  const [formData, setFormData] = useState<AddressData>({
    phoneNumber: "",
    houseName: "",
    country: "",
    pincode: "",
    landmark: "",
    state: "",
    city: "",
    latitude: 0,
    longitude: 0,
    email: "", // will be set from localStorage
    locationUrl: "",
  })
  const [gettingLocation, setGettingLocation] = useState(false)
  const [error, setError] = useState("")

  // Generate Google Maps URL from coordinates
  const generateMapUrl = (lat: number, lng: number): string => {
    if (!lat || !lng || lat === 0 || lng === 0) return ""
    return `https://www.google.com/maps?q=${lat},${lng}`
  }

  // Update location URL whenever coordinates change
  useEffect(() => {
    const newUrl = generateMapUrl(formData.latitude, formData.longitude)
    if (newUrl !== formData.locationUrl) {
      setFormData(prev => ({
        ...prev,
        locationUrl: newUrl
      }))
    }
  }, [formData.latitude, formData.longitude])

  // ✅ Load userData from localStorage and set email
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("userData")
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        if (parsed.email) {
          setFormData((prev) => ({
            ...prev,
            email: parsed.email,
          }))
        }
      }
    } catch (err) {
      console.error("Failed to parse userData from localStorage:", err)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const getCurrentLocation = () => {
    setGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }))
          setGettingLocation(false)
        },
        () => {
          setError("Unable to get your location. Please enter coordinates manually.")
          setGettingLocation(false)
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
      setGettingLocation(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email) {
      setError("User email not found. Please log in again.")
      return
    }

    setError("")
    console.log("Submitting Phase1 registration with data:", formData)

    try {
      const result = await registerPhase1User(formData)
      console.log("Phase1 registration successful:", result)
      onSuccess()
    } catch (error: any) {
      console.error("Phase1 registration failed:", error)
      setError(error.message || "Registration failed")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          {isUpdate ? "Update Your Address" : "Register Your Address"}
        </CardTitle>
        <CardDescription>
          {isUpdate 
            ? "Update your location details to ensure accurate buyer connections."
            : "Help us connect you with nearby waste buyers by providing your location details."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || apiError) && (
            <Alert variant="destructive">
              <AlertDescription>{error || apiError}</AlertDescription>
            </Alert>
          )}

          {/* Phone + House */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="houseName">House Name/Number</Label>
              <Input
                id="houseName"
                name="houseName"
                type="text"
                placeholder="House name or number"
                value={formData.houseName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* City + State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                name="state"
                type="text"
                placeholder="Enter state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Country + Pincode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                name="country"
                type="text"
                placeholder="Enter country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                name="pincode"
                type="text"
                placeholder="Enter pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Landmark */}
          <div className="space-y-2">
            <Label htmlFor="landmark">Landmark *</Label>
            <Input
              id="landmark"
              name="landmark"
              type="text"
              placeholder="Nearby landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Coordinates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Location Coordinates</Label>
              <Button type="button" variant="outline" size="sm" onClick={getCurrentLocation} disabled={gettingLocation}>
                {gettingLocation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Get Current Location
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={formData.latitude || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      latitude: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={formData.longitude || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      longitude: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>
            </div>

            {/* Location URL */}
            <div className="space-y-2">
              <Label htmlFor="locationUrl">Location URL *</Label>
              <div className="relative">
               
                <Input
                  id="locationUrl"
                  name="locationUrl"
                  type="url"
                  placeholder="Google Maps or location URL"
                  value={formData.locationUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      locationUrl: e.target.value,
                    }))
                  }
                  className="pl-10 pr-12"
                  required
                />
                {formData.locationUrl && formData.locationUrl.includes('google.com/maps') && (
                  <a 
                    href={formData.locationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute right-3 top-3 text-primary hover:text-primary/80"
                    title="Open in Google Maps"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUpdate ? "Updating Address..." : "Registering Address..."}
              </>
            ) : (
              isUpdate ? "Update Address" : "Register Address"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
