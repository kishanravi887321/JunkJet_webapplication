import { Router } from "express";
import { findBuyer } from "../controllers/location.controllers.js";


const router=Router()

router.route("/finduser").post(findBuyer)






export {router}