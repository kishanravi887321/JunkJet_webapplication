"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserStats } from "@/components/profile/user-stats"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/lib/auth"
import { User, Edit3 } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    bio: "",
    location: "",
    phone: "",
  })

  // Mock stats data - in real app, fetch from API
  const userStats = {
    totalWasteContributed: 245.8,
    itemsRecycled: 127,
    co2Saved: 89.3,
    treesEquivalent: 12,
    rank: "Eco Champion",
    joinDate: "2024-01-15",
  }

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  const handleSave = async () => {
    // In real app, make API call to update profile
    console.log("Saving profile:", profileData)
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your account and track your environmental impact</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg bg-emerald-100 text-emerald-700">
                        {user.fullName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                          <p className="text-lg font-semibold">{user.fullName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Email</Label>
                          <p className="text-lg">{user.email}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Member Since</Label>
                          <p className="text-lg">{new Date(userStats.joinDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Current Rank</Label>
                          <p className="text-lg font-semibold text-emerald-600">{userStats.rank}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <UserStats stats={userStats} />
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <UserStats stats={userStats} />

              <Card>
                <CardHeader>
                  <CardTitle>Environmental Impact Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <h3 className="font-semibold text-emerald-800 mb-2">Waste Breakdown</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Plastic</p>
                          <p className="font-semibold">89.2 kg</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Metal</p>
                          <p className="font-semibold">67.4 kg</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Electronics</p>
                          <p className="font-semibold">45.8 kg</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Other</p>
                          <p className="font-semibold">43.4 kg</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Monthly Progress</h3>
                      <p className="text-sm text-gray-600">
                        You've contributed 23.4 kg of waste this month, helping save 8.7 kg of CO₂ emissions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Account Settings</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, fullName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself and your sustainability goals..."
                    />
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
