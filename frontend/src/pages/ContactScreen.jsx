import { useEffect, useState } from "react";

const contactDetails = [
  {
    icon: "B",
    label: "Beauty Studio",
    value: "BeautyBliss, Colombo 03, Sri Lanka",
  },
  {
    icon: "P",
    label: "Phone",
    value: "+94 70 198 4663",
  },
  {
    icon: "E",
    label: "Email",
    value: "hello@beautybliss.lk",
  },
  {
    icon: "H",
    label: "Opening Hours",
    value: "Mon - Sat: 9.00 AM - 7.00 PM\nSun: 10.00 AM - 5.00 PM",
  },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const ContactScreen = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("sending");

    setTimeout(() => {
      setStatus("success");
      setForm(initialForm);
      setTimeout(() => setStatus(null), 5000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fffaf8]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#4a1737_0%,#9f315f_52%,#f4a7b9_100%)] py-24 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_78%_30%,rgba(255,235,217,0.2),transparent_24%)]" />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.42em] text-[#ffd6df]">
            Contact BeautyBliss
          </p>
          <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight md:text-7xl">
            Let&apos;s Talk Beauty
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-7 text-white/78">
            Have a question about skincare, makeup, orders, or product
            recommendations? Send us a note and our beauty team will help you
            choose what feels right.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          <aside className="space-y-6 lg:col-span-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.36em] text-[#c84772]">
                Our Information
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-950">
                Visit or Message Us
              </h2>
              <div className="mt-4 h-0.5 w-12 bg-[#c84772]" />
            </div>

            <div className="space-y-4 pt-2">
              {contactDetails.map((item) => (
                <div
                  key={item.label}
                  className="flex gap-4 rounded-lg border border-rose-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#fde7ed] text-sm font-bold text-[#b92e61]">
                    {item.icon}
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">
                      {item.label}
                    </p>
                    <p className="whitespace-pre-line text-sm font-medium leading-6 text-gray-700">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex h-56 items-center justify-center overflow-hidden rounded-lg border border-rose-100 bg-[linear-gradient(135deg,#fff0f4,#fff8ed)] shadow-sm">
              <div className="px-6 text-center">
                <p className="mb-3 font-serif text-3xl font-bold text-[#b92e61]">
                  BeautyBliss
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Colombo 03, Sri Lanka
                </p>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="rounded-lg border border-rose-100 bg-white p-6 shadow-sm sm:p-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.36em] text-[#c84772]">
                Send a Message
              </p>
              <h2 className="mb-8 font-serif text-3xl font-bold tracking-tight text-gray-950">
                We&apos;ll Get Back To You Soon
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Amaya Perera"
                      className="w-full rounded-lg border border-gray-200 px-5 py-3.5 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#d94f7b]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-gray-200 px-5 py-3.5 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#d94f7b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400"
                    >
                      Phone Optional
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+94 77 000 0000"
                      className="w-full rounded-lg border border-gray-200 px-5 py-3.5 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#d94f7b]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400"
                    >
                      Subject
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-200 bg-white px-5 py-3.5 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#d94f7b]"
                    >
                      <option value="">Select a subject...</option>
                      <option value="product-advice">Product Advice</option>
                      <option value="shade-match">Shade Match Help</option>
                      <option value="skin-care">Skincare Routine Help</option>
                      <option value="order">Order Enquiry</option>
                      <option value="returns">Returns or Exchanges</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us what you are looking for..."
                    className="w-full resize-none rounded-lg border border-gray-200 px-5 py-3.5 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#d94f7b]"
                  />
                </div>

                {status === "success" && (
                  <div className="rounded-lg border border-[#f4b7c8] bg-[#fff0f4] p-4 text-sm font-medium text-[#8a244e]">
                    Thank you. Your message has been sent and we will be in
                    touch soon.
                  </div>
                )}

                {status === "error" && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
                    Something went wrong. Please try again.
                  </div>
                )}

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-full bg-[linear-gradient(90deg,#b92e61,#f08aa2)] py-4 text-sm font-bold uppercase tracking-widest text-white shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ContactScreen;
