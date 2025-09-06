import { Transaction } from "../models/transaction.models.js";
import { WasteTransaction, Phase1Analytics } from "../models/analytics.models.js";
import { User } from "../models/user.models.js";
import { updateUserAnalytics } from "./analytics.controllers.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new buy/sell transaction
const createTransaction = asyncHandler(async (req, res) => {
    try {
        const {
            buyerEmail,
            sellerEmail,
            transactionType,
            materialType,
            materialGrade,
            weight,
            pricePerKg,
            description,
            pickupLocation,
            preferredPickupDate,
            paymentMethod,
            buyerOrgName,
            images
        } = req.body;

        // Find seller and buyer
        const seller = await User.findOne({ email: sellerEmail });
        const buyer = await User.findOne({ email: buyerEmail });

        if (!seller || !buyer) {
            throw new ApiError(404, "Seller or buyer not found");
        }

        // Create transaction
        const transaction = new Transaction({
            seller: seller._id,
            buyer: buyer._id,
            transactionType,
            materialType,
            materialGrade: materialGrade || "B",
            weight,
            pricePerKg,
            description,
            pickupLocation,
            preferredPickupDate: preferredPickupDate ? new Date(preferredPickupDate) : undefined,
            paymentMethod: paymentMethod || "cash",
            buyerOrgName,
            images: images || []
        });

        // Calculate environmental impact
        transaction.calculateEnvironmentalImpact();

        await transaction.save();

        // Create corresponding analytics transaction
        const wasteTransaction = new WasteTransaction({
            user: seller._id,
            buyer: buyer._id,
            materialType,
            weight,
            pricePerKg,
            totalAmount: transaction.totalAmount,
            buyerOrgName: buyerOrgName || buyer.fullName,
            location: {
                city: pickupLocation?.city,
                state: pickupLocation?.state,
                country: pickupLocation?.country
            }
        });

        await wasteTransaction.save();

        // Update analytics for seller
        await updateUserAnalytics(seller._id);

        // Populate the response
        await transaction.populate('seller', 'fullName email avatar');
        await transaction.populate('buyer', 'fullName email avatar');

        return res.status(201).json(
            new ApiResponse(201, transaction, "Transaction created successfully")
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

// Get user transactions (both buying and selling)
const getUserTransactions = asyncHandler(async (req, res) => {
    try {
        const { email, type, status, page = 1, limit = 10 } = req.query;

        if (!email) {
            throw new ApiError(400, "User email is required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Build query
        let query = {
            $or: [
                { seller: user._id },
                { buyer: user._id }
            ]
        };

        if (type) {
            query.transactionType = type;
        }

        if (status) {
            query.status = status;
        }

        // Pagination
        const skip = (page - 1) * limit;

        const transactions = await Transaction.find(query)
            .populate('seller', 'fullName email avatar')
            .populate('buyer', 'fullName email avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Transaction.countDocuments(query);

        return res.status(200).json(
            new ApiResponse(200, {
                transactions,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalTransactions: total,
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            }, "Transactions retrieved successfully")
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

// Update transaction status
const updateTransactionStatus = asyncHandler(async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { status, paymentStatus, actualPickupDate, qualityNotes } = req.body;
        const userEmail = req.body.email || req.user?.email;

        if (!userEmail) {
            throw new ApiError(400, "User email is required");
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            throw new ApiError(404, "Transaction not found");
        }

        // Check if user is involved in this transaction
        if (!transaction.seller.equals(user._id) && !transaction.buyer.equals(user._id)) {
            throw new ApiError(403, "Not authorized to update this transaction");
        }

        // Update fields
        if (status) transaction.status = status;
        if (paymentStatus) transaction.paymentStatus = paymentStatus;
        if (actualPickupDate) transaction.actualPickupDate = new Date(actualPickupDate);
        if (qualityNotes) transaction.qualityNotes = qualityNotes;

        if (status === 'completed') {
            transaction.completionDate = new Date();
            if (paymentStatus !== 'paid') {
                transaction.paymentStatus = 'paid';
                transaction.paymentDate = new Date();
            }
        }

        await transaction.save();

        await transaction.populate('seller', 'fullName email avatar');
        await transaction.populate('buyer', 'fullName email avatar');

        return res.status(200).json(
            new ApiResponse(200, transaction, "Transaction updated successfully")
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

// Add rating and feedback
const addTransactionRating = asyncHandler(async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { rating, feedback, raterType } = req.body; // raterType: 'seller' or 'buyer'
        const userEmail = req.body.email || req.user?.email;

        if (!userEmail) {
            throw new ApiError(400, "User email is required");
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            throw new ApiError(404, "Transaction not found");
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new ApiError(400, "Rating must be between 1 and 5");
        }

        // Check if user can rate (must be completed transaction)
        if (transaction.status !== 'completed') {
            throw new ApiError(400, "Can only rate completed transactions");
        }

        // Add rating based on user role
        if (raterType === 'seller' && transaction.seller.equals(user._id)) {
            transaction.sellerRating = {
                rating,
                feedback: feedback || "",
                ratedAt: new Date()
            };
        } else if (raterType === 'buyer' && transaction.buyer.equals(user._id)) {
            transaction.buyerRating = {
                rating,
                feedback: feedback || "",
                ratedAt: new Date()
            };
        } else {
            throw new ApiError(403, "Not authorized to rate this transaction");
        }

        await transaction.save();

        return res.status(200).json(
            new ApiResponse(200, transaction, "Rating added successfully")
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

// Get transaction analytics for dashboard
const getTransactionAnalytics = asyncHandler(async (req, res) => {
    try {
        const { email, period = "month" } = req.query;

        if (!email) {
            throw new ApiError(400, "User email is required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Calculate date range
        const now = new Date();
        let startDate;
        
        switch(period) {
            case "week":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "month":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "year":
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Get transactions in date range
        const transactions = await Transaction.find({
            $or: [
                { seller: user._id },
                { buyer: user._id }
            ],
            createdAt: { $gte: startDate }
        });

        // Calculate analytics
        const selling = transactions.filter(t => t.seller.equals(user._id));
        const buying = transactions.filter(t => t.buyer.equals(user._id));

        const analytics = {
            period,
            selling: {
                count: selling.length,
                totalValue: selling.reduce((sum, t) => sum + t.totalAmount, 0),
                totalWeight: selling.reduce((sum, t) => sum + t.weight, 0),
                avgPrice: selling.length > 0 ? selling.reduce((sum, t) => sum + t.pricePerKg, 0) / selling.length : 0,
                completedCount: selling.filter(t => t.status === 'completed').length
            },
            buying: {
                count: buying.length,
                totalValue: buying.reduce((sum, t) => sum + t.totalAmount, 0),
                totalWeight: buying.reduce((sum, t) => sum + t.weight, 0),
                avgPrice: buying.length > 0 ? buying.reduce((sum, t) => sum + t.pricePerKg, 0) / buying.length : 0,
                completedCount: buying.filter(t => t.status === 'completed').length
            },
            environmental: {
                totalCarbonSaved: transactions.reduce((sum, t) => sum + (t.carbonSaved || 0), 0),
                materialsRecycled: [...new Set(transactions.map(t => t.materialType))].length
            }
        };

        return res.status(200).json(
            new ApiResponse(200, analytics, "Transaction analytics retrieved successfully")
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
    createTransaction,
    getUserTransactions,
    updateTransactionStatus,
    addTransactionRating,
    getTransactionAnalytics
};
