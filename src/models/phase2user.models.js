import mongoose from "mongoose";
const { Schema } = mongoose;

// Location schema for storing address details with multi-resolution H3 hex indexing
const locationSchema = new Schema(
    {
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, required: true },
        landmark: { type: String, required: true },
        longitude: { type: Number, required: true }, // Longitude of the location
        latitude: { type: Number, required: true }, // Latitude of the location
        
        // Store multiple H3 indexes for different resolutions (9 to 3)
        hexIds: {
            9: { type: String, required: true },
            8: { type: String, required: true },
            7: { type: String, required: true },
            6: { type: String, required: true },
            5: { type: String, required: true },
            4: { type: String, required: true },
            3: { type: String, required: true },
        }
    },
    { _id: false } // Disable _id for the subdocument
);

// Define the Phase2User schema (Organization Buyer)
const phase2Schema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        materialType: { type: String, required: true },

        orgName: { type: String, required: true },
        orgNumber: { type: String, required: true },
        orgEmail: { type: String },
        orgOwnerName: { type: String },

        location: { type: locationSchema, required: true }, // Stores address, lat/lng, hexIds

        locationUrl: { type: String, required: true }, // Google Maps URL for reference
    },
    { timestamps: true }
);

// Pre-hook to set orgOwnerName to orgName if not provided
phase2Schema.pre("save", function (next) {
    if (!this.orgOwnerName) {
        this.orgOwnerName = this.orgName;
    }
    next();
});

// Create the Phase2User model
const Phase2User = mongoose.model("Phase2User", phase2Schema);

export { Phase2User };
