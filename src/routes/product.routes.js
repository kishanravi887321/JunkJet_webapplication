import { Router  } from "express";
import { addProduct, updateProduct } from "../controllers/product.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router=Router()


router.route("/addproduct").post(
    upload.fields([
        {
            name:"productImage",
            maxCount:1
            
        }
    ]),
    
    
    addProduct)

router.route("/updateproduct").post(updateProduct)
export {router}