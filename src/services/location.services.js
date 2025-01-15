import { Phase2User } from "../models/phase2user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// --------------->>>>>>>>>>>-------------->>>>>>>>>>>>>>>>>>>>--------------------
const findUserByLocation = asyncHandler(async (pincode) => {
    // Extract pincode from the request body

    // Find users (shops or organizations) based on the pincode
    const users = await Phase2User.find({ "location.pincode": pincode });

    // If no users are found, send a meaningful response
    console.log("the user is ",users)
    // Return the list of users to the API caller
    return users
    });


export { findUserByLocation };
