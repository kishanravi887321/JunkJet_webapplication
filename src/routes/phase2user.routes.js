import { Router} from "express";
import { setDetailsOfPhase2User } from "../controllers/phase2user.controllers.js";
const router=Router()



router.route("/update").post(setDetailsOfPhase2User)










export {router}