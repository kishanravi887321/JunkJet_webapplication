import { Router  } from "express";
import { addProduct, updateProduct, getAllProducts, getUserProducts } from "../controllers/product.controllers.js";
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

router.route("/updateproduct").put(upload.fields([{
    name:"productImage",
    maxcount:1
}]),updateProduct)

// GET routes for fetching products
router.route("/all").get(getAllProducts)
router.route("/user").get(getUserProducts)

export {router}