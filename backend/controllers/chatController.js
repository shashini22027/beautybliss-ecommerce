import mongoose from 'mongoose';
import Product from '../models/Product.js';

const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 1000;
const catalogStopWords = new Set([
  'about', 'and', 'any', 'are', 'can', 'find', 'for', 'from', 'good', 'help',
  'how', 'looking', 'me', 'need', 'please', 'product', 'products', 'recommend',
  'show', 'some', 'suggest', 'that', 'the', 'this', 'want', 'what', 'which',
  'with', 'you', 'your',
]);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const findCatalogProducts = async (messages) => {
  if (mongoose.connection.readyState !== 1) return null;

  const searchText = messages
    .filter((message) => message.role === 'user')
    .slice(-3)
    .map((message) => message.content)
    .join(' ');
  const searchTerms = [...new Set(
    (searchText.match(/[\p{L}\p{N}]{3,}/gu) || [])
      .map((term) => term.toLowerCase())
      .filter((term) => !catalogStopWords.has(term))
  )].slice(0, 6);
  const query = { countInStock: { $gt: 0 } };

  if (searchTerms.length) {
    query.$or = searchTerms.flatMap((term) => {
      const pattern = new RegExp(escapeRegex(term), 'i');
      return ['name', 'brand', 'description', 'subcategory', 'keyIngredients', 'skinTypes', 'skinConcerns']
        .map((field) => ({ [field]: pattern }));
    });
  }

  const products = await Product.find(query)
    .select('name brand description price compareAtPrice discountLabel countInStock rating numReviews keyIngredients skinTypes skinConcerns size category variants')
    .populate('category', 'name')
    .sort({ rating: -1, numReviews: -1, createdAt: -1 })
    .limit(12)
    .maxTimeMS(3000)
    .lean();

  return products.map((product) => ({
    name: product.name,
    brand: product.brand,
    category: product.category?.name || '',
    subcategory: product.subcategory || '',
    priceRs: product.price,
    compareAtPriceRs: product.compareAtPrice || null,
    discount: product.discountLabel || '',
    stockUnits: product.countInStock,
    rating: product.rating,
    reviewCount: product.numReviews,
    description: product.description?.slice(0, 280) || '',
    keyIngredients: product.keyIngredients || [],
    skinTypes: product.skinTypes || [],
    skinConcerns: product.skinConcerns || [],
    size: product.size || '',
    availableVariants: (product.variants || [])
      .filter((variant) => variant.countInStock > 0)
      .map((variant) => ({ name: variant.name, stockUnits: variant.countInStock })),
  }));
};

const chat = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ message: 'The shopping assistant is not configured yet. Add GEMINI_API_KEY to the backend environment.' });
  }

  const { messages } = req.body || {};
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES ||
    messages.some((message) =>
      !message ||
      !['user', 'assistant'].includes(message.role) ||
      typeof message.content !== 'string' ||
      !message.content.trim() ||
      message.content.length > (message.role === 'user' ? MAX_MESSAGE_LENGTH : 4000)
    ) ||
    messages[messages.length - 1]?.role !== 'user'
  ) {
    return res.status(400).json({ message: 'Please send a valid message and try again.' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    let catalogContext;
    try {
      const products = await findCatalogProducts(messages);
      catalogContext = products === null
        ? 'Live product catalog is unavailable; do not guess product names, prices, or stock.'
        : `Live in-stock product catalog (prices are in Sri Lankan rupees): ${JSON.stringify(products)}. Use only listed products and their exact details. If no listed product matches, say no matching in-stock product was found.`;
    } catch (error) {
      console.error('Could not load products for chat:', error.name);
      catalogContext = 'Live product catalog could not be loaded; do not guess product names, prices, or stock.';
    }

    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: 'You are BeautyBliss’s friendly online beauty and skincare shopping assistant. Help customers navigate the store, choose products, and understand general skincare routines. Do not diagnose or treat medical conditions; recommend a qualified professional for medical concerns. Do not invent product availability, prices, delivery times, or store policies. When information is not available, say so and direct the customer to the Contact Us page. Keep answers concise, warm, and practical.' }],
        },
        contents: messages.map(({ role, content }, index) => ({
          role: role === 'assistant' ? 'model' : 'user',
          parts: [{ text: index === messages.length - 1 ? `${content}\n\n${catalogContext}` : content }],
        })),
        generationConfig: { maxOutputTokens: 300 },
      }),
      signal: controller.signal,
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Gemini chat request failed:', response.status, data?.error?.message || 'Unknown provider error');
      const providerMessage = data?.error?.message || '';
      const message = response.status === 401 || /api.?key/i.test(providerMessage)
        ? 'Gemini rejected the API key. Check GEMINI_API_KEY in the backend environment.'
        : response.status === 429
          ? 'Gemini has reached its API usage limit. Check the Google AI Studio project quota and billing.'
          : response.status === 404
            ? 'The configured Gemini model was not found. Check GEMINI_MODEL in the backend environment.'
            : 'Gemini could not complete the request. Check the backend logs and Google AI Studio project settings.';
      return res.status(502).json({ message });
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim();

    if (typeof reply !== 'string' || !reply.trim()) {
      console.error('Gemini chat response did not contain output text:', data.promptFeedback?.blockReason || 'No text candidate');
      return res.status(502).json({ message: 'The assistant returned an empty response. Please try again.' });
    }

    return res.json({ reply });
  } catch (error) {
    console.error('Gemini request failed:', error.cause?.code || error.code || error.name);
    const message = error.name === 'AbortError'
      ? 'The assistant took too long to respond. Please try again.'
      : 'The backend could not reach Gemini. Check the backend internet connection and restart the server after setting GEMINI_API_KEY.';
    return res.status(503).json({ message });
  } finally {
    clearTimeout(timeout);
  }
};

export { chat };
