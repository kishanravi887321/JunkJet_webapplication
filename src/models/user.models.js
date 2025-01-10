import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

import dotenv from "dotenv";


dotenv.config({
    path: "../../.env"

})


const userSchema =new Schema({

    userName:{
        type:String,
        required:true,
        unique:true,

    },
    email:{
        type:String,
        required :true,
        unique:true,
        lowcase:true
    },
    fullName:{
        required:true,
        type :String,

    },
    avatar:{
        type:String,  // cloudinary url
    },
    coverImage:{
        type:String, // cloudinary url
        
    },
    password:{
        type:String,
        required:[true,"password is required"]

    }
    ,
    refreshToken:{
        type:String
    },
    accessToken:{
        type :String
    }


},{Timestamps:true})


userSchema.pre("save", async  function (next){

    if(!this.isModified('password'))  return next();

    this.password=await  bcrypt.hash(this.password,10)
    next()

})

userSchema.methods.isPasswordCorrect = async function(password) {

    return await bcrypt.compare(password,this.password)  /// mainatian the order (plainpassword,hashedpassword)
    
}

userSchema.methods.generateAccessToken = function () {
    try {
        
        const token = jwt.sign(
            { _id: this._id, email: this.email,userName:this.userName,fullName:this.fullName },
            process.env.ACCESS_TOKEN_SECRET || "defaultSecret",
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
        );
      
        return token;
    } catch (err) {
        console.error("Error generating access token:", err.message);
        throw new Error("Failed to generate access token");
    }
};

userSchema.methods.generateRefreshToken=function (){

}




const User = mongoose.model("User", userSchema);
export {User};