    import mongoose from "mongoose";

    const { Schema } = mongoose;

    // Helper schema for the location with coordinates
    const locationSchema = new mongoose.Schema(
        {
            city: {
                type: String,
                required: true, // Required
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
            coordinates: {
                type: {
                    type: String,
                    enum: ["Point"], // GeoJSON type must be "Point"
                    required: true,
                    default: "Point",
                },
                coordinates: {
                    type: [Number], // Array for [longitude, latitude]
                    required: true,
                },
            },
        },
        {
            _id: false, // Disable _id for the subdocument
        }
    );

    // Add 2dsphere index for geospatial queries
    locationSchema.index({ coordinates: "2dsphere" });

    // Define the Phase2User schema
    const phase2Schema = new Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true, // Ensure the user field is always provided
            },

            materialType: {
                type: String,
                required: true, // Ensure materialType is provided
            },

            // Organization name that buys the waste
            orgName: {
                required: true,
                type: String,
            },

            orgNumber: {
                required: true,
                type: String,
            },

            // Specific email for the organization (if any)
            orgEmail: {
                type: String,
            },

            orgOwnerName: {
                type: String,
            },

            // Location for the organization
            location: {
                type: locationSchema,
                required: true,
            },

            locationUrl: {
                type: String,
                required: true, // Reason: The organization/shop must have a Google Map URL
            },
        },
        { timestamps: true } // Automatically adds createdAt and updatedAt fields
    );

    // Pre-hook to set orgOwnerName to orgName if not provided
    phase2Schema.pre("save", function (next) {
        if (!this.orgOwnerName) {
            this.orgOwnerName = this.orgName;
        }
        next();
    });

    // Create the Phase2User model from the schema
    const Phase2User = mongoose.model("Phase2User", phase2Schema);

    export { Phase2User };
