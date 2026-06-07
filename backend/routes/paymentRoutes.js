import express from "express";
import { createPaymentIntent, getStripeConfig } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.get("/config", getStripeConfig);

export default router;
