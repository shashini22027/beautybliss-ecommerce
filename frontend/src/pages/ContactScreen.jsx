import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "Will I receive the same product that I see in the picture?",
    answer:
      "Yes, we strive to ensure that the product you receive matches the images displayed on our website. Our product photos are taken under professional lighting to accurately represent colors, textures, and details. However, slight variations may occur due to factors such as screen resolution, lighting conditions, and manufacturing updates. Rest assured, we are committed to providing high-quality products that meet your expectations. If you have any concerns upon receiving your order, our customer support team is always available to assist you.",
  },
  {
    question: "Where can I view my sales receipt?",
    answer:
      "Sign in and open My Account → Orders to view your order history and status. If you need a receipt or cannot find an order, contact us with the email address used at checkout and your order number.",
  },
  {
    question: "How can I return an item?",
    answer:
      "Contact customer support within 7 days of delivery to ask about a return. Products generally need to be unused, unopened, and in their original packaging. See the Return & Refund Policy for eligibility and defective or incorrect items.",
  },
  {
    question: "Will you restock items indicated as 'out of stock'?",
    answer:
      "Restock dates vary by product. The product page shows current availability; this site does not currently offer back-in-stock alerts.",
  },
  {
    question: "Where can I ship my order?",
    answer:
      "We currently ship within Sri Lanka. Available delivery fees and options are shown during checkout before payment.",
  },
];

const ContactScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("sending");
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="relative min-h-[420px] overflow-hidden">
        <img
          src="/images/banner.jpg"
          alt="Contact Us"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1540px] flex-col items-center justify-center px-6 py-16 text-white">
          <h1 className="text-6xl font-bold uppercase tracking-tight md:text-7xl">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div>
            <div className="mb-8">
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-2">
                INFORMATION QUESTIONS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-stone-200 pb-4 last:border-b-0"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-start justify-between gap-4 py-4 hover:text-rose-600 transition text-left"
                  >
                    <span className="font-bold text-stone-900 text-base">
                      {item.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 transition-transform ${
                        expandedIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedIndex === index && (
                    <div className="pb-4 text-stone-600 text-sm leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form Section */}
          <div>
            <div className="mb-8">
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-2">
                INFORMATION ABOUT US
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                Contact Us For Any Questions
              </h2>
              <p className="mt-4 text-sm leading-6 text-stone-600">For appointment questions, email <a className="font-medium text-rose-700 underline" href="mailto:consultant@beautybliss.com">consultant@beautybliss.com</a> or call <a className="font-medium text-rose-700 underline" href="tel:+94701984663">+94 70 198 4663</a>. Use the form for general support; reply times may vary.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 77 000 0000"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your Company"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Please tell us your message here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 transition resize-none"
                />
              </div>

              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  Sorry, there was an error sending your message. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={submitStatus === "sending"}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
              >
                {submitStatus === "sending" ? "Sending..." : "ASK A QUESTION"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactScreen;
