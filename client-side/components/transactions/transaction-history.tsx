"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar, 
  Package, 
  IndianRupee, 
  MapPin, 
  Clock, 
  Star, 
  User, 
  Phone, 
  Mail,
  Download,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { getUserTransactions, addTransactionRating } from "@/lib/api"

interface Transaction {
  _id: string
  seller: { fullName: string; email: string; avatar?: string; phone?: string }
  buyer: { fullName: string; email: string; avatar?: string; phone?: string }
  transactionType: "buy" | "sell"
  materialType: string
  weight: number
  pricePerKg: number
  totalAmount: number
  status: string
  paymentStatus: string
  description?: string
  pickupLocation?: {
    address: string
    city: string
    state: string
    pincode: string
  }
  preferredPickupDate?: string
  actualPickupDate?: string
  createdAt: string
  updatedAt: string
  sellerRating?: { rating: number; feedback: string; ratedAt: string }
  buyerRating?: { rating: number; feedback: string; ratedAt: string }
  carbonSaved?: number
  paymentMethod?: string
}

export function TransactionHistory() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell'>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  
  // Rating form state
  const [ratingForm, setRatingForm] = useState({
    rating: 5,
    feedback: '',
    showForm: false,
    transactionId: '',
    ratingType: 'seller' as 'seller' | 'buyer'
  })

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
      if (searchTerm) params.search = searchTerm
      if (dateRange.from) params.dateFrom = dateRange.from
      if (dateRange.to) params.dateTo = dateRange.to

      const response = await getUserTransactions(params)
      if (response.data) {
        setTransactions(response.data.transactions || [])
        setTotalPages(response.data.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [user?.email, currentPage, filterType, filterStatus, searchTerm, dateRange])

  const handleRating = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.email) return

    try {
      await addTransactionRating(ratingForm.transactionId, {
        rating: ratingForm.rating,
        feedback: ratingForm.feedback,
        email: user.email,
        raterType: ratingForm.ratingType
      })

      setRatingForm({
        rating: 5,
        feedback: '',
        showForm: false,
        transactionId: '',
        ratingType: 'seller'
      })
      fetchTransactions()
    } catch (error) {
      console.error('Error submitting rating:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const canRate = (transaction: Transaction, ratingType: 'seller' | 'buyer') => {
    if (transaction.status !== 'completed') return false
    
    const userIsSeller = transaction.seller.email === user?.email
    const userIsBuyer = transaction.buyer.email === user?.email
    
    if (ratingType === 'seller' && userIsBuyer && !transaction.sellerRating) return true
    if (ratingType === 'buyer' && userIsSeller && !transaction.buyerRating) return true
    
    return false
  }

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Type', 'Material', 'Weight (kg)', 'Price/kg', 'Total Amount', 'Status', 'Carbon Saved (kg)'],
      ...transactions.map(t => [
        new Date(t.createdAt).toLocaleDateString(),
        t.transactionType,
        t.materialType,
        t.weight,
        t.pricePerKg,
        t.totalAmount,
        t.status,
        t.carbonSaved?.toFixed(2) || 0
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading transaction history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Transaction History</h2>
          <p className="text-muted-foreground">
            Complete record of your buying and selling activities
          </p>
        </div>
        <Button onClick={exportTransactions} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Type</Label>
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="sell">Selling</SelectItem>
                  <SelectItem value="buy">Buying</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateFrom">Date Range</Label>
              <div className="flex gap-2">
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                  className="text-xs"
                />
                <Input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
            </CardContent>
          </Card>
        ) : (
          transactions.map((transaction) => (
            <Card key={transaction._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={transaction.transactionType === 'sell' ? 'default' : 'secondary'}>
                          {transaction.transactionType === 'sell' ? 'Selling' : 'Buying'}
                        </Badge>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        <Badge className={getPaymentStatusColor(transaction.paymentStatus)}>
                          {transaction.paymentStatus}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ₹{transaction.totalAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.weight}kg × ₹{transaction.pricePerKg}/kg
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2">Material Details</h4>
                    <p className="text-lg font-medium">{transaction.materialType.charAt(0).toUpperCase() + transaction.materialType.slice(1)}</p>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Contact Info</h4>
                    <div className="space-y-1">
                      {transaction.transactionType === 'sell' ? (
                        <div>
                          <p className="text-sm font-medium">Buyer</p>
                          <p className="text-sm">{transaction.buyer.fullName}</p>
                          <p className="text-xs text-muted-foreground">{transaction.buyer.email}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium">Seller</p>
                          <p className="text-sm">{transaction.seller.fullName}</p>
                          <p className="text-xs text-muted-foreground">{transaction.seller.email}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Environmental Impact</h4>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        <p className="text-emerald-600 font-medium">
                          {transaction.carbonSaved?.toFixed(1) || 0}kg CO₂ saved
                        </p>
                        <p className="text-xs text-muted-foreground">Carbon footprint reduction</p>
                      </div>
                    </div>
                  </div>
                </div>

                {transaction.pickupLocation && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Pickup Details</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{transaction.pickupLocation.city}, {transaction.pickupLocation.state}</span>
                      </div>
                      {transaction.preferredPickupDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Preferred: {new Date(transaction.preferredPickupDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {transaction.actualPickupDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Actual: {new Date(transaction.actualPickupDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Ratings Section */}
                {transaction.status === 'completed' && (
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Seller Rating */}
                      <div>
                        <h5 className="font-medium mb-2">Seller Rating</h5>
                        {transaction.sellerRating ? (
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < transaction.sellerRating!.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm">({transaction.sellerRating.rating}/5)</span>
                          </div>
                        ) : canRate(transaction, 'seller') ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRatingForm({
                              ...ratingForm,
                              showForm: true,
                              transactionId: transaction._id,
                              ratingType: 'seller'
                            })}
                          >
                            Rate Seller
                          </Button>
                        ) : (
                          <p className="text-sm text-muted-foreground">No rating available</p>
                        )}
                      </div>

                      {/* Buyer Rating */}
                      <div>
                        <h5 className="font-medium mb-2">Buyer Rating</h5>
                        {transaction.buyerRating ? (
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < transaction.buyerRating!.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm">({transaction.buyerRating.rating}/5)</span>
                          </div>
                        ) : canRate(transaction, 'buyer') ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRatingForm({
                              ...ratingForm,
                              showForm: true,
                              transactionId: transaction._id,
                              ratingType: 'buyer'
                            })}
                          >
                            Rate Buyer
                          </Button>
                        ) : (
                          <p className="text-sm text-muted-foreground">No rating available</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                        <DialogDescription>
                          Complete information about this transaction
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Transaction ID</Label>
                            <p className="font-mono text-sm">{transaction._id}</p>
                          </div>
                          <div>
                            <Label>Payment Method</Label>
                            <p className="text-sm">{transaction.paymentMethod || 'Cash'}</p>
                          </div>
                        </div>
                        {/* Add more detailed information here */}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Rating Modal */}
      {ratingForm.showForm && (
        <Dialog open={ratingForm.showForm} onOpenChange={(open) => setRatingForm({...ratingForm, showForm: open})}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rate {ratingForm.ratingType === 'seller' ? 'Seller' : 'Buyer'}</DialogTitle>
              <DialogDescription>
                Share your experience with this {ratingForm.ratingType}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRating} className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${
                        star <= ratingForm.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      onClick={() => setRatingForm({...ratingForm, rating: star})}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  value={ratingForm.feedback}
                  onChange={(e) => setRatingForm({...ratingForm, feedback: e.target.value})}
                  placeholder="Share your experience..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setRatingForm({...ratingForm, showForm: false})}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Rating
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
