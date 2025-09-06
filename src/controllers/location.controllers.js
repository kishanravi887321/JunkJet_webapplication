import { findPhase2Buyers } from "../services/location.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import validator from "validator";

// Controller to handle POST /location/finduser
const findBuyer = asyncHandler(async (req, res) => {
    // Step 1: Extract email, materialType, and rangeKm from req.body
    let { email, materialType, rangeKm } = req.body;
    console.log(rangeKm)

    const x = materialType ? materialType.trim().toLowerCase() : "";
    materialType=x

    console.log(materialType)
    // materialType=materialType.trim().isLower

    // Step 2: Validate the inputs
    if (!email || !validator.isEmail(email)) {
        throw new ApiError(400, "Please provide a valid email.");
    }
    if (!materialType || typeof materialType !== "string") {
        throw new ApiError(400, "Material type is required and must be a string.");
    }
    if (!rangeKm || typeof rangeKm !== "string") {
        throw new ApiError(400, "Range is required and must be a string (e.g., '1-5 km').");
    }

    // Step 3: Determine maxDistanceKm based on rangeKm
    let maxDistanceKm;
const [minKmStr, maxKmStr] = rangeKm.split('-'); // Split into ["30", "50 km"]
console.log("Split result:", minKmStr, maxKmStr);

// Remove " km" suffix and convert to numbers
const minKm = Number(minKmStr.trim());
const maxKm = Number(maxKmStr.replace(' km', '').trim());
console.log("minKm:", minKm, "maxKm:", maxKm);

if (maxKm>101) {
    maxDistanceKm = maxKm;
} else {
    maxDistanceKm = 2000; // Default value if maxKm is NaN or undefined
}

    // Step 4: Call findPhase2Buyers with the extracted and calculated values
    const users = await findPhase2Buyers(
        email,          // Pass the email string
        materialType,   // Pass the materialType string
        10,             // maxResults (default 10 as per your function)
        maxDistanceKm   // Dynamic maxDistanceKm based on rangeKm
    );

    // Step 5: Send the response
    if (!users || users.length === 0) {
        return res.status(405).json({
            success: false,
            message: "No matching users found.",
            matches: [],
        });
    }
    console.log(users,"users found")

    return res.status(200).json({
        success: true,
        message: "User found successfully.",
        matches: users, // Return the array of matches
    });
});

export { findBuyer };