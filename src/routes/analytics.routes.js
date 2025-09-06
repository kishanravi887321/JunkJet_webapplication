import { Router } from "express";
import {
    addWasteTransaction,
    getAnalyticsSummary,
    getWasteTrend,
    getMaterialDistribution,
    getBuyerPerformance,
    getEarningsTrend
} from "../controllers/analytics.controllers.js";
import { generateTestData } from "../controllers/test.controllers.js";

const router = Router();

// Analytics routes for Phase 1 users
router.route("/summary").get(getAnalyticsSummary);
router.route("/waste-trend").get(getWasteTrend);
router.route("/material-distribution").get(getMaterialDistribution);
router.route("/buyer-performance").get(getBuyerPerformance);
router.route("/earnings-trend").get(getEarningsTrend);

// Transaction management
router.route("/transaction").post(addWasteTransaction);

// Test data generation (for development)
router.route("/generate-test-data").post(generateTestData);

export default router;
