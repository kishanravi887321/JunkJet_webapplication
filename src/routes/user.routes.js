import { Router  } from "express";

import { registerUser,userLogin ,updatePassword, deleteAvatar, updateAvatar, updateUserDetails, deleteCoverImage, updateCoverImage} from "../controllers/user.controllers.js";
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

router.route("/deleteavatar").post(verifyToken,deleteAvatar)
router.route("/deletecoverimage").post(verifyToken,deleteCoverImage)
router.route("/updateavatar").put(upload.fields([{name:"avatar",maxCount:1}]),verifyToken,updateAvatar)
router.route("/updatecoverimage").put(upload.fields([{name:"coverImage",maxCount:1}]),verifyToken,updateCoverImage)
router.route("/updatedetails").put(verifyToken,updateUserDetails)
   
    

export {router}
