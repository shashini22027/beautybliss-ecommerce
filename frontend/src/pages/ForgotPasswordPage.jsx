import { useState } from "react";
import { Link } from "react-router-dom";

const initialForm = {
  email: "",
  code: "",
  password: "",
  confirmPassword: "",
};

const ForgotPasswordPage = () => {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const requestCodeHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setMessage({
        type: "success",
        text: "A reset code has been sent to your email address.",
      });
    }, 900);
  };

  const resetPasswordHandler = (event) => {
    event.preventDefault();
    setMessage(null);

    if (form.password !== form.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setForm(initialForm);
      setStep(1);
      setMessage({
        type: "success",
        text: "Your password has been reset. Please return to login.",
      });
    }, 900);
  };

  return (
    <main className="min-h-screen bg-[#f7eef2] text-gray-950">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[#321024] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,214,223,0.22),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(244,167,185,0.18),transparent_30%)]" />
          <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full border border-white/15" />
          <div className="absolute -bottom-10 -right-10 h-56 w-56 rounded-full border border-white/10" />

          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-sm font-bold tracking-wide text-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#9f234f]">
                B
              </span>
              BeautyBliss
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#ffccd8]">
              Account Care
            </p>
            <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight">
              A softer way back into your beauty shelf.
            </h1>
            <p className="mt-6 text-sm leading-7 text-white/82">
              Reset your password in two quick steps and get back to your
              saved favorites, orders, and BeautyBliss recommendations.
            </p>
          </div>

          <div className="relative z-10 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            BeautyBliss Account Support
          </div>
        </section>

        <section className="relative flex items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-12">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute right-[-10rem] top-[-10rem] h-96 w-96 rounded-full bg-[#ffd6df]/60 blur-3xl" />
            <div className="absolute bottom-[-12rem] left-[-12rem] h-96 w-96 rounded-full bg-[#f8c7a8]/45 blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-xl">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-3 text-sm font-bold text-gray-950 lg:hidden"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9f234f] text-white">
                  B
                </span>
                BeautyBliss
              </Link>

            </div>

            <div className="rounded-2xl border border-[#d9a1b3] bg-white p-6 shadow-[0_30px_90px_rgba(86,28,52,0.2)] sm:p-9">
              <div className="mb-8 flex items-center gap-3">
                <div
                  className={`h-2 flex-1 rounded-full ${
                    step >= 1 ? "bg-[#9f234f]" : "bg-[#ead0d8]"
                  }`}
                />
                <div
                  className={`h-2 flex-1 rounded-full ${
                    step >= 2 ? "bg-[#9f234f]" : "bg-[#ead0d8]"
                  }`}
                />
              </div>

              <div className="mb-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.32em] text-[#9f234f]">
                  {step === 1 ? "Password Help" : "Secure Verification"}
                </p>
                <h2 className="font-serif text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                  {step === 1 ? "Forgot Password?" : "Create New Password"}
                </h2>
                <p className="mt-4 max-w-md text-sm font-medium leading-7 text-gray-600">
                  {step === 1
                    ? "Enter your account email and we will send a reset code to help you sign in again."
                    : "Enter the code we sent and choose a fresh password for your BeautyBliss account."}
                </p>
              </div>

              {message && (
                <div
                  className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${
                    message.type === "error"
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-[#d57f9d] bg-[#fff0f4] text-[#6f1939]"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={requestCodeHandler} className="space-y-5">
                  <div>
                    <label
                      htmlFor="forgot-email"
                      className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#9f234f]">
                        @
                      </span>
                      <input
                        id="forgot-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full rounded-xl border border-gray-300 bg-white py-4 pl-11 pr-4 text-sm font-medium text-gray-950 outline-none transition placeholder:text-gray-500 focus:border-transparent focus:ring-2 focus:ring-[#9f234f]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#9f234f] py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-xl shadow-[#9f234f]/25 transition hover:scale-[1.01] hover:bg-[#7d173c] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending Code..." : "Send Reset Code"}
                    {!loading && <span aria-hidden="true">-&gt;</span>}
                  </button>
                </form>
              ) : (
                <form onSubmit={resetPasswordHandler} className="space-y-5">
                  <div className="rounded-xl border border-[#d57f9d] bg-[#fff0f4] p-4 text-sm font-medium leading-6 text-gray-700">
                    Code sent to{" "}
                    <span className="font-bold text-gray-950">{form.email}</span>
                  </div>

                  <div>
                    <label
                      htmlFor="reset-code"
                      className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-700"
                    >
                      Verification Code
                    </label>
                    <input
                      id="reset-code"
                      name="code"
                      type="text"
                      value={form.code}
                      onChange={handleChange}
                      required
                      maxLength={6}
                      inputMode="numeric"
                      placeholder="000000"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-center font-mono text-lg tracking-[0.45em] text-gray-950 outline-none transition placeholder:text-gray-500 focus:border-transparent focus:ring-2 focus:ring-[#9f234f]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="new-password"
                        className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-700"
                      >
                        New Password
                      </label>
                      <input
                        id="new-password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        placeholder="New password"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-sm font-medium text-gray-950 outline-none transition placeholder:text-gray-500 focus:border-transparent focus:ring-2 focus:ring-[#9f234f]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-700"
                      >
                        Confirm
                      </label>
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm password"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-sm font-medium text-gray-950 outline-none transition placeholder:text-gray-500 focus:border-transparent focus:ring-2 focus:ring-[#9f234f]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[#9f234f] py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-xl shadow-[#9f234f]/25 transition hover:scale-[1.01] hover:bg-[#7d173c] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Updating..." : "Reset Password"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setMessage(null);
                    }}
                    className="w-full text-center text-xs font-bold uppercase tracking-widest text-gray-600 transition hover:text-[#9f234f]"
                  >
                    Use a different email
                  </button>
                </form>
              )}

              <div className="mt-8 border-t border-gray-100 pt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-[#9f234f] bg-white px-5 py-3.5 text-sm font-bold uppercase tracking-widest text-[#9f234f] shadow-sm transition hover:bg-[#9f234f] hover:text-white"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
