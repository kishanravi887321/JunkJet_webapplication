// React hooks for JunkJet API endpoints
import { useState, useCallback } from 'react'
import { api, ApiResponse, Phase1User, Phase2User, BuyerMatch, Product, Review } from '../lib/api'
import { useAuth } from '../lib/auth'

// Generic hook for API calls
export function useApiCall<T, P = any>(
  apiFunction: (params: P) => Promise<ApiResponse<T>>
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (params: P) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiFunction(params)
      setData(response.data || null)
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunction])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}

// User Management Hooks
export function useChangePassword() {
  return useApiCall(api.changePassword)
}

export function useUpdateUserDetails() {
  const { updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (details: { fullName: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.updateUserDetails(details)
      if (response.data?.user) {
        updateUser({ fullName: response.data.user.fullName })
      }
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update user details'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [updateUser])

  return { loading, error, execute }
}

export function useUpdateAvatar() {
  const { updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (avatar: File) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.updateAvatar(avatar)
      if (response.data?.avatar) {
        updateUser({ avatar: response.data.avatar })
      }
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update avatar'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [updateUser])

  return { loading, error, execute }
}

export function useUpdateCoverImage() {
  const { updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (coverImage: File) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.updateCoverImage(coverImage)
      if (response.data?.coverImage) {
        updateUser({ coverImage: response.data.coverImage })
      }
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update cover image'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [updateUser])

  return { loading, error, execute }
}

export function useDeleteAvatar() {
  const { updateUser } = useAuth()
  return useApiCall(async () => {
    const response = await api.deleteAvatar()
    updateUser({ avatar: undefined })
    return response
  })
}

export function useDeleteCoverImage() {
  const { updateUser } = useAuth()
  return useApiCall(async () => {
    const response = await api.deleteCoverImage()
    updateUser({ coverImage: undefined })
    return response
  })
}

// Phase 1 Hooks
export function useRegisterPhase1User() {
  return useApiCall<Phase1User, {
    email: string
    phoneNumber: string
    houseName?: string
    country: string
    pincode: string
    landmark: string
    state: string
    city: string
    latitude: number
    longitude: number
  }>(api.registerPhase1User)
}

// Phase 2 Hooks
export function useUpdatePhase2User() {
  return useApiCall<Phase2User, {
    email: string
    materialType: string
    orgName: string
    orgNumber: string
    orgEmail: string
    orgOwnerName?: string
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
  }>(api.updatePhase2User)
}

// Location Hooks
export function useFindNearbyBuyers() {
  return useApiCall<BuyerMatch[], {
    email: string
    materialType: string
    rangeKm: string
  }>(api.findNearbyBuyers)
}

// Chatbot Hooks
export function useChatbot() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; timestamp: Date }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (message: string) => {
    try {
      setLoading(true)
      setError(null)

      // Add user message to chat
      const userMessage = { text: message, isUser: true, timestamp: new Date() }
      setMessages(prev => [...prev, userMessage])

      // Send to API
      const response = await api.sendChatMessage(message)
      
      // Add bot response to chat
      const botMessage = { 
        text: response.data || response.message, 
        isUser: false, 
        timestamp: new Date() 
      }
      setMessages(prev => [...prev, botMessage])

      return response
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send message'
      setError(errorMessage)
      
      // Add error message to chat
      const errorMsg = { 
        text: 'Sorry, I encountered an error. Please try again.', 
        isUser: false, 
        timestamp: new Date() 
      }
      setMessages(prev => [...prev, errorMsg])
      
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, loading, error, sendMessage, clearMessages }
}

// Product Hooks
export function useAddProduct() {
  return useApiCall<Product, {
    email: string
    name: string
    tag: string
    productId: string
    quantity: string
    materialType: string
    description: string
    price: string
    productImage?: File
  }>(api.addProduct)
}

export function useUpdateProduct() {
  return useApiCall<Product, {
    productId: string
    email: string
    password: string
    productImage?: File
    details: {
      name?: string
      quantity?: string
      materialType?: string
      description?: string
      price?: string
    }
  }>(api.updateProduct)
}

// Review Hooks
export function useAddReview() {
  return useApiCall<Review, {
    productId: string
    rating: number
    comment: string
  }>(api.addReview)
}

// Location Hook for getting user's current position
export function useGeolocation() {
  const [position, setPosition] = useState<{ latitude: number; longitude: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLoading(false)
      },
      (error) => {
        setError(error.message)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes
      }
    )
  }, [])

  return { position, loading, error, getCurrentPosition }
}

// File upload validation hook
export function useFileValidation() {
  const validateImageFile = useCallback((file: File) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please select a valid image file (JPEG, PNG, or WebP)')
    }

    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB')
    }

    return true
  }, [])

  return { validateImageFile }
}
