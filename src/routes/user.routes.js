import { Router  } from "express";

import { registerUser,userLogin ,updatePassword} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyToken } from "../middlewares/verifyjwtToken.middlewares.js";

const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ])
    
    
    
    ,registerUser)

router.route("/login").post(userLogin)

router.route("/changepassword").put(verifyToken,updatePassword)

export {router}
