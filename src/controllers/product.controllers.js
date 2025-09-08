import { Product } from "../models/product.models.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImage } from "../utils/cloudinary.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name,  productImage, quantity, materialType, description, price, email,tag,productId} = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Throw an instance of ApiError if the user is not found
      throw new ApiError(404, "User not found");
    }

    
    // Handle avatar upload
    let productpath = req.files?.productImage?.[0]?.path;
    let productUrl;
    console.log(productpath)
    if (productpath) {
        try {
            productUrl= await uploadImage(productpath);   // automatically delete from the local server 
           
             
        } catch (error) {
            console.error("Error uploading avatar:", error.message);
            throw new ApiError(500, "Failed to upload avatar image");
        }
    }

     


    const productData = {
        name,
        tag,
        productId,
        productImage:productUrl,
        quantity,
        materialType,
        description,
        price,
      };
      
      // Create and save the product to the database using Model.create()
     const product= await Product.create(productData);
   

    // Save the product to the database
    

    // Send success response
    return res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    // If the error is an instance of ApiError, handle it
    if (error instanceof ApiError) {
      return res.status(error.statuscode).json({l:"from ravi",
        message: error.message,
      });
    }

    // Handle any other errors as generic internal server errors
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message || "Something went wrong. Please try again later.",
    });
  }
});

/// update the product details 
const updateProduct = asyncHandler(async (req, res) => {
    
    try {
      const { productId, email, password,productImage, details } = req.body;

      
  
      // Find the user first by email
      const user = await User.findOne({ email });
      if (!user) throw new ApiError(404, "User not found");
  
      // Check for the user's password
      const isValidPassword = await user.isPasswordCorrect(password);
      if (!isValidPassword) throw new ApiError(404, "Password does not match");
  
      // Check if product exists
      const product = await Product.findOne({ productId });
      if (!product) throw new ApiError(404, "Product not found");

      let productpath = req.files?.productImage?.[0]?.path;
     let productUrl;
  
    if (productpath) {
        try {
            productUrl= await uploadImage(productpath);   // automatically delete from the local server 
           
             
        } catch (error) {
            console.error("Error uploading avatar:", error.message);
            throw new ApiError(500, "Failed to upload avatar image");
        }
    }

  
      // Update the specific details if provided, otherwise keep the original ones
      product.name = details.name || product.name;
      product.quantity = details.quantity || product.quantity;
      product.materialType = details.materialType || product.materialType;
      product.description = details.description || product.description;
      product.price = details.price || product.price;
      product.productImage = productImage || product.productImage;
  
      // Save the updated product
      await product.save();
  
      // Send success response
      return res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      // If the error is an instance of ApiError, return the error message
      if (error instanceof ApiError) {
        return res.status(error.statuscode).json({
          message: error.message,
        });
      }
  
      // Handle any other errors as generic internal server errors
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message || "Something went wrong. Please try again later.",
      });
    }
  });

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const { materialType, limit = 50, page = 1 } = req.query;
    
    // Build filter object
    const filter = {};
    if (materialType && materialType !== 'all') {
      filter.materialType = materialType;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch products with populated user data
    const products = await Product.find(filter)
      .populate('owner', 'fullName email avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProducts / parseInt(limit)),
        totalProducts,
        hasNext: skip + products.length < totalProducts,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || "Something went wrong while fetching products.",
    });
  }
});

// Get products by user email
const getUserProducts = asyncHandler(async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    
    // Find user first
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Fetch user's products
    const products = await Product.find({ owner: user._id })
      .populate('owner', 'fullName email avatar')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      message: "User products fetched successfully",
      data: products
    });
  } catch (error) {
    console.error("Error fetching user products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || "Something went wrong while fetching user products.",
    });
  }
});


  

  export {addProduct,updateProduct, getAllProducts, getUserProducts}