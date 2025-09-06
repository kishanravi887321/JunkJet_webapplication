import mongoose, { Schema } from "mongoose";

// Transaction Schema for all buy/sell operations
const transactionSchema = new Schema({
    // Parties involved
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Transaction details
    transactionType: {
        type: String,
        enum: ["buy", "sell"],
        required: true
    },
    
    // Material information
    materialType: {
        type: String,
        required: true,
        enum: ["plastic", "paper", "metal", "glass", "electronic", "organic", "textile", "mixed"]
    },
    materialGrade: {
        type: String,
        enum: ["A", "B", "C", "mixed"],
        default: "B"
    },
    
    // Quantity and pricing
    weight: {
        type: Number,
        required: true,
        min: 0.1 // Minimum 100g
    },
    pricePerKg: {
        type: Number,
        required: true,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    
    // Transaction status
    status: {
        type: String,
        enum: ["pending", "confirmed", "in_progress", "completed", "cancelled", "disputed"],
        default: "pending"
    },
    
    // Location and pickup details
    pickupLocation: {
        address: String,
        city: String,
        state: String,
        country: String,
        pincode: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    
    // Timing
    preferredPickupDate: Date,
    actualPickupDate: Date,
    completionDate: Date,
    
    // Additional details
    description: String,
    images: [String], // Array of image URLs
    qualityNotes: String,
    
    // Organization details (for phase 2 users)
    buyerOrgName: String,
    buyerOrgLicense: String,
    
    // Payment details
    paymentMethod: {
        type: String,
        enum: ["cash", "upi", "bank_transfer", "wallet"],
        default: "cash"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending"
    },
    paymentDate: Date,
    
    // Ratings and feedback
    sellerRating: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        feedback: String,
        ratedAt: Date
    },
    buyerRating: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        feedback: String,
        ratedAt: Date
    },
    
    // Environmental impact
    carbonSaved: Number, // kg CO2 equivalent
    recyclingMethod: String
}, { 
    timestamps: true 
});

// Indexes for better performance
// transactionSchema.index({ seller: 1, createdAt: -1 });
// transactionSchema.index({ buyer: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ materialType: 1 });
transactionSchema.index({ 'pickupLocation.city': 1 });
transactionSchema.index({ createdAt: -1 }); // For sorting by date

// Pre-save middleware to calculate total amount
transactionSchema.pre('save', function(next) {
    if (this.weight && this.pricePerKg) {
        this.totalAmount = this.weight * this.pricePerKg;
    }
    next();
});

// Virtual for transaction age
transactionSchema.virtual('transactionAge').get(function() {
    const now = new Date();
    const diffInMs = now - this.createdAt;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays;
});

// Method to calculate environmental impact
transactionSchema.methods.calculateEnvironmentalImpact = function() {
    const impactPerKg = {
        plastic: 2.1, // kg CO2 saved per kg recycled
        paper: 1.8,
        metal: 4.2,
        glass: 0.8,
        electronic: 3.5,
        organic: 0.5,
        textile: 2.8,
        mixed: 2.0
    };
    
    this.carbonSaved = (this.weight * (impactPerKg[this.materialType] || 2.0));
    return this.carbonSaved;
};

const Transaction = mongoose.model("Transaction", transactionSchema);

export { Transaction };
