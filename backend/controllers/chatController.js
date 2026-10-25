const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 1000;

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
        contents: messages.map(({ role, content }) => ({
          role: role === 'assistant' ? 'model' : 'user',
          parts: [{ text: content }],
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
