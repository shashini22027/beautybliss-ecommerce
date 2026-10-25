import { useEffect, useRef, useState } from 'react';
import { Loader, MessageCircle, Send, X } from 'lucide-react';
import api from '../services/api';

const greeting = {
  role: 'assistant',
  content: 'Hi! I’m the BeautyBliss assistant. What can I help you find today?',
};

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([greeting]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending, isOpen]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const content = message.trim();
    if (!content || isSending) return;

    const nextMessages = [...messages, { role: 'user', content }];
    const conversation = [...conversationHistory.slice(-6), { role: 'user', content }];
    setMessages(nextMessages);
    setMessage('');
    setError('');
    setIsSending(true);

    try {
      const { data } = await api.post('/chat', { messages: conversation });
      setMessages((current) => [...current, { role: 'assistant', content: data.reply }]);
      setConversationHistory([...conversation, { role: 'assistant', content: data.reply }].slice(-8));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not reach the assistant. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-[60] sm:bottom-6 sm:right-6">
      {isOpen && (
        <section aria-label="BeautyBliss chat assistant" className="mb-3 flex h-[min(520px,70vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          <header className="flex items-center justify-between bg-[#292526] px-4 py-3 text-white">
            <div>
              <h2 className="font-semibold">BeautyBliss Assistant</h2>
              <p className="text-xs text-white/75">Product and shopping help</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat" className="rounded p-1 hover:bg-white/10">
              <X size={20} />
            </button>
          </header>

          <div aria-live="polite" className="flex-1 space-y-3 overflow-y-auto bg-[#fbf9f8] p-4">
            {messages.map((item, index) => (
              <div key={`${index}-${item.role}`} className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-5 ${item.role === 'user' ? 'ml-auto bg-[#292526] text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                {item.content}
              </div>
            ))}
            {isSending && <div className="flex items-center gap-2 text-sm text-gray-500"><Loader size={16} className="animate-spin" /> Thinking…</div>}
            {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-gray-200 p-3">
            <label htmlFor="assistant-message" className="sr-only">Your message</label>
            <input id="assistant-message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1000} placeholder="Ask us anything…" className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#a94f61]" />
            <button type="submit" disabled={!message.trim() || isSending} aria-label="Send message" className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#292526] text-white transition hover:bg-[#a94f61] disabled:cursor-not-allowed disabled:opacity-50">
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      <button type="button" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'} aria-expanded={isOpen} className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#292526] text-white shadow-lg transition hover:scale-105 hover:bg-[#a94f61]">
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatAssistant;
