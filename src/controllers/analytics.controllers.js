import { WasteTransaction, Phase1Analytics } from "../models/analytics.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Helper function to calculate impact score
const calculateImpactScore = (totalWeight, totalTransactions, uniqueBuyers) => {
    const weightScore = Math.min((totalWeight / 100) * 30, 30); // Max 30 points for 100kg+
    const transactionScore = Math.min((totalTransactions / 20) * 40, 40); // Max 40 points for 20+ transactions
    const buyerScore = Math.min((uniqueBuyers / 5) * 30, 30); // Max 30 points for 5+ unique buyers
    
    return Math.round(weightScore + transactionScore + buyerScore);
};

// Update analytics data for a user
const updateUserAnalytics = async (userId) => {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        // Get all transactions for the user
        const transactions = await WasteTransaction.find({ user: userId });
        
        if (transactions.length === 0) {
            return await Phase1Analytics.findOneAndUpdate(
                { user: userId },
                { 
                    user: userId,
                    totalWasteSold: 0,
                    totalEarnings: 0,
                    totalTransactions: 0,
                    impactScore: 0,
                    lastUpdated: new Date()
                },
                { upsert: true, new: true }
            );
        }

        // Calculate totals
        const totalWasteSold = transactions.reduce((sum, t) => sum + t.weight, 0);
        const totalEarnings = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
        const totalTransactions = transactions.length;

        // Calculate active buyers
        const buyerMap = new Map();
        transactions.forEach(t => {
            const buyerId = t.buyer.toString();
            if (!buyerMap.has(buyerId)) {
                buyerMap.set(buyerId, {
                    buyerId: t.buyer,
                    orgName: t.buyerOrgName,
                    totalPurchases: 0,
                    totalAmount: 0,
                    lastTransactionDate: t.transactionDate
                });
            }
            const buyer = buyerMap.get(buyerId);
            buyer.totalPurchases += 1;
            buyer.totalAmount += t.totalAmount;
            if (t.transactionDate > buyer.lastTransactionDate) {
                buyer.lastTransactionDate = t.transactionDate;
            }
        });
        const activeBuyers = Array.from(buyerMap.values());

        // Calculate material stats
        const materialMap = new Map();
        transactions.forEach(t => {
            if (!materialMap.has(t.materialType)) {
                materialMap.set(t.materialType, {
                    materialType: t.materialType,
                    totalWeight: 0,
                    totalEarnings: 0,
                    transactionCount: 0,
                    percentage: 0
                });
            }
            const material = materialMap.get(t.materialType);
            material.totalWeight += t.weight;
            material.totalEarnings += t.totalAmount;
            material.transactionCount += 1;
        });

        // Calculate percentages
        materialMap.forEach(material => {
            material.percentage = Math.round((material.totalWeight / totalWasteSold) * 100);
        });
        const materialStats = Array.from(materialMap.values());

        // Calculate monthly stats for last 12 months
        const monthlyStats = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - 1 - i, 1);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            
            const monthTransactions = transactions.filter(t => {
                const tDate = new Date(t.transactionDate);
                return tDate.getMonth() + 1 === month && tDate.getFullYear() === year;
            });

            monthlyStats.push({
                month,
                year,
                totalWeight: monthTransactions.reduce((sum, t) => sum + t.weight, 0),
                totalEarnings: monthTransactions.reduce((sum, t) => sum + t.totalAmount, 0),
                transactionCount: monthTransactions.length
            });
        }

        // Calculate current month progress
        const currentMonthTransactions = transactions.filter(t => {
            const tDate = new Date(t.transactionDate);
            return tDate.getMonth() + 1 === currentMonth && tDate.getFullYear() === currentYear;
        });
        const currentMonthProgress = currentMonthTransactions.reduce((sum, t) => sum + t.totalAmount, 0);

        // Calculate impact score
        const impactScore = calculateImpactScore(totalWasteSold, totalTransactions, activeBuyers.length);

        // Update or create analytics record
        const analytics = await Phase1Analytics.findOneAndUpdate(
            { user: userId },
            {
                user: userId,
                totalWasteSold,
                totalEarnings,
                totalTransactions,
                activeBuyers,
                materialStats,
                monthlyStats,
                impactScore,
                goals: {
                    monthlyTarget: 18000,
                    currentMonthProgress
                },
                lastUpdated: new Date()
            },
            { upsert: true, new: true }
        );

        return analytics;
    } catch (error) {
        console.error("Error updating analytics:", error);
        throw error;
    }
};

// Add a new waste transaction
const addWasteTransaction = asyncHandler(async (req, res) => {
    try {
        const {
            buyerEmail,
            materialType,
            weight,
            pricePerKg,
            buyerOrgName,
            location
        } = req.body;

        const userEmail = req.body.email || req.user?.email;
        
        if (!userEmail) {
            throw new ApiError(400, "User email is required");
        }

        // Find the seller (Phase 1 user)
        const seller = await User.findOne({ email: userEmail });
        if (!seller) {
            throw new ApiError(404, "Seller not found");
        }

        // Find the buyer (Phase 2 user)
        const buyer = await User.findOne({ email: buyerEmail });
        if (!buyer) {
            throw new ApiError(404, "Buyer not found");
        }

        const totalAmount = weight * pricePerKg;

        // Create the transaction
        const transaction = new WasteTransaction({
            user: seller._id,
            buyer: buyer._id,
            materialType,
            weight,
            pricePerKg,
            totalAmount,
            buyerOrgName,
            location
        });

        await transaction.save();

        // Update analytics for the seller
        await updateUserAnalytics(seller._id);

        return res.status(201).json(
            new ApiResponse(201, transaction, "Waste transaction added successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statuscode).json({
                message: error.message,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

// Get analytics summary
const getAnalyticsSummary = asyncHandler(async (req, res) => {
    try {
        const userEmail = req.query.email || req.user?.email;
        
        if (!userEmail) {
            throw new ApiError(400, "User email is required");
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // First try to get existing analytics data
        let analytics = await Phase1Analytics.findOne({ user: user._id });
        
        // If no analytics exist, create empty one
        if (!analytics) {
            analytics = await Phase1Analytics.findOneAndUpdate(
                { user: user._id },
                { 
                    user: user._id,
                    totalWasteSold: 0,
                    totalEarnings: 0,
                    totalTransactions: 0,
                    impactScore: 0,
                    activeBuyers: [],
                    materialStats: [],
                    monthlyStats: [],
                    lastUpdated: new Date()
                },
                { upsert: true, new: true }
            );
        }

        const summary = {
            totalWasteSold: (analytics.totalWasteSold / 1000).toFixed(1), // Convert to K kg
            totalEarnings: `₹${analytics.totalEarnings.toLocaleString('en-IN')}`,
            activeBuyers: analytics.activeBuyers.length,
            impactScore: analytics.impactScore,
            growthRate: 15.8, // This would be calculated based on previous period
            efficiencyGain: 8.2 // This would be calculated based on performance metrics
        };

        return res.status(200).json(
            new ApiResponse(200, summary, "Analytics summary retrieved successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statuscode).json({
                message: error.message,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

// Get waste trend data
const getWasteTrend = asyncHandler(async (req, res) => {
    try {
        const userEmail = req.query.email || req.user?.email;
        
        if (!userEmail) {
            throw new ApiError(400, "User email is required");
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const analytics = await Phase1Analytics.findOne({ user: user._id });
        if (!analytics) {
            return res.status(200).json(
                new ApiResponse(200, [], "No analytics data found")
            );
        }

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const wasteTrendData = analytics.monthlyStats.slice(-6).map(stat => ({
            month: monthNames[stat.month - 1],
            weight: stat.totalWeight,
            earnings: stat.totalEarnings
        }));

        return res.status(200).json(
            new ApiResponse(200, wasteTrendData, "Waste trend data retrieved successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statuscode).json({
                message: error.message,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

// Get material distribution
const getMaterialDistribution = asyncHandler(async (req, res) => {
    try {
        const userEmail = req.query.email || req.user?.email;
        
        if (!userEmail) {
            throw new ApiError(400, "User email is required");
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const analytics = await Phase1Analytics.findOne({ user: user._id });
        if (!analytics) {
            return res.status(200).json(
                new ApiResponse(200, [], "No analytics data found")
            );
        }

        const colors = {
            plastic: "#22c55e",
            paper: "#84cc16",
            metal: "#3b82f6",
            glass: "#f97316",
            electronic: "#8b5cf6",
            organic: "#06b6d4",
            textile: "#f59e0b",
            mixed: "#6b7280"
        };

        const materialData = analytics.materialStats.map(stat => ({
            name: stat.materialType.charAt(0).toUpperCase() + stat.materialType.slice(1),
            value: stat.percentage,
            color: colors[stat.materialType] || "#6b7280"
        }));

        return res.status(200).json(
            new ApiResponse(200, materialData, "Material distribution retrieved successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statuscode).json({
                message: error.message,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

// Get buyer performance
const getBuyerPerformance = asyncHandler(async (req, res) => {
    try {
        const userEmail = req.query.email || req.user?.email;
        
        if (!userEmail) {
            throw new ApiError(400, "User email is required");
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const analytics = await Phase1Analytics.findOne({ user: user._id });
        if (!analytics) {
            return res.status(200).json(
                new ApiResponse(200, [], "No analytics data found")
            );
        }

        const buyerPerformanceData = analytics.activeBuyers
            .sort((a, b) => b.totalAmount - a.totalAmount)
            .slice(0, 5)
            .map(buyer => ({
                name: buyer.orgName,
                purchases: buyer.totalPurchases,
                amount: buyer.totalAmount
            }));

        return res.status(200).json(
            new ApiResponse(200, buyerPerformanceData, "Buyer performance retrieved successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statuscode).json({
                message: error.message,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

// Get monthly earnings trend
const getEarningsTrend = asyncHandler(async (req, res) => {
    try {
        const userEmail = req.query.email || req.user?.email;
        
        if (!userEmail) {
            throw new ApiError(400, "User email is required");
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const analytics = await Phase1Analytics.findOne({ user: user._id });
        if (!analytics) {
            return res.status(200).json(
                new ApiResponse(200, [], "No analytics data found")
            );
        }

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const earningsTrendData = analytics.monthlyStats.slice(-6).map(stat => ({
            month: monthNames[stat.month - 1],
            amount: stat.totalEarnings
        }));

        return res.status(200).json(
            new ApiResponse(200, earningsTrendData, "Earnings trend retrieved successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statuscode).json({
                message: error.message,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

export {
    addWasteTransaction,
    getAnalyticsSummary,
    getWasteTrend,
    getMaterialDistribution,
    getBuyerPerformance,
    getEarningsTrend,
    updateUserAnalytics
};
