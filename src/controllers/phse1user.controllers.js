import { Phase1User } from "../models/phase1user.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import validator from "validator";

// Create a new Phase1 document with user and address
const phase1UserAddress = asyncHandler(async (req, res) => {
    const { houseName, country, pincode, landmark, state, city, phoneNumber, latitude, longitude } = req.body;

    try {
        // Validate required fields
        if (!houseName || !country || !pincode || !landmark || !state || !city) {
            throw new ApiError(400, "All fields are required.");
        }

        // Validate phone number format
        if (!phoneNumber || !validator.isMobilePhone(phoneNumber, "any", { strictMode: false })) {
            throw new ApiError(400, "Invalid phone number format.");
        }

        // Validate coordinates
        if (latitude === undefined || longitude === undefined) {
            throw new ApiError(400, "Latitude and longitude are required.");
        }

        if (!validator.isFloat(String(latitude), { min: -90, max: 90 }) ||
            !validator.isFloat(String(longitude), { min: -180, max: 180 })) {
            throw new ApiError(400, "Invalid latitude or longitude values.");
        }

        // Find the user by email
        const user = await User.findOne({ email :"xyz@gmail.com"  });

        if (!user) {
            throw new ApiError(404, "User does not exist.");
        }

        // Create or update the Phase1User document
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
                    city,
                    coordinates: {
                        type: "Point",
                        coordinates: [longitude, latitude], // GeoJSON format: [longitude, latitude]
                    },
                },
            },
            { new: true, upsert: true } // Returns the updated document if it exists or creates a new one
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
