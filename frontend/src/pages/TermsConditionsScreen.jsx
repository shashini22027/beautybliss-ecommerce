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
          "Card payments are handled by Stripe through its payment interface. BeautyBliss does not store raw card numbers or CVVs. An order is treated as paid only after the server verifies the payment status with the payment provider.",
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
          "Return eligibility and the request window are described in our Return & Refund Policy. The currently published policy asks customers to contact support within 7 days of delivery. The item must generally be unused, unopened, and in its original packaging, subject to the policy's defective or incorrect item process.",
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
          "Keep your login credentials private and use a strong, unique password. Contact BeautyBliss promptly if you suspect unauthorized access. We may ask you to verify account ownership before making sensitive account changes.",
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
  {
    section: 9,
    title: "Consultations and Cosmetic Guidance",
    subsections: [
      {
        subtitle: "9.1 Appointment Requests",
        content: "Submitting a consultation form creates a pending request, not a confirmed appointment. The appointment is confirmed only after the consultant changes its status and sends a confirmation. Available times are shown in Sri Lanka time. Customers can cancel or reschedule online up to 12 hours before the appointment using the secure link sent by email.",
      },
      {
        subtitle: "9.2 Skincare and Shade Previews",
        content: "Routine suggestions and virtual makeup previews are informational cosmetic tools. They are not medical advice, diagnosis, or treatment, and a shade preview does not guarantee an exact product match. Review product ingredients and patch test as appropriate; consult a qualified health professional about a medical skin concern.",
      },
    ],
  },
  {
    section: 10,
    title: "Account Features and Site Content",
    subsections: [
      {
        subtitle: "10.1 Account and Guest Features",
        content: "Registered customers can manage profile details, saved addresses, saved routines, wishlist items, and account order history. Some shopping features are available without signing in and may be stored only in the browser used to access the site.",
      },
      {
        subtitle: "10.2 Educational Content",
        content: "Beauty articles are general educational material. Product links and recommendations are provided for convenience and do not guarantee suitability for every person or skin type. Check the product listing and packaging for current ingredients, availability, and directions.",
      },
    ],
  },
];

const TermsConditionsScreen = () => {
  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="bb-page-title-banner flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/banner.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex w-full items-center justify-center text-white">
          <h1 className="bb-page-title-long">
            Terms & Conditions
          </h1>
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
