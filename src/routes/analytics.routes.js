import { Router } from "express";
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
router.route("/summary").get(getAnalyticsSummary);
router.route("/waste-trend").get(getWasteTrend);
router.route("/material-distribution").get(getMaterialDistribution);
router.route("/buyer-performance").get(getBuyerPerformance);
router.route("/earnings-trend").get(getEarningsTrend);

// Analytics routes for Phase 2 users
router.route("/area-waste-collection").get(getAreaWasteCollection);
router.route("/monthly-trends").get(getMonthlyTrends);
router.route("/industry-distribution").get(getIndustryDistribution);
router.route("/transaction-flow").get(getTransactionFlow);

// Transaction management
router.route("/transaction").post(addWasteTransaction);

// Test data generation (for development)
router.route("/generate-test-data").post(generateTestData);

export default router;
