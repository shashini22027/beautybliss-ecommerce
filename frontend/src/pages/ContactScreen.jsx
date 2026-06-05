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
      "You can view your sales receipt in your account dashboard under the Orders section. After completing your purchase, a receipt will be sent to your registered email address. You can also download it from your account anytime.",
  },
  {
    question: "How can I return an item?",
    answer:
      "We offer a hassle-free return policy. You can initiate a return within 14 days of purchase from your account dashboard. Please ensure the product is unused and in its original packaging.",
  },
  {
    question: "Will you restock items indicated as 'out of stock'?",
    answer:
      "Yes, we regularly restock popular items. You can check back soon or enable notifications on the product page to be alerted when it becomes available again.",
  },
  {
    question: "Where can I ship my order?",
    answer:
      "We ship to various locations across South Asia and internationally. Shipping options and costs depend on your location. During checkout, you can select your delivery address and see available shipping options.",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus("sending");
    setTimeout(() => {
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/banner.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-lg">
            CONTACT US
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
