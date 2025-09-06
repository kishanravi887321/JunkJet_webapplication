import mongoose, { Schema } from "mongoose";

// Schema for individual waste transactions
const wasteTransactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Phase 2 user who bought the waste
        required: true
    },
    materialType: {
        type: String,
        required: true,
        enum: ["plastic", "paper", "metal", "glass", "electronic", "organic", "textile", "mixed"]
    },
    weight: {
        type: Number,
        required: true // in kg
    },
    pricePerKg: {
        type: Number,
        required: true // in INR
    },
    totalAmount: {
        type: Number,
        required: true // in INR
    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "completed"
    },
    buyerOrgName: {
        type: String,
        required: true
    },
    location: {
        city: String,
        state: String,
        country: String
    }
}, { timestamps: true });

// Schema for Phase 1 user analytics summary
const phase1AnalyticsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    totalWasteSold: {
        type: Number,
        default: 0 // in kg
    },
    totalEarnings: {
        type: Number,
        default: 0 // in INR
    },
    totalTransactions: {
        type: Number,
        default: 0
    },
    activeBuyers: [{
        buyerId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        orgName: String,
        totalPurchases: Number,
        totalAmount: Number,
        lastTransactionDate: Date
    }],
    materialStats: [{
        materialType: {
            type: String,
            enum: ["plastic", "paper", "metal", "glass", "electronic", "organic", "textile", "mixed"]
        },
        totalWeight: Number,
        totalEarnings: Number,
        transactionCount: Number,
        percentage: Number
    }],
    monthlyStats: [{
        month: Number, // 1-12
        year: Number,
        totalWeight: Number,
        totalEarnings: Number,
        transactionCount: Number
    }],
    impactScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    goals: {
        monthlyTarget: {
            type: Number,
            default: 18000 // INR
        },
        currentMonthProgress: {
            type: Number,
            default: 0
        }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Add indexes for better performance
wasteTransactionSchema.index({ user: 1, transactionDate: -1 });
wasteTransactionSchema.index({ buyer: 1, transactionDate: -1 });
wasteTransactionSchema.index({ materialType: 1 });

phase1AnalyticsSchema.index({ user: 1 });

const WasteTransaction = mongoose.model("WasteTransaction", wasteTransactionSchema);
const Phase1Analytics = mongoose.model("Phase1Analytics", phase1AnalyticsSchema);

export { WasteTransaction, Phase1Analytics };
