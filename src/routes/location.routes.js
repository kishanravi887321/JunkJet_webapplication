import { Router } from "express";
import { findUserByLocation } from "../services/location.services.js";


const router=Router()

router.route("/finduser").post(findUserByLocation)






export {router}