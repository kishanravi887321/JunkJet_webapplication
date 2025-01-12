import mongoose from "mongoose";


/// ------------------>>>>>>>>>>>>>-------------------------->>>>>>>>>>>>>>>>>>>>>>-----------------
/// this model only for the  small seller that can sell the material from his house or etc....

const addressSchema = new mongoose.Schema(
    {
        houseName: {
            type: String, // Use String type for houseName
            required: false, // Assuming houseName is optional
        },
        city: {
            type: String,
            required: true, // Marked as required
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
       
    },
    {
        timestamps: true, // Enable timestamps
        _id: false, // Disable _id for the subdocument
    }
);

// Define the Phase1 schema
const phase1Schema1 = new mongoose.Schema(
    {   phoneNumber:{
        required:true,
        type :String
    },
    /// the user sell the 
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            select: "userName email fullName", // Selecting specific fields from the User model
        },
        address: addressSchema, // Embedding address schema inside Phase1
    },
    { timestamps: true } // Enable timestamps for the main schema
);

// Create the model from the schema
const Phase1User = mongoose.model("Phase1User", phase1Schema1);

export { Phase1User };
