import { generateSampleData } from "../utils/sampleDataGenerator.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Test endpoint to generate sample analytics data
const generateTestData = asyncHandler(async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            throw new ApiError(400, "User email is required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const transactions = await generateSampleData(email);

        return res.status(200).json(
            new ApiResponse(200, { transactionCount: transactions.length }, "Sample data generated successfully")
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

export { generateTestData };
