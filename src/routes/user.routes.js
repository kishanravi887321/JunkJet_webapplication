import { Router  } from "express";
import { chatbot } from "../chatbot/index.js";

import { registerUser,userLogin ,updatePassword, deleteAvatar, updateAvatar, updateUserDetails, deleteCoverImage, updateCoverImage, refreshAccessToken, logoutUser} from "../controllers/user.controllers.js";
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
router.route("/refresh-token").post(refreshAccessToken)
router.route("/logout").post(verifyToken, logoutUser)

router.route("/changepassword").put(verifyToken,updatePassword)

router.route("/deleteavatar").post(verifyToken,deleteAvatar)
router.route("/deletecoverimage").post(verifyToken,deleteCoverImage)
router.route("/updateavatar").put(upload.fields([{name:"avatar",maxCount:1}]),verifyToken,updateAvatar)
router.route("/updatecoverimage").put(upload.fields([{name:"coverImage",maxCount:1}]),verifyToken,updateCoverImage)
router.route("/updatedetails").put(verifyToken,updateUserDetails)
router.route("/chatbot").post(verifyToken,chatbot)



   
    

export {router}
