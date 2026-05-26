import { Link } from "react-router-dom";

const supportOptions = [
  {
    title: "Password Help",
    description: "Reset your password or recover access to your BeautyBliss account.",
  },
  {
    title: "Order Support",
    description: "Get help with recent orders, delivery updates, returns, or exchanges.",
  },
  {
    title: "Beauty Advice",
    description: "Ask us about shades, skincare routines, and product recommendations.",
  },
];

const AccountSupportPage = () => {
  return (
    <main className="min-h-screen bg-[#f7eef2] px-4 py-12 text-gray-950">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl items-center">
        <div className="w-full overflow-hidden rounded-2xl border border-[#d9a1b3] bg-white shadow-[0_30px_90px_rgba(86,28,52,0.18)]">
          <div className="h-2 bg-[linear-gradient(90deg,#e8b5c5,#9f234f,#e8b5c5)]" />

          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-[#321024] p-8 text-white sm:p-10">
              <Link
                to="/"
                className="mb-16 inline-flex items-center gap-3 text-sm font-bold"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#9f234f]">
                  B
                </span>
                BeautyBliss
              </Link>

              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#ffccd8]">
                Account Support
              </p>
              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                How can we help you today?
              </h1>
              <p className="mt-6 text-sm font-medium leading-7 text-white/82">
                Choose the support area you need and continue with your
                BeautyBliss account care.
              </p>
            </div>

            <div className="p-6 sm:p-10">
              <div className="space-y-4">
                {supportOptions.map((option) => (
                  <div
                    key={option.title}
                    className="rounded-xl border border-[#ead0d8] bg-[#fffaf8] p-5"
                  >
                    <h2 className="text-lg font-bold text-gray-950">
                      {option.title}
                    </h2>
                    <p className="mt-2 text-sm font-medium leading-6 text-gray-600">
                      {option.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center justify-center rounded-xl bg-[#9f234f] px-5 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-[#9f234f]/20 transition hover:bg-[#7d173c]"
                >
                  Reset Password
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-[#9f234f] bg-white px-5 py-4 text-sm font-bold uppercase tracking-widest text-[#9f234f] transition hover:bg-[#9f234f] hover:text-white"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AccountSupportPage;
