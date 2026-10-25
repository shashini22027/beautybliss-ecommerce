
const returnContent = [
  {
    section: 1,
    title: "Return Eligibility",
    content:
      "We accept returns within 7 days from the date of delivery, provided the item is unused, unopened, and in its original packaging. Proof of purchase is required for all returns.",
  },
  {
    section: 2,
    title: "Non-Returnable Products",
    content:
      "Certain items such as gift cards, personalized products, and opened or used cosmetics may not be eligible for return due to hygiene and product safety reasons.",
  },
  {
    section: 3,
    title: "How to Initiate a Return",
    content:
      "Contact our customer support team within the return window and provide your order details and the reason for your return. If approved, we will send return instructions and the appropriate return address.",
  },
  {
    section: 4,
    title: "Return Shipping",
    content:
      "The customer is responsible for return shipping costs unless the return is due to a defect, wrong item, or a shipping mistake on our side. We recommend using a tracked courier service for returns.",
  },
  {
    section: 5,
    title: "Refunds",
    content:
      "Refunds are processed once the returned item is received and inspected. Approved refunds are issued to the original payment method. Shipping fees from the initial order are not included in the refund amount unless otherwise specified.",
  },
  {
    section: 6,
    title: "Defective or Incorrect Products",
    content:
      "If you receive a damaged, defective, or incorrect product, please contact us immediately. We may ask for photos or a brief description to help resolve the issue quickly and arrange a replacement or refund.",
  },
  {
    section: 7,
    title: "Damaged Shipments",
    content:
      "If your order is damaged during transit, contact customer support within a reasonable time and share clear photos of the item and packaging. We will review the issue and arrange a replacement or refund where applicable.",
  },
];

const ReturnRefundPolicyScreen = () => {
  return (
    <div className="bg-white">
      <section className="bb-page-title-banner flex items-center justify-center">
        <div className="relative z-10 flex w-full items-center justify-center">
          <h1 className="bb-page-title-long">
            Return &amp; Refund Policy
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 border-b border-stone-200 pb-8">
          <p className="text-stone-600 leading-relaxed">
            Thank you for shopping with BeautyBliss. We want every purchase to be a pleasant experience. This policy outlines the return and refund process for eligible items and helps ensure transparency and fair customer support.
          </p>
        </div>

        <div className="space-y-12">
          {returnContent.map((item) => (
            <div key={item.section} className="border-b border-stone-200 pb-8 last:border-b-0">
              <div className="mb-6 flex items-start gap-4">
                <span className="text-3xl font-bold text-rose-600">{item.section}.</span>
                <h2 className="pt-1 text-2xl font-bold text-stone-900 md:text-3xl">
                  {item.title}
                </h2>
              </div>

              <p className="ml-10 max-w-3xl text-stone-600 leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ReturnRefundPolicyScreen;
