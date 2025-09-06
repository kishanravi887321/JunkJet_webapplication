// API Configuration and Client for JunkJet Backend

// Base configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Token management functions
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("accessToken")
  }
  return null
}

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("accessToken", token)
  }
}

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("userData")
  }
}

// API Response Types
export interface ApiResponse<T = any> {
  status: number
  data?: T
  message: string
  success?: boolean
  matches?: T[]
}

export interface User {
  _id: string
  userName: string
  email: string
  fullName: string
  avatar: string
  coverImage: string
  createdAt: string
  updatedAt: string
}

export interface Phase1User {
  _id: string
  user: string
  phoneNumber: string
  address: {
    houseName?: string
    country: string
    pincode: string
    landmark: string
    state: string
    city: string
    longitude: number
    latitude: number
    hexId: string
  }
}

export interface Phase2User {
  _id: string
  user: string
  materialType: string
  orgName: string
  orgNumber: string
  orgEmail: string
  orgOwnerName: string
  location: {
    city: string
    state: string
    country: string
    pincode: string
    landmark: string
    latitude: number
    longitude: number
    hexIds: {
      [key: string]: string
    }
  }
  locationUrl: string
}

export interface Product {
  _id: string
  name: string
  tag: string
  productId: string
  productImage: string
  quantity: string
  materialType: string
  description: string
  price: string
  reviews?: string[]
}

export interface Review {
  _id: string
  product: string
  user: string
  rating: number
  comment: string
  createdAt: string
}

export interface BuyerMatch {
  orgName: string
  materialType: string
  distanceKm: number
  contact: string
  locationUrl: string
  hexId: string
}

// API Client Class
class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const token = getToken()

    const config: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      config.headers = {
        ...config.headers,
        'Content-Type': 'application/json',
      }
    }

    try {
      const response = await fetch(url, config)
      
      // Handle text responses (like chatbot)
      if (response.headers.get('content-type')?.includes('text/plain')) {
        const text = await response.text()
        return {
          status: response.status,
          message: text,
          data: text as any
        }
      }

      // Handle JSON responses
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // User API Methods
  async registerUser(userData: {
    userName: string
    email: string
    password: string
    fullName: string
    avatar?: File
    coverImage?: File
  }): Promise<ApiResponse<User>> {
    const formData = new FormData()
    formData.append('userName', userData.userName)
    formData.append('email', userData.email)
    formData.append('password', userData.password)
    formData.append('fullName', userData.fullName)
    
    if (userData.avatar) {
      formData.append('avatar', userData.avatar)
    }
    if (userData.coverImage) {
      formData.append('coverImage', userData.coverImage)
    }

    return this.request<User>('/api/users/register', {
      method: 'POST',
      body: formData,
    })
  }

  async loginUser(credentials: {
    email: string
    password: string
  }): Promise<ApiResponse<{ userLoggedIn: User; accessToken: string }>> {
    const response = await this.request<{ userLoggedIn: User; accessToken: string }>('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    // Store token after successful login
    if (response.data?.accessToken) {
      setToken(response.data.accessToken)
    }
    
    return response
  }

  async changePassword(passwords: {
    oldpassword: string
    newpassword: string
  }): Promise<ApiResponse> {
    return this.request('/api/users/changepassword', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    })
  }

  async deleteAvatar(): Promise<ApiResponse> {
    return this.request('/api/users/deleteavatar', {
      method: 'POST',
    })
  }

  async deleteCoverImage(): Promise<ApiResponse> {
    return this.request('/api/users/deletecoverimage', {
      method: 'POST',
    })
  }

  async updateAvatar(avatar: File): Promise<ApiResponse<{ avatar: string }>> {
    const formData = new FormData()
    formData.append('avatar', avatar)

    return this.request<{ avatar: string }>('/api/users/updateavatar', {
      method: 'PUT',
      body: formData,
    })
  }

  async updateCoverImage(coverImage: File): Promise<ApiResponse<{ coverImage: string }>> {
    const formData = new FormData()
    formData.append('coverImage', coverImage)

    return this.request<{ coverImage: string }>('/api/users/updatecoverimage', {
      method: 'PUT',
      body: formData,
    })
  }

  async updateUserDetails(details: {
    fullName: string
  }): Promise<ApiResponse<{ user: { fullName: string; email: string } }>> {
    return this.request<{ user: { fullName: string; email: string } }>('/api/users/updatedetails', {
      method: 'PUT',
      body: JSON.stringify(details),
    })
  }

  // Phase 1 API Methods
  async registerPhase1User(data: {
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
  }): Promise<ApiResponse<Phase1User>> {
    return this.request<Phase1User>('/phase1/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Phase 2 API Methods
  async updatePhase2User(data: {
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
  }): Promise<ApiResponse<Phase2User>> {
    return this.request<Phase2User>('/phase2/update', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Location API Methods
  async findNearbyBuyers(data: {
    email: string
    materialType: string
    rangeKm: string
  }): Promise<ApiResponse<BuyerMatch[]>> {
    return this.request<BuyerMatch[]>('/location/finduser', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Chatbot API Methods
  async sendChatMessage(message: string): Promise<ApiResponse<string>> {
    return this.request<string>('/chatbot/chatbotquery', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: message,
    })
  }

  // Product API Methods
  async addProduct(data: {
    email: string
    name: string
    tag: string
    productId: string
    quantity: string
    materialType: string
    description: string
    price: string
    productImage?: File
  }): Promise<ApiResponse<Product>> {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string | File)
      }
    })

    return this.request<Product>('/product/addproduct', {
      method: 'POST',
      body: formData,
    })
  }

  async updateProduct(data: {
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
  }): Promise<ApiResponse<Product>> {
    const formData = new FormData()
    formData.append('productId', data.productId)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('details', JSON.stringify(data.details))
    
    if (data.productImage) {
      formData.append('productImage', data.productImage)
    }

    return this.request<Product>('/product/updateproduct', {
      method: 'PUT',
      body: formData,
    })
  }

  // Review API Methods
  async addReview(data: {
    productId: string
    rating: number
    comment: string
  }): Promise<ApiResponse<Review>> {
    return this.request<Review>('/review/addreview', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Auth Methods
  logout(): void {
    removeToken()
  }
}

// Export singleton instance
export const api = new ApiClient()

// Export individual API functions for convenience
export const {
  registerUser,
  loginUser,
  changePassword,
  deleteAvatar,
  deleteCoverImage,
  updateAvatar,
  updateCoverImage,
  updateUserDetails,
  registerPhase1User,
  updatePhase2User,
  findNearbyBuyers,
  sendChatMessage,
  addProduct,
  updateProduct,
  addReview,
  logout,
} = api
