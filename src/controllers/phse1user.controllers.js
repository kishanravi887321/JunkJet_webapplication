import { Phase1User } from "../models/phase1user.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import validator from "validator";
import h3 from "h3-js"; // Import h3-js for hexId calculation

// Create or update a Phase1 document with user and address
const phase1UserAddress = asyncHandler(async (req, res) => {
    const { houseName, country, pincode, landmark, state, city, phoneNumber, latitude, longitude, email } = req.body;

    try {
        // Validate required fields
        if (!country || !pincode || !landmark || !state || !city) {
            throw new ApiError(400, "All address fields (except houseName) are required.");
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

        // Validate email and find the user
        if (!email || !validator.isEmail(email)) {
            throw new ApiError(400, "Valid email is required.");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User does not exist.");
        }

        // Calculate hexId using h3-js (resolution 9 as default)
        const hexId = h3.latLngToCell(latitude, longitude, 9);

        // Create or update the Phase1User document
        const phase1User = await Phase1User.findOneAndUpdate(
            { user: user._id },
            {
                phoneNumber,
                user: user._id,
                address: {
                    houseName: houseName || "", // Optional field
                    country,
                    pincode,
                    landmark,
                    state,
                    city,
                    longitude,
                    latitude,
                    hexId
                },
            },
            { new: true, upsert: true } // Return updated doc or create new
        );

        // Respond with success
        return res.status(201).json({
            message: "Phase1User document created/updated successfully.",
            data: phase1User,
        });

    } catch (error) {
        // Handle ApiError instances
        if (error instanceof ApiError) {
            return res.status(error.statuscode).json({
                message: error.message,
            });
        }

        // Handle other errors
        return res.status(500).json({
            message: "Internal Server Error",
            error: "Something went wrong. Please try again later.",
        });
    }
});

export { phase1UserAddress };