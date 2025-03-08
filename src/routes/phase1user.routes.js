import  {Router} from "express";
import {  phase1UserAddress } from "../controllers/phse1user.controllers.js";

const router=Router()

router.route("/register").post(phase1UserAddress)


    


export {router}