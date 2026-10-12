import { Link } from "react-router-dom";

const shippingContent = [
  {
    section: 1,
    title: "Shipping Locations",
    content:
      "We currently offer shipping across Sri Lanka for all eligible orders. We do not currently provide international shipping outside Sri Lanka.",
  },
  {
    section: 2,
    title: "Shipping Methods",
    content:
      "BeautyBliss partners with trusted courier services to ensure your orders are delivered safely and efficiently. The shipping method is chosen based on destination, size, and weight of the package.",
  },
  {
    section: 3,
    title: "Shipping Costs",
    content:
      "Shipping fees vary depending on the order weight, delivery destination, and selected service level. The exact shipping amount is shown during checkout before you complete your purchase.",
  },
  {
    section: 4,
    title: "Processing Time",
    content:
      "Orders are typically processed and dispatched within 2-5 business days. Processing time does not include weekends or public holidays.",
  },
  {
    section: 5,
    title: "Estimated Delivery Time",
    content:
      "Estimated delivery times depend on courier availability and destination. While we aim to deliver on time, delays can occasionally occur due to weather, courier capacity, or other uncontrollable factors.",
  },
  {
    section: 6,
    title: "Order Tracking",
    content:
      "Once your order is shipped, we will provide tracking information so you can check the progress of your delivery. You can also use the Track Order feature from our website.",
  },
  {
    section: 7,
    title: "Delivery Attempts and Signature",
    content:
      "Our courier may attempt delivery to the provided address. If no one is available, a delivery notice may be left. In some cases, a signature may be required before the parcel is handed over.",
  },
  {
    section: 8,
    title: "Undeliverable Packages",
    content:
      "If a package is returned as undeliverable because of an incorrect address, failed delivery attempts, or refusal, we will contact you to arrange re-shipment. Additional delivery charges may apply.",
  },
  {
    section: 9,
    title: "Shipping Restrictions",
    content:
      "Some beauty products may have shipping restrictions based on location or local regulations. It is the customer's responsibility to ensure products are allowed to be shipped to their destination.",
  },
];

const ShippingDeliveryScreen = () => {
  return (
    <div className="bg-white">
      <section className="relative h-64 overflow-hidden md:h-80">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/banner.jpg)" }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="mb-4 text-5xl font-bold uppercase tracking-tight md:text-6xl">
            Shipping and Delivery
          </h1>
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-white/90">
            <Link to="/" className="transition hover:text-rose-200">
              Home
            </Link>
            <span>/</span>
            <span className="text-rose-200">Shipping and Delivery</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 border-b border-stone-200 pb-8">
          <p className="text-stone-600 leading-relaxed">
            Thank you for choosing BeautyBliss for your beauty essentials. This Shipping and Delivery page explains our delivery process, estimated timelines, costs, and important order information before you place an order.
          </p>
        </div>

        <div className="space-y-12">
          {shippingContent.map((item) => (
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

export default ShippingDeliveryScreen;
