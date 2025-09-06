import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import readline from "readline-sync";
import { getGeminiResponse } from "./chatbot_helper.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Phase1User } from "../models/phase1user.models.js";
import { Phase2User } from "../models/phase2user.models.js";
import { User } from "../models/user.models.js";

// Chatbot handler function
const chatbot = asyncHandler(async (req, res) => {
  try {
    // Get the user input from the request body
    const userInput = req.body;

    if (!userInput || typeof userInput !== "string") {
      throw new ApiError(400, "Invalid input: User input must be a non-empty string.");
    }

    // Get the Gemini response
    const response = await getGeminiResponse(userInput);

    if (!response) {
      throw new ApiError(404, "Something went wrong while processing your request.");
    }

    // If response is not "TrueFlag" or "FalseFlag", send it back directly
    if (response.trim() !== "TrueFlag1234" && response.trim() !== "FalseFlag1234") {
      return res.status(202).send(response);
    }

    // Check if user is logged in
    // const userEmail = req.user?.email || ""; // Assuming email is stored in req.user for logged-in users
    const user = await User.findOne({ email: "kishanravi887321@gmail.com" });

    if (!user) {
      throw new ApiError(404, "Login required!");
    }

    let userDetails = "";
    let users;
    
   console.log('u hitted the cahtbot route')
      
    if (response.trim() ==="TrueFlag1234") { // For Phase1User
      // Find the Phase1User associated with the logged-in user
      const phase1User = await Phase1User.findOne({ user: user._id });

      if (!phase1User) {
        throw new ApiError(404, "No Phase1User data found for the logged-in user.");
      }

      // Extract the coordinates from Phase1User
      const coordinates = phase1User.address?.coordinates?.coordinates; // GeoJSON format: [longitude, latitude]

      console.log(coordinates);

      if (!coordinates || coordinates.length !== 2) {
        throw new ApiError(400, "Invalid or missing coordinates for Phase1User.");
      }

      // Fetch nearby Phase2Users based on the coordinates
      users = await Phase2User.find({
        "location.coordinates": {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: coordinates, // [longitude, latitude]
            },
            $maxDistance: 9000, // Optional: Maximum distance in meters (e.g., 9 km)
          },
        },
      }).select(
        "location orgEmail orgName orgNumber locationUrl materialType"
      );
    }

    // console.log(users, "Nearby Users");

    // If users are found, format the details
    if (users && users.length > 0) {
      users.forEach((user) => {
        userDetails += `
          Organization Name: ${user.orgName}
          Organization Email: ${user.orgEmail}
          Organization Number: ${user.orgNumber}
          Location: ${user.location.city}, ${user.location.state}, ${user.location.country}, Pincode: ${user.location.pincode}
          Landmark: ${user.location.landmark}
          Location URL: ${user.locationUrl}
          Material Type: ${user.materialType}
          -----------------------------------
        `;
      });

      // console.log(userDetails.trim());
      
      return res.status(202).send(userDetails.trim());
    } else {
      return res.status(404).send("No users found for the given coordinates.");
    }
  } catch (error) {
    // Handle custom errors
    if (error instanceof ApiError) {
      return res.status(error.statuscode).json({ message: error.message });
    }

    // Handle unexpected errors
    console.error("Unexpected error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message || "Something went wrong. Please try again later.",
    });
  }
});

export { chatbot };
