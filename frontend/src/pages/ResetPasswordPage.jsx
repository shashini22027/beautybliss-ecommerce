import { useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/users/reset-password/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong.");

      login(data);
      navigate("/profile?password_reset=true");
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

        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1540px] flex-col items-center justify-center px-6 py-16 text-center text-white">
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
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <p className="text-[15px] text-gray-600">
              Enter a new password below.
            </p>
          </div>

          <hr className="mb-10 border-gray-100" />

          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="relative">
              <label
                htmlFor="password"
                className="mb-2 block text-[15px] font-medium text-gray-900"
              >
                New password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 bg-white px-4 py-3.5 pr-12 text-sm text-gray-900 outline-none transition focus:border-gray-950"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute bottom-0 right-0 flex h-[46px] w-12 items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  {showPassword ? (
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                  ) : (
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                  )}
                  <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-[15px] font-medium text-gray-900"
              >
                Re-enter new password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-200 bg-white px-4 py-3.5 pr-12 text-sm text-gray-900 outline-none transition focus:border-gray-950"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute bottom-0 right-0 flex h-[46px] w-12 items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  {showConfirmPassword ? (
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                  ) : (
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                  )}
                  <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2b2b2b] px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "SAVING..." : "SAVE"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ResetPasswordPage;
