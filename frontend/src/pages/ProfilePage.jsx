import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Icon = ({ name, className = "w-5 h-5" }) => {
    const paths = {
        user: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z",
        mail: "M4 6h16v12H4V6zm0 0 8 7 8-7",
        lock: "M6 10h12v10H6V10zm3 0V7a3 3 0 0 1 6 0v3",
        save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM7 21v-8h10v8M7 3v5h8",
        bag: "M6 8h12l-1 13H7L6 8zm3 0a3 3 0 0 1 6 0",
        arrow: "M5 12h14m-6-6 6 6-6 6",
        sparkle: "M12 2l1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2z",
        logout: "M10 17l5-5-5-5M15 12H3M21 3v18",
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

const getStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem("userInfo")) || null;
    } catch {
        return null;
    }
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const storedUser = getStoredUser();

    const [name, setName] = useState(storedUser?.name || "");
    const [email, setEmail] = useState(storedUser?.email || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [profileError, setProfileError] = useState("");

    useEffect(() => {
        if (!storedUser) {
            navigate("/login?redirect=/profile");
        }
    }, [navigate, storedUser]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage("");
        setProfileError("");

        if (password && password !== confirmPassword) {
            setProfileError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/users/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(storedUser?.token
                        ? { Authorization: `Bearer ${storedUser.token}` }
                        : {}),
                },
                body: JSON.stringify({
                    name,
                    email,
                    ...(password ? { password } : {}),
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Unable to update profile");
            }

            const updatedUser = { ...storedUser, ...data, name, email };
            localStorage.setItem("userInfo", JSON.stringify(updatedUser));
            setPassword("");
            setConfirmPassword("");
            setMessage("Profile updated successfully");
        } catch (err) {
            setProfileError(err.message || "Unable to update profile");
        } finally {
            setLoading(false);
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/login");
    };

    return (
        <main
            className="min-h-screen px-4 py-8 text-gray-950 sm:px-6 lg:px-8"
            style={{
                background:
                    "linear-gradient(135deg, #fff1f4 0%, #faf0ea 48%, #f8e7ee 100%)",
            }}
        >
            <section className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-5 border-b border-pink-200/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-pink-500">
                            BeautyBliss Account
                        </p>
                        <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-950 sm:text-5xl">
                            My Profile
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-gray-500">
                            Manage your account details and keep your beauty shopping profile current.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={logoutHandler}
                        className="inline-flex h-12 items-center justify-center gap-3 rounded-lg border border-pink-200 bg-[#fff4f6]/90 px-5 text-sm font-bold uppercase tracking-[0.16em] text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                        Sign Out
                        <Icon name="logout" className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                    <form
                        onSubmit={submitHandler}
                        className="rounded-lg border border-pink-200 bg-[#fff4f6]/90 p-6 shadow-sm sm:p-8"
                    >
                        <div className="mb-7">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-pink-500">
                                Personal Details
                            </p>
                            <h2 className="text-2xl font-serif font-bold text-gray-950">
                                Account Information
                            </h2>
                        </div>

                        {message && (
                            <div className="mb-6 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                {message}
                            </div>
                        )}

                        {profileError && (
                            <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                {profileError}
                            </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block sm:col-span-2">
                                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                                    Full Name
                                </span>
                                <span className="relative block">
                                    <Icon
                                        name="user"
                                        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        value={name}
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-12 w-full rounded-lg border border-pink-200 bg-[#fff7f8] pl-12 pr-4 text-sm font-medium text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                    />
                                </span>
                            </label>

                            <label className="block sm:col-span-2">
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
                                        value={email}
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 w-full rounded-lg border border-pink-200 bg-[#fff7f8] pl-12 pr-4 text-sm font-medium text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                    />
                                </span>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                                    New Password
                                </span>
                                <span className="relative block">
                                    <Icon
                                        name="lock"
                                        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Optional"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 w-full rounded-lg border border-pink-200 bg-[#fff7f8] pl-12 pr-4 text-sm font-medium text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                    />
                                </span>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
                                    Confirm Password
                                </span>
                                <span className="relative block">
                                    <Icon
                                        name="lock"
                                        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Optional"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        className="h-12 w-full rounded-lg border border-pink-200 bg-[#fff7f8] pl-12 pr-4 text-sm font-medium text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                    />
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-gray-950 px-5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                            <Icon name="save" className="h-5 w-5" />
                        </button>
                    </form>

                    <aside className="space-y-6">
                        <div className="rounded-lg border border-pink-200 bg-[#fff4f6]/90 p-6 shadow-sm">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                                <Icon name="sparkle" className="h-6 w-6" />
                            </div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-pink-500">
                                Beauty Shelf
                            </p>
                            <h2 className="text-2xl font-serif font-bold">
                                Welcome{name ? `, ${name.split(" ")[0]}` : ""}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Keep your profile updated for faster checkout and a smoother BeautyBliss experience.
                            </p>
                        </div>

                        <div className="rounded-lg border border-pink-200 bg-[#fff4f6]/90 p-6 shadow-sm">
                            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-pink-500">
                                Quick Links
                            </p>
                            <div className="space-y-3">
                                <Link
                                    to="/orders"
                                    className="flex h-12 items-center justify-between rounded-lg border border-pink-200 bg-[#fff7f8] px-4 text-sm font-bold text-gray-700 transition hover:border-pink-300 hover:text-pink-600"
                                >
                                    My Orders
                                    <Icon name="bag" className="h-5 w-5" />
                                </Link>
                                <Link
                                    to="/products"
                                    className="flex h-12 items-center justify-between rounded-lg border border-pink-200 bg-[#fff7f8] px-4 text-sm font-bold text-gray-700 transition hover:border-pink-300 hover:text-pink-600"
                                >
                                    Shop Products
                                    <Icon name="arrow" className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
};

export default ProfilePage;
