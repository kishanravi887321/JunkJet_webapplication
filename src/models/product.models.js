import mongoose, { Schema } from "mongoose";

import { User } from "./user.models.js  ";

// Define the product schema
const productSchema = new Schema(
  
  {
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    name: {
      type: String,
    },
    quantity: {
      type: String, // For the purpose if we have the product in the pcs... or etc...
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      unique: true,
      lowercase:true
    },
    materialType: {
      type: String,
      required: true,
    },
    description: {
      required: true,
      type: String,
    },
    price: {
      required: true,
      type: String,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    tag: {
      type: String,
    },
  },
  { timestamps: true }
);

// Pre-save hook to handle productId generation
productSchema.pre("save", async function (next) {
    if(!this.isModified('productId'))  return next();


  try {
    // If productId is already provided, ensure it has the correct length
    if (this.productId) {
      if (this.productId.length !== 13) {
        return next(new Error("productId must be exactly 13 characters long."));
      }

      // Check if the productId already exists in the database
      const existingProduct = await mongoose.model("Product").findOne({ productId: this.productId });
      if (existingProduct) {
        return next(new Error("Try again with another productId, this one already exists in our records."));
      }

      // Skip productId generation if it's already provided
      return next();
    }

    // Generate a new productId if not provided
    const tag = this.tag || "JNK"; // Default to "JNK" if no tag is provided
    let productId;
    let isUnique = false;

    // Loop to generate a unique productId
    do {
      productId = `${tag}${nanoid(10)}`;

      // Check if the generated productId already exists in the database
      const existingProduct = await mongoose.model("Product").findOne({ productId });
      if (!existingProduct) {
        isUnique = true;
      }
    } while (!isUnique);

    this.productId = productId; // Assign the generated productId
    next();
  } catch (error) {
    return next(error); // Pass any error to the next middleware
  }
});

const Product = mongoose.model("Product", productSchema);

export { Product };
