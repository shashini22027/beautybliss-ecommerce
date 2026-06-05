import { Link } from "react-router-dom";

const termsContent = [
  {
    section: 1,
    title: "Website Use",
    subsections: [
      {
        subtitle: "1.1 Lawful Use Only",
        content:
          "By accessing and using the BeautyBliss website, you agree to use it solely for lawful shopping, account management, inquiries, and customer support purposes. You must not misuse the site, attempt unauthorized access, interfere with normal operations, or engage in any illegal activities.",
      },
      {
        subtitle: "1.2 User Responsibility",
        content:
          "You are responsible for ensuring your use of the website complies with all applicable laws and regulations. BeautyBliss reserves the right to suspend or terminate access for any violation of these terms or unauthorized use.",
      },
    ],
  },
  {
    section: 2,
    title: "Product Information",
    subsections: [
      {
        subtitle: "2.1 Accuracy of Details",
        content:
          "We aim to present product names, images, prices, shades, ingredients, sizes, availability, and descriptions as accurately as possible. However, we cannot guarantee absolute accuracy and reserve the right to correct any errors in product information or pricing.",
      },
      {
        subtitle: "2.2 Color and Finish Variations",
        content:
          "Due to lighting conditions, screen display differences, individual skin tones, and product batch variations, actual product colors and finishes may appear slightly different from images shown on our website. We recommend testing products before use.",
      },
    ],
  },
  {
    section: 3,
    title: "Orders and Payments",
    subsections: [
      {
        subtitle: "3.1 Order Confirmation",
        content:
          "Your order is confirmed only after successful payment processing and product availability verification. BeautyBliss may cancel or contact you regarding an order if payment fails, stock becomes unavailable, pricing errors occur, or additional verification is required.",
      },
      {
        subtitle: "3.2 Payment Security",
        content:
          "All payments are processed securely through our payment gateway. You are responsible for maintaining the confidentiality of your payment information. BeautyBliss is not liable for unauthorized charges resulting from your disclosure of payment details.",
      },
    ],
  },
  {
    section: 4,
    title: "Delivery",
    subsections: [
      {
        subtitle: "4.1 Delivery Timeline",
        content:
          "Delivery timelines depend on location, item availability, courier service capacity, and current order volume. Estimated delivery dates are provided for reference only and are not guaranteed. We will keep you updated on your shipment status.",
      },
      {
        subtitle: "4.2 Accurate Delivery Details",
        content:
          "Please provide accurate contact information and delivery address details to ensure smooth order completion. BeautyBliss is not responsible for delivery failures or delays caused by incomplete or incorrect customer information.",
      },
    ],
  },
  {
    section: 5,
    title: "Returns and Exchanges",
    subsections: [
      {
        subtitle: "5.1 Eligibility Criteria",
        content:
          "Return or exchange eligibility depends on product condition, seal integrity, hygiene requirements, expiry period, and inspection results. Products must be unused, unopened, and in original packaging to qualify for returns unless the item is faulty or incorrectly shipped.",
      },
      {
        subtitle: "5.2 Cosmetic Products",
        content:
          "Due to hygiene regulations, opened or used cosmetic products cannot be accepted for returns or exchanges unless they are defective or the wrong item was sent. Please inspect products immediately upon delivery.",
      },
    ],
  },
  {
    section: 6,
    title: "Account Responsibility",
    subsections: [
      {
        subtitle: "6.1 Account Security",
        content:
          "You are responsible for maintaining the confidentiality of your account login credentials and password. You are fully liable for all activity that occurs under your account. You must promptly notify BeautyBliss of any unauthorized access or suspected account compromise.",
      },
      {
        subtitle: "6.2 Account Misuse",
        content:
          "If you believe your account or order information has been used without authorization, contact our support team immediately. BeautyBliss will investigate such claims and take appropriate action to protect your account.",
      },
    ],
  },
  {
    section: 7,
    title: "Limitation of Liability",
    subsections: [
      {
        subtitle: "7.1 Use at Your Own Risk",
        content:
          "The BeautyBliss website and all products are provided 'as is' without warranties of any kind, either express or implied. BeautyBliss does not warrant that the website will be uninterrupted, error-free, or free from viruses or malicious code.",
      },
      {
        subtitle: "7.2 Damage Exclusion",
        content:
          "To the fullest extent permitted by law, BeautyBliss shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the website or products, including loss of profits, data, or business interruption.",
      },
    ],
  },
  {
    section: 8,
    title: "Changes to Terms",
    subsections: [
      {
        subtitle: "8.1 Policy Updates",
        content:
          "We reserve the right to update, modify, or change these Terms & Conditions at any time. Changes will be effective immediately upon posting to the website. Your continued use of BeautyBliss after any modifications constitutes your acceptance of the updated terms.",
      },
      {
        subtitle: "8.2 Notification",
        content:
          "For significant changes to these terms, we will notify you by email or through prominent website notices. We encourage you to review these terms periodically to stay informed of any updates.",
      },
    ],
  },
];

const TermsConditionsScreen = () => {
  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/banner.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-5xl md:text-6xl font-serif font-bold drop-shadow-lg mb-4">
            Terms & Conditions
          </h1>
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-rose-200 transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-rose-200">Terms & Conditions</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div>
          {/* Main Content Area */}
          <div>
            {/* Introduction */}
            <div className="mb-12 pb-8 border-b border-stone-200">
              <p className="text-stone-600 leading-relaxed">
                These Terms & Conditions govern your use of the BeautyBliss website and your purchase of products. By accessing and using our website, you agree to be bound by these terms. Please read them carefully before making any purchases.
              </p>
            </div>

            {/* Terms Sections */}
            <div className="space-y-12">
              {termsContent.map((section) => (
                <div key={section.section} className="pb-8 border-b border-stone-200 last:border-b-0">
                  <div className="mb-6 flex items-start gap-4">
                    <span className="text-3xl font-bold text-rose-600">
                      {section.section}.
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-stone-900 pt-1">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-6 ml-10">
                    {section.subsections.map((subsection, idx) => (
                      <div key={idx}>
                        <h3 className="font-bold text-stone-900 mb-3">
                          {subsection.subtitle}
                        </h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                          {subsection.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsConditionsScreen;
