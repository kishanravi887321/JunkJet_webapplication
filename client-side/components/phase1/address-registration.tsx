"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MapPin, Phone, Home } from "lucide-react"
import { useAuth } from "@/lib/auth"
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
}

interface AddressRegistrationProps {
  onSuccess: () => void
}

export function AddressRegistration({ onSuccess }: AddressRegistrationProps) {
  const { user } = useAuth()
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
  })
  const [gettingLocation, setGettingLocation] = useState(false)
  const [error, setError] = useState("")

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
      await registerPhase1User({
        email: user.email,
        ...formData,
      })
      onSuccess()
    } catch (error: any) {
      setError(error.message || "Registration failed")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          Register Your Address
        </CardTitle>
        <CardDescription>
          Help us connect you with nearby waste buyers by providing your location details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || apiError) && (
            <Alert variant="destructive">
              <AlertDescription>{error || apiError}</AlertDescription>
            </Alert>
          )}

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
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering Address...
              </>
            ) : (
              "Register Address"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
