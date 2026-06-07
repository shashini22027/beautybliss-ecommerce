import Stripe from "stripe";

let stripeInstance = null;

const getStripe = () => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
};

// @desc    Create a Stripe PaymentIntent
// @route   POST /api/payment/create-payment-intent
// @access  Public
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "lkr", metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount." });
    }

    // Stripe expects amount in the smallest currency unit (cents for LKR)
    const amountInCents = Math.round(amount * 100);

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe PaymentIntent error:", error.message);
    res.status(500).json({ message: "Payment processing failed.", error: error.message });
  }
};

// @desc    Get Stripe publishable key
// @route   GET /api/payment/config
// @access  Public
export const getStripeConfig = (req, res) => {
  res.status(200).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};
