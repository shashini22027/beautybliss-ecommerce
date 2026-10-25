# BeautyBliss eCommerce Platform

BeautyBliss is a modern MERN stack beauty and cosmetics e-commerce platform inspired by cosmetics.lk.

## Features
- Complete Authentication with user session management
- Category, Product and Review APIs
- Shopping Cart & Wishlist integration
- Checkout with order management & processing pipelines
- Fully Responsive Luxury UI Design with soft pastel colors

## Quick Start
1. Clone the repository
2. Install dependencies for backend and frontend
3. Set environment variables
4. Run `npm run dev`

## AI Shopping Assistant
The site-wide chat assistant uses the Gemini API through the backend. Create a Gemini API key in Google AI Studio and add `GEMINI_API_KEY` to `backend/.env` and your backend hosting provider's environment settings. `GEMINI_MODEL` is optional and defaults to `gemini-3.5-flash-lite`. Keep the API key on the backend; never add it to frontend environment variables. The chat route is limited to 15 messages per IP every 15 minutes.
