"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Package, Tag, DollarSign, FileImage } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useAddProduct } from "@/hooks/useApi"

interface WasteItemData {
  name: string
  tag: string
  productId: string
  quantity: string
  materialType: string
  description: string
  price: string
}

interface AddWasteItemProps {
  onSuccess: () => void
}

const materialTypes = ["plastic", "paper", "metal", "glass", "electronic", "organic", "textile", "mixed"]

export function AddWasteItem({ onSuccess }: AddWasteItemProps) {
  const { user } = useAuth()
  const { execute: addProduct, loading, error: apiError } = useAddProduct()
  const [formData, setFormData] = useState<WasteItemData>({
    name: "",
    tag: "",
    productId: "",
    quantity: "",
    materialType: "",
    description: "",
    price: "",
  })
  const [productImage, setProductImage] = useState<File | null>(null)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      materialType: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setProductImage(file)
  }

  const generateProductId = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `WASTE-${timestamp}-${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError("")

    try {
      await addProduct({
        email: user.email,
        name: formData.name,
        tag: formData.tag,
        productId: formData.productId || generateProductId(),
        quantity: formData.quantity,
        materialType: formData.materialType,
        description: formData.description,
        price: formData.price,
        productImage: productImage || undefined,
      })

      setFormData({
        name: "",
        tag: "",
        productId: "",
        quantity: "",
        materialType: "",
        description: "",
        price: "",
      })
      setProductImage(null)
      onSuccess()
    } catch (error: any) {
      setError(error.message || "Failed to add waste item")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Add Waste Item
        </CardTitle>
        <CardDescription>List your waste items to connect with buyers and contribute to recycling.</CardDescription>
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
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g., Plastic Bottles"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag *</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tag"
                  name="tag"
                  type="text"
                  placeholder="e.g., recyclable, clean"
                  value={formData.tag}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product ID</Label>
              <Input
                id="productId"
                name="productId"
                type="text"
                placeholder="Auto-generated if empty"
                value={formData.productId}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="text"
                placeholder="e.g., 10 kg, 50 pieces"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="materialType">Material Type *</Label>
              <Select onValueChange={handleSelectChange} value={formData.materialType}>
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
              <Label htmlFor="price">Expected Price *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  name="price"
                  type="text"
                  placeholder="e.g., $10, ₹500"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the condition, quality, and any other relevant details..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productImage">Product Image (Optional)</Label>
            <div className="relative">
              <FileImage className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="productImage" type="file" accept="image/*" onChange={handleFileChange} className="pl-10" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Item...
              </>
            ) : (
              "Add Waste Item"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
