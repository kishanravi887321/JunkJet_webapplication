import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validator from "validator";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadImage, deleteFile } from "../utils/cloudinary.js";
import bcrypt from "bcrypt"

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
    if(!validator.isStrongPassword(password)){
        throw  new ApiError(202,"plzz write the strong password")
    }

    // Check if the user already exists
    const existUser = await User.findOne({
        $or: [{ userName }, { email }]
    });
    if (existUser) {
        throw new ApiError(409, "User already exists"); // Conflict status code
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
            await deleteFile(coverImageLocalPath); // Ensure the local file is deleted
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

    console.log(user.password)
    console.log(password,typeof(password))

    const isValidPassword= await  user.isPasswordCorrect(password)
    if(!isValidPassword) throw new ApiError(404,"plzz try with correct Paassword")

    //  generate the access and refresh token
    const accessToken=  user.generateAccessToken(user._id)
    console.log(accessToken,"generateToken")

    const userLoggedIn= await  User.findById(user._id).select("-password -refreshToke")

    const options={
        httpOnly:true,
        secure :true
           }

    return  res.status("505").cookie("accessToke",accessToken,options).json(    
        200,
        {
            user:userLoggedIn,accessToken
        },
        "user loged in seccussfully !"
    )

    
    
})



/// update password 

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
        // If error is an instance of ApiError, throw it, else throw a generic error
        if (error instanceof ApiError) {
            return res.status(error.statuscode).json({ message: error.message, errors: error.errors });
        } else {
            console.error("Error while updating password:", error.message);
            return res.status(500).json({ message: "Something went wrong, please try again later" });
        }
    }
});


export { registerUser,userLogin,updatePassword };
