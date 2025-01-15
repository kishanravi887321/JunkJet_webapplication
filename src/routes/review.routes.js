import { Router   } from "express";
import { addReview } from "../controllers/review.controllers.js";
import { verifyToken } from "../middlewares/verifyjwtToken.middlewares.js";
import validator from "validator";
const router =Router()


router.route("/addreview").post(verifyToken,addReview)



export {router}