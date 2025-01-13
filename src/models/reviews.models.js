import mongoose, { Schema } from "mongoose";
import { User } from "./user.models.js";
import { Product } from "./product.models.js";

const review=new Schema({
    user:{
        type :mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    comment:{
        type:String,
        required:true,
        tirm :true
    }

},{timestamps:true})





const Review=mongoose.model("Review",review)

export {Review};