import { Phase2User } from "../models/phase2user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import validator from "validator";
import h3 from "h3-js"; // Import h3-js for H3 indexing

const setDetailsOfPhase2User = asyncHandler(async (req, res) => {
    const { email, materialType, orgName, orgNumber, orgEmail, orgOwnerName, location, locationUrl } = req.body;

    try {
        // Validate email
        if (!orgEmail || !validator.isEmail(orgEmail)) {
            throw new ApiError(400, "Please provide a valid organization email.");
        }

        // Validate phone number
        if (!orgNumber || !validator.isMobilePhone(orgNumber, "any", { strictMode: false })) {
            throw new ApiError(400, "Please provide a valid phone number.");
        }

        // Validate required location fields
        if (!location || !location.city || !location.state || !location.country || !location.pincode || !location.landmark) {
            throw new ApiError(400, "All location fields (city, state, country, pincode, landmark) are required.");
        }

        // Validate coordinates
        if (location.latitude === undefined || location.longitude === undefined) {
            throw new ApiError(400, "Latitude and longitude are required.");
        }
        const { latitude, longitude } = location;

        if (
            !validator.isFloat(String(latitude), { min: -90, max: 90 }) ||
            !validator.isFloat(String(longitude), { min: -180, max: 180 })
        ) {
            throw new ApiError(400, "Invalid latitude or longitude values.");
        }

        // Generate hex IDs for resolutions 9 to 3
        const resolutions = [9, 8, 7, 6, 5, 4, 3];
        let hexIds = {};

        resolutions.forEach(res => {
            hexIds[res] = h3.latLngToCell(latitude, longitude, res);
        });

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User not found.");
        }

        // Trim and convert materialType to lowercase
        const formattedMaterialType = materialType ? materialType.trim().toLowerCase() : "";

        // Create or update Phase2User
        const phase2User = await Phase2User.findOneAndUpdate(
            { user: user._id },
            {
                materialType: formattedMaterialType,
                orgEmail,
                orgName,
                orgNumber,
                orgOwnerName: orgOwnerName || orgName, // Default to orgName if not provided
                location: {
                    city: location.city,
                    state: location.state,
                    country: location.country,
                    pincode: location.pincode,
                    landmark: location.landmark,
                    latitude,
                    longitude,
                    hexIds, // Store multiple hex IDs
                },
                locationUrl,
            },
            { new: true, upsert: true }
        );

        if (!phase2User) {
            throw new ApiError(500, "Failed to update Phase2User.");
        }
        user.isPhase2User = true;
        await user.save();

        return res.status(200).json({
            message: "Phase2User details updated successfully.",
            data: phase2User,
        });
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            error: "Something went wrong. Please try again later.",
        });
    }
});

export { setDetailsOfPhase2User };
