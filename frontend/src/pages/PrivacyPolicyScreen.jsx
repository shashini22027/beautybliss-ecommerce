import { useEffect } from "react";
import { Link } from "react-router-dom";

const policySections = [
  {
    icon: "01",
    title: "Information We Collect",
    subtitle: "Account Details",
    body: "We collect information you provide when creating an account, placing an order, contacting us, saving preferences, or joining BeautyBliss updates. This may include your name, email address, phone number, delivery address, order details, and beauty preference notes you choose to share.",
    highlight: "Used for orders and support",
  },
  {
    icon: "02",
    title: "How We Use Your Information",
    subtitle: "Beauty Service",
    body: "Your details help us process purchases, arrange delivery, answer questions, recommend suitable products, improve our website, and send offers or beauty updates when you choose to subscribe.",
    highlight: "Improves your shopping experience",
  },
  {
    icon: "03",
    title: "Payments And Checkout",
    subtitle: "Secure Payments",
    body: "Payments are handled through secure payment services. BeautyBliss does not store full card numbers. We use reasonable safeguards to protect account, order, and communication information.",
    highlight: "Card details are not stored",
  },
  {
    icon: "04",
    title: "Beauty Updates And Emails",
    subtitle: "Newsletter Care",
    body: "If you subscribe, we may use your email address to send product launches, skincare tips, makeup offers, and BeautyBliss news. You can ask us to remove your email from our list at any time.",
    highlight: "Opt out anytime",
  },
  {
    icon: "05",
    title: "Sharing Information",
    subtitle: "Trusted Partners",
    body: "We share information only when needed to complete a service, such as delivery, payment processing, order support, website protection, legal compliance, or fraud prevention.",
    highlight: "Shared only when necessary",
  },
  {
    icon: "06",
    title: "Your Choices",
    subtitle: "Your Control",
    body: "You may request access, correction, or deletion of your personal information by contacting us. Some order records may be kept where required for business, tax, security, or legal reasons.",
    highlight: "Request updates anytime",
  },
];

const PrivacyPolicyScreen = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-[#fffaf8]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#321024_0%,#8f2854_58%,#f2a1b5_100%)] py-28 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,214,223,0.26),transparent_28%),radial-gradient(circle_at_82%_34%,rgba(255,244,232,0.18),transparent_26%)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.45em] text-[#ffd6df]">
            Your Data, Cared For
          </p>
          <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight md:text-7xl">
            Privacy Policy
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-7 text-white/78">
            We respect your privacy and handle your information carefully while
            providing cosmetics, skincare, delivery, support, and BeautyBliss
            update services.
          </p>
          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
            Last updated: May 2026
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {policySections.map((section) => (
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
            Need Help?
          </p>
          <h2 className="mb-6 font-serif text-4xl font-bold tracking-tight text-white md:text-5xl">
            Questions About Your Data?
          </h2>
          <p className="mx-auto mb-9 max-w-lg text-sm leading-7 text-white/72">
            For privacy questions or data requests, contact BeautyBliss and we
            will help you review, update, or understand your information.
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

export default PrivacyPolicyScreen;
