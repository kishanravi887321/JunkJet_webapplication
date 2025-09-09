import { Router } from "express";
import  {verifyToken} from "../middlewares/verifyjwtToken.middlewares.js"
import {
    addWasteTransaction,
    getAnalyticsSummary,
    getWasteTrend,
    getMaterialDistribution,
    getBuyerPerformance,
    getEarningsTrend,
    getAreaWasteCollection,
    getMonthlyTrends,
    getIndustryDistribution,
    getTransactionFlow
} from "../controllers/analytics.controllers.js";
import { generateTestData } from "../controllers/test.controllers.js";

const router = Router();

// Analytics routes for Phase 1 users
router.route("/summary").get(verifyToken,getAnalyticsSummary);
router.route("/waste-trend").get(verifyToken,getWasteTrend);
router.route("/material-distribution").get(verifyToken,getMaterialDistribution);
router.route("/buyer-performance").get(verifyToken,getBuyerPerformance);
router.route("/earnings-trend").get(verifyToken,getEarningsTrend);

// Analytics routes for Phase 2 users
router.route("/area-waste-collection").get(verifyToken,getAreaWasteCollection);
router.route("/monthly-trends").get(verifyToken,getMonthlyTrends);
router.route("/industry-distribution").get(verifyToken,getIndustryDistribution);
router.route("/transaction-flow").get(verifyToken,getTransactionFlow);

// Transaction management
router.route("/transaction").post(verifyToken,addWasteTransaction);

// Test data generation (for development)
router.route("/generate-test-data").post(verifyToken,generateTestData);

export default router;
