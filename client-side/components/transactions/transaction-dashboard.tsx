"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Package, IndianRupee, MapPin, Clock, Star, Filter } from "lucide-react"
import { useAuth } from "@/lib/auth"
import {
  getUserTransactions,
  createTransaction,
  updateTransactionStatus,
  addTransactionRating,
  getTransactionAnalytics
} from "@/lib/api"

interface Transaction {
  _id: string
  seller: { fullName: string; email: string; avatar?: string }
  buyer: { fullName: string; email: string; avatar?: string }
  transactionType: "buy" | "sell"
  materialType: string
  weight: number
  pricePerKg: number
  totalAmount: number
  status: string
  paymentStatus: string
  description?: string
  pickupLocation?: any
  preferredPickupDate?: string
  createdAt: string
  sellerRating?: { rating: number; feedback: string }
  buyerRating?: { rating: number; feedback: string }
  carbonSaved?: number
}

interface TransactionAnalytics {
  period: string
  selling: {
    count: number
    totalValue: number
    totalWeight: number
    avgPrice: number
    completedCount: number
  }
  buying: {
    count: number
    totalValue: number
    totalWeight: number
    avgPrice: number
    completedCount: number
  }
  environmental: {
    totalCarbonSaved: number
    materialsRecycled: number
  }
}

export function TransactionDashboard() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [analytics, setAnalytics] = useState<TransactionAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell'>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  
  // Create transaction form state
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    transactionType: 'sell' as 'buy' | 'sell',
    materialType: '',
    weight: '',
    pricePerKg: '',
    description: '',
    buyerEmail: '',
    sellerEmail: '',
    pickupLocation: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    preferredPickupDate: '',
    paymentMethod: 'cash'
  })

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!user?.email) return

    try {
      setLoading(true)
      const params: any = {
        email: user.email,
        page: currentPage,
        limit: 10
      }
      
      if (filterType !== 'all') params.type = filterType
      if (filterStatus !== 'all') params.status = filterStatus

      const response = await getUserTransactions(params)
      if (response.data) {
        setTransactions(response.data.transactions || [])
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch analytics
  const fetchAnalytics = async () => {
    if (!user?.email) return

    try {
      const response = await getTransactionAnalytics(user.email, 'month')
      if (response.data) {
        setAnalytics(response.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  useEffect(() => {
    fetchTransactions()
    fetchAnalytics()
  }, [user?.email, currentPage, filterType, filterStatus])

  // Handle create transaction
  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.email) return

    try {
      const transactionData = {
        ...createFormData,
        weight: parseFloat(createFormData.weight),
        pricePerKg: parseFloat(createFormData.pricePerKg),
        sellerEmail: createFormData.transactionType === 'sell' ? user.email : createFormData.sellerEmail,
        buyerEmail: createFormData.transactionType === 'buy' ? user.email : createFormData.buyerEmail,
      }

      const response = await createTransaction(transactionData)
      if (response.data) {
        setShowCreateForm(false)
        setCreateFormData({
          transactionType: 'sell',
          materialType: '',
          weight: '',
          pricePerKg: '',
          description: '',
          buyerEmail: '',
          sellerEmail: '',
          pickupLocation: { address: '', city: '', state: '', pincode: '' },
          preferredPickupDate: '',
          paymentMethod: 'cash'
        })
        fetchTransactions()
        fetchAnalytics()
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
    }
  }

  // Handle status update
  const handleStatusUpdate = async (transactionId: string, status: string) => {
    if (!user?.email) return

    try {
      await updateTransactionStatus(transactionId, {
        status,
        email: user.email
      })
      fetchTransactions()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Transaction Hub</h2>
          <p className="text-muted-foreground">
            Manage your buying and selling activities
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          + Create Transaction
        </Button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Selling</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {analytics.selling.count}
              </div>
              <p className="text-xs text-muted-foreground">
                ₹{analytics.selling.totalValue.toLocaleString('en-IN')} earned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Buying</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {analytics.buying.count}
              </div>
              <p className="text-xs text-muted-foreground">
                ₹{analytics.buying.totalValue.toLocaleString('en-IN')} spent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight Traded</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {(analytics.selling.totalWeight + analytics.buying.totalWeight).toFixed(1)}kg
              </div>
              <p className="text-xs text-muted-foreground">
                Total material processed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {analytics.environmental.totalCarbonSaved.toFixed(1)}kg
              </div>
              <p className="text-xs text-muted-foreground">
                CO2 equivalent
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Label>Type:</Label>
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="sell">Selling</SelectItem>
              <SelectItem value="buy">Buying</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label>Status:</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first transaction
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                Create Transaction
              </Button>
            </CardContent>
          </Card>
        ) : (
          transactions.map((transaction) => (
            <Card key={transaction._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={transaction.transactionType === 'sell' ? 'default' : 'secondary'}>
                        {transaction.transactionType === 'sell' ? 'Selling' : 'Buying'}
                      </Badge>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold">
                      {transaction.materialType.charAt(0).toUpperCase() + transaction.materialType.slice(1)}
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="font-medium">{transaction.weight}kg</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price/kg</p>
                        <p className="font-medium">₹{transaction.pricePerKg}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-medium text-green-600">₹{transaction.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Carbon Saved</p>
                        <p className="font-medium text-emerald-600">{transaction.carbonSaved?.toFixed(1)}kg CO2</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{transaction.pickupLocation?.city || 'Location TBD'}</span>
                      </div>
                      {transaction.preferredPickupDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(transaction.preferredPickupDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {transaction.description && (
                      <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    {transaction.status === 'pending' && (
                      <div className="space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusUpdate(transaction._id, 'confirmed')}
                        >
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusUpdate(transaction._id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                    
                    {transaction.status === 'confirmed' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusUpdate(transaction._id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                    )}

                    {transaction.status === 'completed' && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <Star className="h-4 w-4 fill-current" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Transaction Modal/Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Transaction</CardTitle>
              <CardDescription>
                Create a new buying or selling transaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTransaction} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transactionType">Transaction Type</Label>
                    <Select 
                      value={createFormData.transactionType} 
                      onValueChange={(value: any) => setCreateFormData({...createFormData, transactionType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sell">I'm Selling</SelectItem>
                        <SelectItem value="buy">I'm Buying</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="materialType">Material Type</Label>
                    <Select 
                      value={createFormData.materialType} 
                      onValueChange={(value) => setCreateFormData({...createFormData, materialType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plastic">Plastic</SelectItem>
                        <SelectItem value="paper">Paper</SelectItem>
                        <SelectItem value="metal">Metal</SelectItem>
                        <SelectItem value="glass">Glass</SelectItem>
                        <SelectItem value="electronic">Electronic</SelectItem>
                        <SelectItem value="organic">Organic</SelectItem>
                        <SelectItem value="textile">Textile</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={createFormData.weight}
                      onChange={(e) => setCreateFormData({...createFormData, weight: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="pricePerKg">Price per kg (₹)</Label>
                    <Input
                      id="pricePerKg"
                      type="number"
                      step="0.01"
                      value={createFormData.pricePerKg}
                      onChange={(e) => setCreateFormData({...createFormData, pricePerKg: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {createFormData.transactionType === 'sell' && (
                  <div>
                    <Label htmlFor="buyerEmail">Buyer Email</Label>
                    <Input
                      id="buyerEmail"
                      type="email"
                      value={createFormData.buyerEmail}
                      onChange={(e) => setCreateFormData({...createFormData, buyerEmail: e.target.value})}
                      required
                    />
                  </div>
                )}

                {createFormData.transactionType === 'buy' && (
                  <div>
                    <Label htmlFor="sellerEmail">Seller Email</Label>
                    <Input
                      id="sellerEmail"
                      type="email"
                      value={createFormData.sellerEmail}
                      onChange={(e) => setCreateFormData({...createFormData, sellerEmail: e.target.value})}
                      required
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData({...createFormData, description: e.target.value})}
                    placeholder="Additional details about the material..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={createFormData.pickupLocation.city}
                      onChange={(e) => setCreateFormData({
                        ...createFormData, 
                        pickupLocation: {...createFormData.pickupLocation, city: e.target.value}
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={createFormData.pickupLocation.state}
                      onChange={(e) => setCreateFormData({
                        ...createFormData, 
                        pickupLocation: {...createFormData.pickupLocation, state: e.target.value}
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="preferredPickupDate">Preferred Pickup Date</Label>
                  <Input
                    id="preferredPickupDate"
                    type="date"
                    value={createFormData.preferredPickupDate}
                    onChange={(e) => setCreateFormData({...createFormData, preferredPickupDate: e.target.value})}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Transaction
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
