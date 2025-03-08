import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validator from "validator";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadImage, deleteFile } from "../utils/cloudinary.js";
import bcrypt from "bcrypt"
import dotenv from "dotenv";

dotenv.config({
    path:"../../.env"
})

///  register user contoller 

const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, password, avatar, coverImage, fullName } = req.body;

    // Check for empty fields
    if ([fullName, email, userName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if(!validator.isEmail(email)){
        throw  new ApiError(202,"plzz write the valid email")
    }
    // if(!validator.isStrongPassword(password)){
    //     throw  new ApiError(202,"plzz write the strong password")
    // }

    // Check if the user already exists
    const existUser = await User.findOne({
        $or: [{ userName }, { email }]
    });
    if (existUser) {
         console.log("hekjansd")
        return res.status(409).json(new ApiResponse(409,null,"user already exist !!")) // Conflict status code
    }

    // Handle avatar upload
    let avatarLocalPath = req.files?.avatar?.[0]?.path;
    let avatarUrl;
    if (avatarLocalPath) {
        try {
            avatarUrl = await uploadImage(avatarLocalPath);
            // await deleteFile(avatarLocalPath); // Ensure the local file is deleted
        } catch (error) {
            console.error("Error uploading avatar:", error.message);
            throw new ApiError(500, "Failed to upload avatar image");
        }
    }

    // Handle cover image upload
    let coverImageLocalPath;
    let coverImageUrl;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
        try {
            coverImageUrl = await uploadImage(coverImageLocalPath);
             // Ensure the local file is deleted
        } catch (error) {
            console.error("Error uploading cover image:", error.message);
            throw new ApiError(500, "Failed to upload cover image");
        }
    }

    // Create the user
    const createdUserEntry = await User.create({
        email,
        fullName,
        password,
        avatar: avatarUrl , // Default avatar
        userName,
        coverImage: coverImageUrl // Default cover image
    });

    // Retrieve the newly created user without sensitive fields
    const createdUser = await User.findById(createdUserEntry._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Return the response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});


///  login user controller 

const userLogin=asyncHandler( async (req,res) =>{

    // ---------steps-------
    // req-->>email,pass
    const {email,password}=req.body

    if(!email &&!password){
        throw new ApiError(404,"plzz write the valid input ")
    }

    const user= await   User.findOne({email})

    if(!user )  throw new ApiError('user not found ')

   

    const isValidPassword= await  user.isPasswordCorrect(password)
    if(!isValidPassword) throw new ApiError(404,"plzz try with correct Paassword")

    //  generate the access and refresh token
    const accessToken=  user.generateAccessToken(user._id)
    console.log(accessToken,"generateToken","login successful")

    const userLoggedIn= await  User.findById(user._id).select("-password -refreshToke")

    const options={
        httpOnly:true,
        // secure:true,
        sameSite:"Lax"  
           }



           return res.status(200)
    .cookie("accessToken", accessToken, options)
    .json({    
        status: 200,
        message: "User logged in successfully!",
        data: { userLoggedIn, accessToken }  // ✅ Include accessToken explicitly
    });

    
    
})



/// update password --->>  using the refreshToken

const updatePassword = asyncHandler(async (req, res) => {
    try {
        const { oldpassword, newpassword } = req.body;

        console.log("You hit this route:", oldpassword, newpassword);

        // Find the user by email (use email from the token)
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Verify if the old password is correct using bcrypt's compare function
        const isMatch = await bcrypt.compare(oldpassword, user.password);
        if (!isMatch) {
            throw new ApiError(400, "Invalid previous password");
        }

       // check for the strong password
       if(!validator.isStrongPassword(newpassword)){
        throw  new ApiError(404,"plzz write the strong password !!!")
       }
        user.password=newpassword

        // Save the updated user with the new hashed password
        await user.save();

        // Send success response
        return res.status(200).send("Password successfully changed");

    } catch (error) {
        const statusCode = error.statusCode || 500;
        console.error("Error:", error.message);
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Something went wrong, please try again later",
        });
    }
});
///  delete the avaatar image 
const deleteAvatar = asyncHandler(async (req, res, next) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            // Throw an instance of ApiError if the user is not found
            throw new ApiError(404, "User not found");
        }

        // Set the avatar to the default avatar URL
        user.avatar = process.env.DEFAULT_AVATAR_URL;
        await user.save();

        // Respond with a success message
        res.status(200).send("avatar deleted successfully !!")
    } catch (error) {
        // Pass the error instance to the next middleware
        next(error instanceof ApiError ? error : new ApiError(500, "Failed to delete avatar"));
    }
});
/// delete the cover image 
const deleteCoverImage = asyncHandler(async (req, res, next) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            // Throw an instance of ApiError if the user is not found
            throw new ApiError(404, "User not found");
        }

        // Set the cover image to the default cover image URL
        user.coverImage = process.env.DEFAULT_COVERIMAGE_URL;
        await user.save();

        // Respond with a success message
        res.status(200).send("Cover image deleted successfully!!");
    } catch (error) {
        // Pass the error instance to the next middleware
        next(error instanceof ApiError ? error : new ApiError(500, "Failed to delete cover image"));
    }
});


/// update the avatar image 
const updateAvatar = asyncHandler(async function (req, res, next) {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Handle avatar upload
        let avatarLocalPath = req.files?.avatar?.[0]?.path;
        let avatarUrl;

        if (avatarLocalPath) {
            try {
                avatarUrl = await uploadImage(avatarLocalPath);
                // Optionally delete the local file after upload
                await deleteFile(avatarLocalPath); 
            } catch (error) {
                console.error("Error uploading avatar:", error.message);
                throw new ApiError(500, "Failed to upload avatar image");
            }
        }

        // Update user's avatar URL
        if (avatarUrl) {
            user.avatar = avatarUrl;
            await user.save();
        } else {
            throw new ApiError(400, "No avatar file uploaded");
        }

        // Respond with success message
        res.status(200).json({
            message: "Avatar updated successfully",
            avatar: user.avatar,
        });
    } catch (error) {
        // Pass the error instance to the next middleware
        next(error instanceof ApiError ? error : new ApiError(500, error.message || "Failed to update avatar"));
    }
});
///  update the coverImage 
const updateCoverImage = asyncHandler(async function (req, res, next) {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Handle cover image upload
        let coverImageLocalPath = req.files?.coverImage?.[0]?.path;
        let coverImageUrl;

        if (coverImageLocalPath) {
            try {
                coverImageUrl = await uploadImage(coverImageLocalPath);
                // Optionally delete the local file after upload
                await deleteFile(coverImageLocalPath); 
            } catch (error) {
                console.error("Error uploading cover image:", error.message);
                throw new ApiError(500, "Failed to upload cover image");
            }
        }

        // Update user's cover image URL
        if (coverImageUrl) {
            user.coverImage = coverImageUrl;
            await user.save();
        } else {
            throw new ApiError(400, "No cover image file uploaded");
        }

        // Respond with success message
        res.status(200).json({
            message: "Cover image updated successfully",
            coverImage: user.coverImage,
        });
    } catch (error) {
        // Pass the error instance to the next middleware
        next(error instanceof ApiError ? error : new ApiError(500, error.message || "Failed to update cover image"));
    }
});

//  update the user details ... in this project we can only update the user  fullName   

const updateUserDetails = asyncHandler(async (req, res, next) => {
    try {
        const newName = req.body.fullName;

        // Find the user by their email
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Update the user's full name
        user.fullName = newName;
        await user.save();

        // Send a success response
        res.status(200).json({
            message: "User details updated successfully",
            user: { fullName: user.fullName, email: user.email },
        });
    } catch (error) {
        // Pass the error to the next middleware for handling
        next(new ApiError(error.statusCode || 500, error.message || "Internal Server Error"));
    }
});






export { registerUser,userLogin,updatePassword ,deleteAvatar,updateAvatar,updateUserDetails,deleteCoverImage,updateCoverImage};
