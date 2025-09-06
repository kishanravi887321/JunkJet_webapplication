"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Package, IndianRupee, Leaf, MapPin, Calendar, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { createTransaction } from "@/lib/api"

interface MaterialRate {
  type: string
  priceRange: { min: number; max: number }
  unit: string
  carbonFactor: number
  description: string
}

const materialRates: MaterialRate[] = [
  {
    type: "plastic",
    priceRange: { min: 8, max: 15 },
    unit: "kg",
    carbonFactor: 1.8,
    description: "PET bottles, containers, packaging"
  },
  {
    type: "paper",
    priceRange: { min: 6, max: 12 },
    unit: "kg", 
    carbonFactor: 1.2,
    description: "Newspapers, cardboard, office paper"
  },
  {
    type: "metal",
    priceRange: { min: 25, max: 45 },
    unit: "kg",
    carbonFactor: 2.5,
    description: "Aluminum cans, steel, copper"
  },
  {
    type: "glass",
    priceRange: { min: 3, max: 8 },
    unit: "kg",
    carbonFactor: 0.8,
    description: "Bottles, jars, containers"
  },
  {
    type: "electronic",
    priceRange: { min: 15, max: 35 },
    unit: "kg",
    carbonFactor: 3.2,
    description: "Phones, computers, appliances"
  },
  {
    type: "textile",
    priceRange: { min: 5, max: 10 },
    unit: "kg",
    carbonFactor: 1.5,
    description: "Clothes, fabric, shoes"
  }
]

export function QuickBuySell() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"sell" | "buy">("sell")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    materialType: "",
    weight: "",
    pricePerKg: "",
    description: "",
    contactEmail: "",
    pickupLocation: {
      address: "",
      city: "",
      state: "",
      pincode: ""
    },
    preferredPickupDate: "",
    paymentMethod: "cash"
  })

  const selectedMaterial = materialRates.find(m => m.type === formData.materialType)
  const estimatedValue = selectedMaterial && formData.weight 
    ? (parseFloat(formData.weight) * selectedMaterial.priceRange.min + parseFloat(formData.weight) * selectedMaterial.priceRange.max) / 2
    : 0
  
  const carbonSaved = selectedMaterial && formData.weight
    ? parseFloat(formData.weight) * selectedMaterial.carbonFactor
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.email) return

    setLoading(true)
    try {
      const transactionData = {
        transactionType: activeTab,
        materialType: formData.materialType,
        weight: parseFloat(formData.weight),
        pricePerKg: parseFloat(formData.pricePerKg) || (selectedMaterial ? selectedMaterial.priceRange.min : 0),
        description: formData.description,
        sellerEmail: activeTab === "sell" ? user.email : formData.contactEmail,
        buyerEmail: activeTab === "buy" ? user.email : formData.contactEmail,
        pickupLocation: formData.pickupLocation,
        preferredPickupDate: formData.preferredPickupDate,
        paymentMethod: formData.paymentMethod
      }

      const response = await createTransaction(transactionData)
      if (response.data) {
        setSuccess(true)
        setFormData({
          materialType: "",
          weight: "",
          pricePerKg: "",
          description: "",
          contactEmail: "",
          pickupLocation: { address: "", city: "", state: "", pincode: "" },
          preferredPickupDate: "",
          paymentMethod: "cash"
        })
        
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      materialType: "",
      weight: "",
      pricePerKg: "",
      description: "",
      contactEmail: "",
      pickupLocation: { address: "", city: "", state: "", pincode: "" },
      preferredPickupDate: "",
      paymentMethod: "cash"
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Quick Buy & Sell</h2>
        <p className="text-muted-foreground">
          Create instant transactions for household recyclables
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <Package className="h-5 w-5" />
              <span>Transaction created successfully! Check your dashboard for updates.</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={(value: any) => {setActiveTab(value); resetForm()}}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sell" className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            I Want to Sell
          </TabsTrigger>
          <TabsTrigger value="buy" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            I Want to Buy
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === "sell" ? "Sell Your Materials" : "Buy Materials"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "sell" 
                    ? "Turn your household waste into cash while helping the environment"
                    : "Find and purchase recyclable materials from households"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Material Selection */}
                  <div>
                    <Label htmlFor="materialType">Material Type</Label>
                    <Select 
                      value={formData.materialType} 
                      onValueChange={(value) => setFormData({...formData, materialType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select material type" />
                      </SelectTrigger>
                      <SelectContent>
                        {materialRates.map((material) => (
                          <SelectItem key={material.type} value={material.type}>
                            <div className="flex items-center justify-between w-full">
                              <span className="capitalize">{material.type}</span>
                              <Badge variant="outline" className="ml-2">
                                ₹{material.priceRange.min}-{material.priceRange.max}/{material.unit}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedMaterial && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedMaterial.description}
                      </p>
                    )}
                  </div>

                  {/* Weight and Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                        placeholder="Enter weight"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="pricePerKg">
                        Price per kg (₹) 
                        {selectedMaterial && (
                          <span className="text-sm text-muted-foreground ml-1">
                            (Suggested: ₹{selectedMaterial.priceRange.min}-{selectedMaterial.priceRange.max})
                          </span>
                        )}
                      </Label>
                      <Input
                        id="pricePerKg"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.pricePerKg}
                        onChange={(e) => setFormData({...formData, pricePerKg: e.target.value})}
                        placeholder={selectedMaterial ? `${selectedMaterial.priceRange.min}` : "Enter price"}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <Label htmlFor="contactEmail">
                      {activeTab === "sell" ? "Buyer Email" : "Seller Email"}
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      placeholder={`Enter ${activeTab === "sell" ? "buyer" : "seller"} email address`}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe the condition, quality, or any special notes..."
                      rows={3}
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-3">
                    <Label>Pickup Location</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="City"
                        value={formData.pickupLocation.city}
                        onChange={(e) => setFormData({
                          ...formData, 
                          pickupLocation: {...formData.pickupLocation, city: e.target.value}
                        })}
                      />
                      <Input
                        placeholder="State"
                        value={formData.pickupLocation.state}
                        onChange={(e) => setFormData({
                          ...formData, 
                          pickupLocation: {...formData.pickupLocation, state: e.target.value}
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Address"
                        value={formData.pickupLocation.address}
                        onChange={(e) => setFormData({
                          ...formData, 
                          pickupLocation: {...formData.pickupLocation, address: e.target.value}
                        })}
                      />
                      <Input
                        placeholder="Pincode"
                        value={formData.pickupLocation.pincode}
                        onChange={(e) => setFormData({
                          ...formData, 
                          pickupLocation: {...formData.pickupLocation, pincode: e.target.value}
                        })}
                      />
                    </div>
                  </div>

                  {/* Pickup Date */}
                  <div>
                    <Label htmlFor="preferredPickupDate">Preferred Pickup Date</Label>
                    <Input
                      id="preferredPickupDate"
                      type="date"
                      value={formData.preferredPickupDate}
                      onChange={(e) => setFormData({...formData, preferredPickupDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select 
                      value={formData.paymentMethod} 
                      onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Transaction..." : `Create ${activeTab === "sell" ? "Sell" : "Buy"} Order`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Calculations & Info */}
          <div className="space-y-4">
            {/* Estimate Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Quick Estimate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.weight && selectedMaterial ? (
                  <>
                    <div className="flex justify-between">
                      <span>Weight:</span>
                      <span className="font-medium">{formData.weight}kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate Range:</span>
                      <span className="font-medium">
                        ₹{selectedMaterial.priceRange.min}-{selectedMaterial.priceRange.max}/kg
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-green-600 border-t pt-2">
                      <span>Estimated Value:</span>
                      <span>₹{estimatedValue.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select material and enter weight to see estimate
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Environmental Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-500" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                {carbonSaved > 0 ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {carbonSaved.toFixed(1)}kg
                      </div>
                      <p className="text-sm text-muted-foreground">CO₂ saved</p>
                    </div>
                    <div className="text-xs text-center text-muted-foreground">
                      By recycling {formData.weight}kg of {formData.materialType}, 
                      you're preventing {carbonSaved.toFixed(1)}kg of CO₂ from entering the atmosphere.
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    See your environmental impact by selecting material and weight
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Material Rates Reference */}
            <Card>
              <CardHeader>
                <CardTitle>Current Market Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {materialRates.map((material) => (
                  <div key={material.type} className="flex justify-between text-sm">
                    <span className="capitalize">{material.type}</span>
                    <span className="font-medium">
                      ₹{material.priceRange.min}-{material.priceRange.max}/{material.unit}
                    </span>
                  </div>
                ))}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  * Rates may vary based on quality and quantity
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {activeTab === "sell" ? (
                  <>
                    <p>• Clean materials fetch better prices</p>
                    <p>• Separate different material types</p>
                    <p>• Weigh materials accurately</p>
                    <p>• Be available during pickup time</p>
                  </>
                ) : (
                  <>
                    <p>• Verify material quality before purchase</p>
                    <p>• Check market rates regularly</p>
                    <p>• Confirm pickup arrangements</p>
                    <p>• Inspect materials upon delivery</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
