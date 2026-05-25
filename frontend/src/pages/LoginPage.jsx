import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Icon = ({ name, className = "w-5 h-5" }) => {
    const paths = {
        mail: "M4 6h16v12H4V6zm0 0 8 7 8-7",
        lock: "M6 10h12v10H6V10zm3 0V7a3 3 0 0 1 6 0v3",
        eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
        eyeOff:
            "M3 3l18 18M10.6 10.6a3 3 0 0 0 4 4M9.9 5.2A10.7 10.7 0 0 1 12 5c6 0 10 7 10 7a18.6 18.6 0 0 1-3.1 4.1M6.6 6.6C3.8 8.5 2 12 2 12s4 7 10 7c1.6 0 3-.5 4.2-1.2",
        arrow: "M5 12h14m-6-6 6 6-6 6",
        x: "M18 6 6 18M6 6l12 12",
    };

    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d={paths[name]} />
        </svg>
    );
};

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState("");

    const navigate = useNavigate();
    const { search } = useLocation();
    const redirect = new URLSearchParams(search).get("redirect") || "/";

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoginError("");
        setLoading(true);

        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Login failed");
            }

            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate(redirect);
        } catch (err) {
            setLoginError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#faf7f4] px-4 py-8 text-gray-950 sm:px-6 lg:px-8">
            <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_24px_80px_rgba(28,25,23,0.08)] lg:grid-cols-[0.92fr_1fr]">
                <section className="relative hidden bg-[#1f1a17] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-0 opacity-80">
                        <img
                            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80"
                            alt=""
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1a17] via-[#1f1a17]/70 to-[#1f1a17]/20" />
                    </div>

                    <div className="relative z-10">
                        <Link
                            to="/"
                            className="inline-flex items-center text-2xl font-serif font-bold tracking-[0.18em]"
                        >
                            BEAUTYBLISS
                        </Link>
                    </div>

                    <div className="relative z-10 max-w-md">
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-pink-200">
                            Welcome back
                        </p>
                        <h1 className="text-5xl font-serif font-bold leading-tight tracking-tight">
                            Continue your beauty routine.
                        </h1>
                        <p className="mt-5 text-sm leading-6 text-pink-50/80">
                            Sign in to revisit saved favorites, orders, and your personal beauty shelf.
                        </p>
                    </div>
                </section>

                <section className="relative flex items-center justify-center p-6 sm:p-10">
                    <Link
                        to="/"
                        aria-label="Close login page"
                        className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950"
                    >
                        <Icon name="x" className="h-5 w-5" />
                    </Link>

                    <div className="w-full max-w-md">
                        <div className="mb-8 lg:hidden">
                            <Link
                                to="/"
                                className="text-2xl font-serif font-bold tracking-[0.18em] text-gray-950"
                            >
                                BEAUTYBLISS
                            </Link>
                        </div>

                        <div className="mb-8">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-pink-500">
                                Sign In
                            </p>
                            <h2 className="text-4xl font-serif font-bold tracking-tight text-gray-950">
                                Welcome back
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Access your BeautyBliss account and keep shopping your favorites.
                            </p>
                        </div>

                        {loginError && (
                            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                                <span>{loginError}</span>
                            </div>
                        )}

                        <form onSubmit={submitHandler} className="space-y-4">
                            <label className="block">
                                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                                    Email Address
                                </span>
                                <span className="relative block">
                                    <Icon
                                        name="mail"
                                        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm font-medium text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                    />
                                </span>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                                    Password
                                </span>
                                <span className="relative block">
                                    <Icon
                                        name="lock"
                                        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********"
                                        value={password}
                                        required
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-12 text-sm font-medium tracking-widest text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                                        aria-label={
                                            showPassword ? "Hide password" : "Show password"
                                        }
                                    >
                                        <Icon
                                            name={showPassword ? "eyeOff" : "eye"}
                                            className="h-5 w-5"
                                        />
                                    </button>
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-gray-950 px-5 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-gray-950/10 transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:0.2s]" />
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:0.4s]" />
                                    </span>
                                ) : (
                                    <>
                                        Sign In
                                        <Icon name="arrow" className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-500">New to BeautyBliss?</p>
                            <Link
                                to={
                                    redirect !== "/"
                                        ? `/register?redirect=${redirect}`
                                        : "/register"
                                }
                                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-pink-600 transition hover:text-gray-950"
                            >
                                Create Account
                                <Icon name="arrow" className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default LoginPage;
