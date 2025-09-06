import { Router } from "express";
import {
    createTransaction,
    getUserTransactions,
    updateTransactionStatus,
    addTransactionRating,
    getTransactionAnalytics
} from "../controllers/transaction.controllers.js";

const router = Router();

// Transaction management routes
router.route("/create").post(createTransaction);
router.route("/user-transactions").get(getUserTransactions);
router.route("/:transactionId/status").put(updateTransactionStatus);
router.route("/:transactionId/rating").post(addTransactionRating);
router.route("/analytics").get(getTransactionAnalytics);

export default router;
