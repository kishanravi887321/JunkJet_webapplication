import { Router   } from "express";
import { addProduct } from "../controllers/product.controllers.js";
import validator from "validator";
const router =Router()


router.route("/add").post(addProduct)



export {router}