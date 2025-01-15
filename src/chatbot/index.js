import dotenv from "dotenv";
dotenv.config({
  path: "../../.env",
});

import readline from "readline-sync";
import { getGeminiResponse } from './chatbot_helper.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Phase2User } from "../models/phase2user.models.js";

// Chatbot handler function with try-catch for error handling
const chatbot = asyncHandler(async (req, res) => {
  try {
    // Get the user input from the request body
    const userInput = req.body;
    console.log(userInput);

    // Call the function to get the Gemini response
    const response = await getGeminiResponse(userInput);

    // If no response is received, throw an ApiError
    if (!response) {
      throw new ApiError(404, "Something went wrong..");
    }

    // Extract flag and pincode
    const { flag, pincode } = extractFlagAndPinCode(response) || {};

    if (!flag || !pincode) {
      return res.status(202).send(response);
    }

    let users;
    let userDetails = "";

    console.log(flag);

    if (flag === "Flag1234") {
      // Find users with the specific pincode
      users = await Phase2User.find({ "location.pincode": pincode }).select(
        "location orgEmail orgName orgNumber locationUrl materialType"
      );
    }

    // Check if users were found and send the response
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
      res.status(202).send(userDetails.trim());
    } else {
      res.status(404).send("No users found for the given pincode.");
    }
  } catch (error) {
    // Catch any error and handle it using ApiError
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    // Handle unexpected errors (internal server errors)
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message || "Something went wrong. Please try again later.",
    });
  }
});

// Extract Flag and Pincode from input
function extractFlagAndPinCode(input) {
  if (!input || typeof input !== "string") {
    console.error("Input must be a valid string.");
    return null;
  }

  // Match the pattern for "Flag" followed by numbers, then a hyphen, and then numbers
  const match = input.match(/(Flag\d+)-(\d+)/);

  if (match) {
    const flag = match[1]; // Extracts 'Flag1234'
    const pincode = match[2]; // Extracts '843126'
    return { flag, pincode };
  } else {
    console.error("Input does not match the expected format.");
    return null;
  }
}

export { chatbot };
