import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";

const Icon = ({ name, className = "w-5 h-5" }) => {
    const paths = {
        user: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z",
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

const getPasswordStrength = (password) => {
    if (!password) {
        return {
            label: "",
            message: "",
            className: "",
            canSubmit: false,
        };
    }

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const isMedium = password.length >= 8 && hasLower && hasUpper && hasNumber && hasSymbol;

    if (!isMedium) {
        return {
            label: "Very weak",
            message: "Very weak - Please enter a stronger password.",
            className: "bg-[#e7b84f] text-white",
            canSubmit: false,
        };
    }

    return {
        label: "Medium",
        message: "Medium",
        className: "bg-[#459547] text-white",
        canSubmit: true,
    };
};

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registerError, setRegisterError] = useState("");

    const navigate = useNavigate();
    const { search } = useLocation();
    const dispatch = useDispatch();
    const redirect = new URLSearchParams(search).get("redirect") || "/";
    const passwordStrength = getPasswordStrength(password);

    const submitHandler = async (e) => {
        e.preventDefault();
        setRegisterError("");

        if (!passwordStrength.canSubmit) {
            setRegisterError("Please enter a stronger password.");
            return;
        }

        setLoading(true);

        try {
            const generatedName = email.split("@")[0] || "Customer";
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: generatedName, email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Registration failed");
            }

            dispatch(loginSuccess(data));
            navigate(redirect);
        } catch (err) {
            setRegisterError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white text-gray-950">
            <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
                <img
                    src="/images/banner.jpg"
                    alt="Skincare products"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1460px] flex-col items-center justify-center px-6 text-center text-white sm:min-h-[320px]">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
                        My account
                    </h1>
                    <div className="mt-6 flex items-center gap-3 text-lg font-medium">
                        <Link to="/" className="text-white/85 transition hover:text-white">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="font-bold">My account</span>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1240px] px-6 py-14 sm:py-20">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                    <section className="lg:pr-10">
                        <h2 className="mb-8 text-3xl font-extrabold uppercase">Register</h2>

                        {registerError && (
                            <div className="mb-6 border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                {registerError}
                            </div>
                        )}

                        <form onSubmit={submitHandler} className="space-y-7">
                            <label className="block text-lg">
                                Email address <span className="text-red-500">*</span>
                                <input
                                    type="email"
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-3 h-[52px] w-full border border-gray-200 bg-white px-4 text-base outline-none transition focus:border-pink-300"
                                />
                            </label>

                            <label className="block text-lg">
                                Password <span className="text-red-500">*</span>
                                <span className="mt-3 flex h-[54px] w-full border border-gray-200 bg-white">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        required
                                        autoComplete="new-password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-full min-w-0 flex-1 px-4 text-base outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="flex h-full w-14 items-center justify-center bg-[#f3f3f3] text-gray-600 transition hover:text-gray-950"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        <Icon name={showPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
                                    </button>
                                </span>
                            </label>

                            {passwordStrength.message && (
                                <div className={`rounded-xl px-6 py-4 text-base font-semibold ${passwordStrength.className}`}>
                                    {passwordStrength.message}
                                </div>
                            )}

                            <p className="text-lg leading-8 text-gray-600">
                                Your personal data will be used to support your experience throughout this
                                website, to manage access to your account, and for other purposes described
                                in our <strong className="font-bold text-gray-950">privacy policy</strong>.
                            </p>

                            <button
                                type="submit"
                                disabled={loading || !passwordStrength.canSubmit}
                                className="h-[52px] w-full bg-[#2b2b2b] text-base font-extrabold uppercase text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-[#8a8a8a] disabled:opacity-100"
                            >
                                {loading ? "Registering..." : "Register"}
                            </button>
                        </form>
                    </section>

                    <section className="border-t border-gray-200 pt-10 text-center lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
                        <h2 className="mb-8 text-3xl font-extrabold uppercase">Login</h2>
                        <p className="mx-auto max-w-[540px] text-lg leading-8 text-gray-600">
                            Registering for this site allows you to access your order status and history.
                            Just fill in the fields below, and we'll get a new account set up for you in no
                            time. We will only ask you for information necessary to make the purchase
                            process faster and easier.
                        </p>

                        <Link
                            to={redirect !== "/" ? `/login?redirect=${redirect}` : "/login"}
                            className="mt-8 inline-flex h-[52px] items-center justify-center rounded-full bg-[#f6f6f6] px-9 text-base font-extrabold uppercase text-gray-950 transition hover:bg-[#2b2b2b] hover:text-white"
                        >
                            Login
                        </Link>
                    </section>
                </div>
            </section>
        </main>
    );
};

export default RegisterPage;
