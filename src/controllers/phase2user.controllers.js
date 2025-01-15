import { Phase2User } from "../models/phase2user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import  validator from "validator";


const setDetailsOfPhase2User = asyncHandler(async (req, res, next) => {
    const { email, materialType, orgName, orgNumber, orgEmail, orgOwnerName, location ,locationUrl} = req.body;

    try {

            if(!validator.isEmail(orgEmail)){
                throw new ApiError(404,"plzz write the valid email .....")
            }
            if (!orgNumber || !validator.isMobilePhone(orgNumber,'any',{strictMode:false })){
                throw  new ApiError(404,"plzz write the valid Number ..")
            }


        // Find the user details from the User model; check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(400, "User not found...");
        }

        // If the user exists, create or update the details about the organization
        const phase2User = await Phase2User.findOneAndUpdate(
            { user: user._id },
            {
                materialType,
                orgEmail,
                orgName,
                orgNumber,
                location: {
                    city: location.city,
                    state: location.state,
                    country: location.country,
                    pincode: location.pincode,
                    landmark: location.landmark
                },
                locationUrl
            },
            { new: true,upsert:true } // Ensures that the updated document is returned
        );

        // If no Phase2User found or updated
        if (!phase2User) {
            throw new ApiError(404, "Phase2User not found or could not be updated");
        }

        // Return a success response
        return res.status(200).json({
            message: "Phase2User details updated successfully",
            data: phase2User
        });

    } catch (error) {
        // If the error is an instance of ApiError, send the error response with the status code and message
        if (error instanceof ApiError) {
            return res.status(error.statuscode).json({
                message: error.message,
            });
        }

        // If it's any other error, send a generic error message
        return res.status(500).json({
            message: "Internal Server Error",
            error: "Something went wrong. Please try again later.", // Return a generic message
        });
    }
});

export { setDetailsOfPhase2User };
