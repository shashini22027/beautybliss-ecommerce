import express from "express";
import { createCheckoutOrder, createPaymentIntent, getStripeConfig, verifyPayment } from "../controllers/paymentController.js";
import { optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkout-order", optionalProtect, createCheckoutOrder);
router.post("/create-payment-intent", optionalProtect, createPaymentIntent);
router.post("/verify", optionalProtect, verifyPayment);
router.get("/config", getStripeConfig);

export default router;
