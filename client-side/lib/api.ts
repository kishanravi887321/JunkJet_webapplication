// API Configuration and Client for JunkJet Backend

// Base configuration
// export const API_BASE_URL =  'http://localhost:8000' 
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:8000'
// 
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
  isPhase1User: boolean
  isPhase2User: boolean
  isPhase3User: boolean
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

    console.log(`Making API request to: ${url}`)
    console.log('Request options:', options)

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
      
      console.log(`Response status: ${response.status}`)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
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
      console.log('Response data:', data)
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      console.error('URL:', url)
      console.error('Config:', config)
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
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

  // Analytics API Methods
  async getAnalyticsSummary(email?: string): Promise<ApiResponse<{
    totalWasteSold: string
    totalEarnings: string
    activeBuyers: number
    impactScore: number
    growthRate: number
    efficiencyGain: number
  }>> {
    const params = email ? `?email=${encodeURIComponent(email)}` : ''
    return this.request<any>(`/api/analytics/summary${params}`, {
      method: 'GET',
    })
  }

  async getWasteTrend(email?: string): Promise<ApiResponse<Array<{
    month: string
    weight: number
    earnings: number
  }>>> {
    const params = email ? `?email=${encodeURIComponent(email)}` : ''
    return this.request<any>(`/api/analytics/waste-trend${params}`, {
      method: 'GET',
    })
  }

  async getMaterialDistribution(email?: string): Promise<ApiResponse<Array<{
    name: string
    value: number
    color: string
  }>>> {
    const params = email ? `?email=${encodeURIComponent(email)}` : ''
    return this.request<any>(`/api/analytics/material-distribution${params}`, {
      method: 'GET',
    })
  }

  async getBuyerPerformance(email?: string): Promise<ApiResponse<Array<{
    name: string
    purchases: number
    amount: number
  }>>> {
    const params = email ? `?email=${encodeURIComponent(email)}` : ''
    return this.request<any>(`/api/analytics/buyer-performance${params}`, {
      method: 'GET',
    })
  }

  async getEarningsTrend(email?: string): Promise<ApiResponse<Array<{
    month: string
    amount: number
  }>>> {
    const params = email ? `?email=${encodeURIComponent(email)}` : ''
    return this.request<any>(`/api/analytics/earnings-trend${params}`, {
      method: 'GET',
    })
  }

  async addWasteTransaction(data: {
    buyerEmail: string
    materialType: string
    weight: number
    pricePerKg: number
    buyerOrgName: string
    location: {
      city: string
      state: string
      country: string
    }
    email?: string
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/api/analytics/transaction', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Transaction API Methods
  async createTransaction(data: {
    buyerEmail: string
    sellerEmail: string
    transactionType: 'buy' | 'sell'
    materialType: string
    materialGrade?: string
    weight: number
    pricePerKg: number
    description?: string
    pickupLocation?: {
      address?: string
      city?: string
      state?: string
      country?: string
      pincode?: string
      coordinates?: {
        latitude: number
        longitude: number
      }
    }
    preferredPickupDate?: string
    paymentMethod?: string
    buyerOrgName?: string
    images?: string[]
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/api/transactions/create', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getUserTransactions(params: {
    email: string
    type?: 'buy' | 'sell'
    status?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })
    
    return this.request<any>(`/api/transactions/user-transactions?${queryParams}`, {
      method: 'GET',
    })
  }

  async updateTransactionStatus(transactionId: string, data: {
    status?: string
    paymentStatus?: string
    actualPickupDate?: string
    qualityNotes?: string
    email: string
  }): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/transactions/${transactionId}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async addTransactionRating(transactionId: string, data: {
    rating: number
    feedback?: string
    raterType: 'seller' | 'buyer'
    email: string
  }): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/transactions/${transactionId}/rating`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getTransactionAnalytics(email: string, period?: string): Promise<ApiResponse<any>> {
    const params = period ? `?email=${encodeURIComponent(email)}&period=${period}` : `?email=${encodeURIComponent(email)}`
    return this.request<any>(`/api/transactions/analytics${params}`, {
      method: 'GET',
    })
  }

  // Auth Methods
  logout(): void {
    removeToken()
  }
}

// Export singleton instance
export const api = new ApiClient()

// Export individual API functions with proper binding
export const registerUser = (userData: Parameters<typeof api.registerUser>[0]) => api.registerUser(userData)
export const loginUser = (credentials: Parameters<typeof api.loginUser>[0]) => api.loginUser(credentials)
export const changePassword = (data: Parameters<typeof api.changePassword>[0]) => api.changePassword(data)
export const deleteAvatar = () => api.deleteAvatar()
export const deleteCoverImage = () => api.deleteCoverImage()
export const updateAvatar = (avatar: File) => api.updateAvatar(avatar)
export const updateCoverImage = (coverImage: File) => api.updateCoverImage(coverImage)
export const updateUserDetails = (details: Parameters<typeof api.updateUserDetails>[0]) => api.updateUserDetails(details)
export const registerPhase1User = (data: Parameters<typeof api.registerPhase1User>[0]) => api.registerPhase1User(data)
export const updatePhase2User = (data: Parameters<typeof api.updatePhase2User>[0]) => api.updatePhase2User(data)
export const findNearbyBuyers = (data: Parameters<typeof api.findNearbyBuyers>[0]) => api.findNearbyBuyers(data)
export const sendChatMessage = (message: string) => api.sendChatMessage(message)
export const addProduct = (data: Parameters<typeof api.addProduct>[0]) => api.addProduct(data)
export const updateProduct = (data: Parameters<typeof api.updateProduct>[0]) => api.updateProduct(data)
export const addReview = (data: Parameters<typeof api.addReview>[0]) => api.addReview(data)
export const getAnalyticsSummary = (email?: string) => api.getAnalyticsSummary(email)
export const getWasteTrend = (email?: string) => api.getWasteTrend(email)
export const getMaterialDistribution = (email?: string) => api.getMaterialDistribution(email)
export const getBuyerPerformance = (email?: string) => api.getBuyerPerformance(email)
export const getEarningsTrend = (email?: string) => api.getEarningsTrend(email)
export const addWasteTransaction = (data: Parameters<typeof api.addWasteTransaction>[0]) => api.addWasteTransaction(data)
export const createTransaction = (data: Parameters<typeof api.createTransaction>[0]) => api.createTransaction(data)
export const getUserTransactions = (params: Parameters<typeof api.getUserTransactions>[0]) => api.getUserTransactions(params)
export const updateTransactionStatus = (transactionId: string, data: Parameters<typeof api.updateTransactionStatus>[1]) => api.updateTransactionStatus(transactionId, data)
export const addTransactionRating = (transactionId: string, data: Parameters<typeof api.addTransactionRating>[1]) => api.addTransactionRating(transactionId, data)
export const getTransactionAnalytics = (email: string, period?: string) => api.getTransactionAnalytics(email, period)
export const logout = () => api.logout()
