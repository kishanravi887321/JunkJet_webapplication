import mongoose from "mongoose";

// Address schema for storing location details
const addressSchema = new mongoose.Schema(
    {
        houseName: {
            type: String, // House name (optional)
            required: false,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        landmark: {
            type: String,
            required: true,
        },
        longitude: {
            type: Number,
            required: true, // Longitude coordinate
        },
        latitude: {
            type: Number,
            required: true, // Latitude coordinate
        },
        hexId: {
            type: String,
            required: true, // H3 index for geospatial indexing
        }
    },
    {
        timestamps: false,
        _id: false, // Disable _id for the subdocument
    }
);

// Define the Phase1 seller schema
const phase1Schema1 = new mongoose.Schema(
    {
        phoneNumber: {
            required: true,
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            select: "userName email fullName", // Selecting specific fields from User model
        },
        address: addressSchema, // Embedding address schema inside Phase1
    },
    { timestamps: true } // Enable timestamps for the main schema
);

// Create the model from the schema
const Phase1User = mongoose.model("Phase1User", phase1Schema1);

export { Phase1User };
