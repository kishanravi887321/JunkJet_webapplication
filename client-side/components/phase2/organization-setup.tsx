"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building, Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useUpdatePhase2User } from "@/hooks/useApi"

interface OrganizationData {
  materialType: string
  orgName: string
  orgNumber: string
  orgEmail: string
  orgOwnerName: string
  locationUrl: string
  location: {
    city: string
    state: string
    country: string
    pincode: string
    landmark: string
    latitude: number
    longitude: number
  }
}

interface OrganizationSetupProps {
  onSuccess: () => void
  isUpdate?: boolean
}

const materialTypes = ["plastic", "paper", "metal", "glass", "electronic", "organic", "textile", "mixed"]

export function OrganizationSetup({ onSuccess, isUpdate = false }: OrganizationSetupProps) {
  const { user } = useAuth()
  const { execute: updatePhase2User, loading, error: apiError } = useUpdatePhase2User()
  const [formData, setFormData] = useState<OrganizationData>({
    materialType: "",
    orgName: "",
    orgNumber: "",
    orgEmail: "",
    orgOwnerName: "",
    locationUrl: "",
    location: {
      city: "",
      state: "",
      country: "",
      pincode: "",
      landmark: "",
      latitude: 0,
      longitude: 0,
    },
  })
  const [error, setError] = useState("")
  const [gettingLocation, setGettingLocation] = useState(false)

  // Generate Google Maps URL from coordinates
  const generateMapUrl = (lat: number, lng: number): string => {
    if (!lat || !lng || lat === 0 || lng === 0) return ""
    return `https://www.google.com/maps?q=${lat},${lng}`
  }

  // Update location URL whenever coordinates change
  useEffect(() => {
    const newUrl = generateMapUrl(formData.location.latitude, formData.location.longitude)
    if (newUrl && newUrl !== formData.locationUrl) {
      setFormData(prev => ({
        ...prev,
        locationUrl: newUrl
      }))
    }
  }, [formData.location.latitude, formData.location.longitude])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]:
            locationField === "latitude" || locationField === "longitude" ? Number.parseFloat(value) || 0 : value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      materialType: value,
    }))
  }

  const getCurrentLocation = () => {
    setGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }))
          setGettingLocation(false)
        },
        (error) => {
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
    if (!user) return

    setError("")

    try {
      await updatePhase2User({
        email: user.email,
        ...formData,
      })
      onSuccess()
    } catch (error: any) {
      setError(error.message || "Organization setup failed")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          {isUpdate ? "Update Organization Details" : "Organization Setup"}
        </CardTitle>
        <CardDescription>
          {isUpdate 
            ? "Update your organization details to maintain accurate connections in the waste management network."
            : "Set up your organization details to start connecting with households and organizations in the waste management network."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || apiError) && (
            <Alert variant="destructive">
              <AlertDescription>{error || apiError}</AlertDescription>
            </Alert>
          )}

          {/* Organization Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Organization Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name *</Label>
                <Input
                  id="orgName"
                  name="orgName"
                  type="text"
                  placeholder="Enter organization name"
                  value={formData.orgName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgOwnerName">Owner Name</Label>
                <Input
                  id="orgOwnerName"
                  name="orgOwnerName"
                  type="text"
                  placeholder="Owner name (optional)"
                  value={formData.orgOwnerName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orgEmail">Organization Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="orgEmail"
                    name="orgEmail"
                    type="email"
                    placeholder="organization@example.com"
                    value={formData.orgEmail}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgNumber">Organization Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="orgNumber"
                    name="orgNumber"
                    type="tel"
                    placeholder="Organization phone number"
                    value={formData.orgNumber}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="materialType">Primary Material Type *</Label>
              <Select onValueChange={handleSelectChange} value={formData.materialType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary material type" />
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

          {/* Location Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Location Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location.city">City *</Label>
                <Input
                  id="location.city"
                  name="location.city"
                  type="text"
                  placeholder="Enter city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location.state">State *</Label>
                <Input
                  id="location.state"
                  name="location.state"
                  type="text"
                  placeholder="Enter state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location.country">Country *</Label>
                <Input
                  id="location.country"
                  name="location.country"
                  type="text"
                  placeholder="Enter country"
                  value={formData.location.country}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location.pincode">Pincode *</Label>
                <Input
                  id="location.pincode"
                  name="location.pincode"
                  type="text"
                  placeholder="Enter pincode"
                  value={formData.location.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location.landmark">Landmark *</Label>
              <Input
                id="location.landmark"
                name="location.landmark"
                type="text"
                placeholder="Nearby landmark"
                value={formData.location.landmark}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Location Coordinates</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                >
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
                  <Label htmlFor="location.latitude">Latitude *</Label>
                  <Input
                    id="location.latitude"
                    name="location.latitude"
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={formData.location.latitude || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location.longitude">Longitude *</Label>
                  <Input
                    id="location.longitude"
                    name="location.longitude"
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={formData.location.longitude || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationUrl">Location URL *</Label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="locationUrl"
                    name="locationUrl"
                    type="url"
                    placeholder="Google Maps or location URL"
                    value={formData.locationUrl}
                    onChange={handleInputChange}
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
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUpdate ? "Updating Organization..." : "Setting up Organization..."}
              </>
            ) : (
              isUpdate ? "Update Organization" : "Complete Setup"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
