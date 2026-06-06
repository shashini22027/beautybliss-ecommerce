import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetPasswordHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      setIsSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-white text-gray-950">
      {/* Header Banner */}
      <section className="relative min-h-[420px] overflow-hidden">
        <img
          src="/images/banner.jpg"
          alt="My account"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1540px] flex-col items-center justify-center px-6 py-16 text-white text-center">
          <h1 className="mb-4 text-6xl font-bold tracking-tight md:text-7xl">
            My account
          </h1>
          <p className="text-sm font-semibold tracking-wide">
            <Link to="/" className="transition hover:text-pink-300">
              Home
            </Link>{" "}
            / <span className="font-bold">My account</span>
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-[1540px] px-6 py-20 lg:py-24">
        {isSent ? (
          <div className="mx-auto max-w-5xl">
            {/* Green success banner */}
            <div className="mb-8 flex items-center gap-4 rounded-md bg-[#54a155] px-6 py-4 text-[15px] font-medium text-white shadow-sm">
              <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Password reset email has been sent.
            </div>

            <p className="mb-10 text-[15px] leading-7 text-gray-600">
              A password reset email has been sent to the email address on file
              for your account, but may take several minutes to show up in your
              inbox. Please wait at least 10 minutes before attempting another
              reset.
            </p>

            <Link
              to="/login"
              className="inline-block bg-[#2b2b2b] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-black"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-gray-600 text-[15px] leading-relaxed">
              <p>
                Lost your password? Please enter your username or email address.
                <br className="hidden sm:block" /> You will receive a link to
                create a new password via email.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={resetPasswordHandler} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[15px] font-medium text-gray-900"
                >
                  Username or email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-950"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2b2b2b] px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending..." : "Reset Password"}
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
