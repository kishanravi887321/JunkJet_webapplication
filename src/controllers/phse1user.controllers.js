import { Phase1User } from "../models/phase1user.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import validator from "validator";

// Create a new Phase1 document with user and address
const phase1UserAddress = asyncHandler(async (req, res) => {
    const { houseName, country, pincode, landmark, state, city, phoneNumber } = req.body;

    try {
        // Validate required fields
        if (!houseName || !country || !pincode || !landmark || !state) {
            throw new ApiError(400, "All fields are required.");
        }

        // Validate phone number format (e.g., checking if it contains only digits)
        if (!phoneNumber || !validator.isMobilePhone(phoneNumber, 'any', { strictMode: false })) {
            throw new ApiError(400, "Invalid phone number format.");
        }

        // Find the user by email
        const user = await User.findOne({ email: "c@gmail.com" });

        if (!user) {
            throw new ApiError(404, "User does not exist.");
        }

        // Create a new Phase1User document or update the existing one
        const phase1User = await Phase1User.findOneAndUpdate(
            { user: user._id },
            {
                phoneNumber,
                user: user._id,
                address: {
                    houseName,
                    country,
                    pincode,
                    landmark,
                    state,
                    city
                },
            },
            { new: true, upsert: true } // Returns updated document if exists or creates a new one
        );

        // Respond with success
        return res.status(201).json({
            message: "Phase1User document created/updated successfully.",
            data: phase1User,
        });

    } catch (error) {
        // If the error is an instance of ApiError, send the error response with the status code and message
        if (error instanceof ApiError) {
            return res.status(error.statuscode).json({
                message: error.message, // Send clean message from ApiError
            });
        }

        // If it's any other error, send a generic error message
        return res.status(500).json({
            message: "Internal Server Error",
            error: "Something went wrong. Please try again later.", // Return a generic message
        });
    }
});

export { phase1UserAddress };
