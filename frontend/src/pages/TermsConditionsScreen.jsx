import { useEffect } from "react";
import { Link } from "react-router-dom";

const termsSections = [
  {
    icon: "01",
    title: "Website Use",
    subtitle: "Access Terms",
    body: "By using the BeautyBliss website, you agree to use it for lawful shopping, account, enquiry, and support purposes only. You must not misuse the site, attempt unauthorized access, or interfere with normal operation.",
    highlight: "Use the site responsibly",
  },
  {
    icon: "02",
    title: "Product Information",
    subtitle: "Cosmetic Details",
    body: "We aim to present product names, images, prices, shades, ingredients, sizes, availability, and descriptions accurately. Colors and finishes may look slightly different because of lighting, screens, skin tone, or product batches.",
    highlight: "Shades may vary slightly",
  },
  {
    icon: "03",
    title: "Orders And Payments",
    subtitle: "Secure Purchase",
    body: "Orders are confirmed after successful payment and availability checks. BeautyBliss may cancel or contact you about an order if payment fails, stock changes, pricing errors occur, or verification is required.",
    highlight: "Payment confirms your order",
  },
  {
    icon: "04",
    title: "Delivery",
    subtitle: "Shipping Service",
    body: "Delivery timelines depend on location, item availability, courier service, and order volume. Please provide accurate contact and delivery details so we can complete your order smoothly.",
    highlight: "Accurate details help delivery",
  },
  {
    icon: "05",
    title: "Returns And Exchanges",
    subtitle: "Customer Care",
    body: "Return or exchange eligibility may depend on product condition, seal status, hygiene requirements, expiry period, and inspection. Opened or used cosmetics may not be eligible unless faulty or incorrect.",
    highlight: "Hygiene rules may apply",
  },
  {
    icon: "06",
    title: "Account Responsibility",
    subtitle: "Your Login",
    body: "You are responsible for keeping your account login details secure and for activity under your account. Contact us quickly if you believe your account or order information has been used without permission.",
    highlight: "Keep login details secure",
  },
];

const TermsConditionsScreen = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-[#fffaf8]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#321024_0%,#8f2854_58%,#f2a1b5_100%)] py-28 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,214,223,0.26),transparent_28%),radial-gradient(circle_at_82%_34%,rgba(255,244,232,0.18),transparent_26%)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.45em] text-[#ffd6df]">
            BeautyBliss Purchase Guide
          </p>
          <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight md:text-7xl">
            Terms & Conditions
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-7 text-white/78">
            These terms explain how website use, product information, orders,
            payments, delivery, returns, and account care work when shopping
            with BeautyBliss.
          </p>
          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
            Last updated: May 2026
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {termsSections.map((section) => (
            <article
              key={section.title}
              className="group relative overflow-hidden rounded-lg border border-rose-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#9f234f,#f2a1b5)] opacity-0 transition-opacity duration-300 group-hover:opacity-[0.04]" />
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-[#f4b7c8] bg-[#fff0f4] font-serif text-xl font-bold text-[#9f234f]">
                  {section.icon}
                </div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-[#c84772]">
                  {section.subtitle}
                </p>
                <h2 className="mb-4 font-serif text-2xl font-bold text-gray-950 transition-colors group-hover:text-[#9f234f]">
                  {section.title}
                </h2>
                <p className="mb-6 text-sm font-medium leading-7 text-gray-600">
                  {section.body}
                </p>
                <div className="flex items-center gap-2 border-t border-rose-100 pt-4">
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-[#9f234f]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {section.highlight}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <section className="mx-6 mb-20 overflow-hidden rounded-lg bg-[linear-gradient(135deg,#321024,#8f2854)] px-8 py-16 text-center lg:mx-auto lg:max-w-7xl">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#ffd6df]">
            Need Clarification?
          </p>
          <h2 className="mb-6 font-serif text-4xl font-bold tracking-tight text-white md:text-5xl">
            Questions Before You Order?
          </h2>
          <p className="mx-auto mb-9 max-w-lg text-sm leading-7 text-white/72">
            Our BeautyBliss team can help with product details, shade guidance,
            delivery questions, returns, and after-sales support.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-sm font-bold uppercase tracking-widest text-[#9f234f] shadow-xl shadow-black/10 transition hover:scale-[1.03] hover:bg-[#fff0f4]"
          >
            Contact BeautyBliss
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TermsConditionsScreen;
