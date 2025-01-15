import { User } from "../models/user.models.js";
import { Product } from "../models/product.models.js";
import { Review } from "../models/reviews.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const addReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  try {
    // Find the user by their email (assuming email is stored in req.user after authentication middleware)
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      throw new ApiError(401, "Please log in first to leave a review");
    }

    // Validate the rating
    

    // Find the product by its ID
    const product = await Product.findOne({ productId });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Check if the user has already reviewed this product
    const existingReview = await Review.findOne({
      product: product._id,
      user: user._id,
    });

    if (existingReview) {
      throw new ApiError(400, "You have already reviewed this product");
    }

    // Create a new review instance
    const review = new Review({
      product: product._id,
      user: user._id, // Use email as the user identifier
      rating,
      comment,
    });

    // Save the review to the database
    const savedReview = await review.save();

    if (!savedReview) {
      throw new ApiError(500, "Error while saving the review");
    }

    // Add the review ID to the product's reviews array
    product.reviews.push(savedReview._id);
    await product.save();

    // Return a success response
    res.status(201).json({
      message: "Review added successfully",
      review: savedReview,
    });
  } catch (error) {
    // If the error is an instance of ApiError, handle it
    if (error instanceof ApiError) {
      return res.status(error.statuscode).json({ message: error.message });
    }

    // Handle other unexpected errors
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || "Something went wrong. Please try again later.",
    });
  }
});

export { addReview };
