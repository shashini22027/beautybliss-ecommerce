import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, PackageCheck, Truck, ClipboardList } from "lucide-react";

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative h-72 overflow-hidden md:h-80">
        <img
          src="/images/banner.jpg"
          alt="Track your order"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1540px] flex-col items-center justify-center px-6 text-center text-white">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
            Track Your Order
          </h1>
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/85">
            <Link to="/" className="transition hover:text-white">Home</Link>
            <span>/</span>
            <span>Track your order</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1180px] gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-gray-400">
            Order lookup
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-950">
            See where your BeautyBliss order is right now.
          </h2>
          <p className="mt-5 text-lg leading-8 text-gray-600">
            Enter your order ID and billing email address to check payment,
            packing, and delivery progress.
          </p>

          <div className="mt-8 grid gap-4 text-sm font-bold uppercase tracking-[0.14em] text-gray-600 sm:grid-cols-3">
            {[
              ["Order placed", ClipboardList],
              ["Packed", PackageCheck],
              ["On delivery", Truck],
            ].map(([label, Icon]) => (
              <div key={label} className="border border-gray-200 bg-[#f8f8f8] px-4 py-5 text-center">
                <Icon className="mx-auto mb-3 h-6 w-6 text-pink-600" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="border border-gray-200 bg-white p-7 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
          <label className="block text-base font-bold text-gray-950">
            Order ID
            <input
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              required
              placeholder="Example: C0052"
              className="mt-3 h-13 w-full border border-gray-200 px-4 py-3 text-base font-normal outline-none transition focus:border-gray-950"
            />
          </label>

          <label className="mt-6 block text-base font-bold text-gray-950">
            Billing email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              className="mt-3 h-13 w-full border border-gray-200 px-4 py-3 text-base font-normal outline-none transition focus:border-gray-950"
            />
          </label>

          {submitted && (
            <div className="mt-6 border border-pink-100 bg-pink-50 px-4 py-3 text-sm font-semibold text-pink-700">
              We could not find a live shipment for this demo order yet. Check your account orders page for saved checkout orders.
            </div>
          )}

          <button
            type="submit"
            className="mt-7 inline-flex h-13 w-full items-center justify-center gap-3 bg-[#2b2b2b] px-8 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-white transition hover:bg-pink-600"
          >
            <Search size={18} />
            Track
          </button>
        </form>
      </section>
    </main>
  );
};

export default TrackOrderPage;
