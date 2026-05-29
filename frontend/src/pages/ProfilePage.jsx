import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Icon = ({ name, className = "w-5 h-5" }) => {
    const paths = {
        orders: "M7 3h9l4 4v14H7V3zm9 0v5h4M10 10h6M10 14h6M10 18h4M5 7H3v14h12v-2",
        edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z",
        address: "M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
        user: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z",
        heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z",
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

const districts = [
    "Ampara",
    "Anuradhapura",
    "Badulla",
    "Batticaloa",
    "Colombo",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kalutara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mannar",
    "Matale",
    "Matara",
    "Monaragala",
    "Mullaitivu",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",
    "Vavuniya",
];

const sriLankanCities = [
    "Colombo",
    "Dehiwala-Mount Lavinia",
    "Moratuwa",
    "Negombo",
    "Gampaha",
    "Kandy",
    "Matale",
    "Dambulla",
    "Kurunegala",
    "Anuradhapura",
    "Trincomalee",
    "Batticaloa",
    "Jaffna",
    "Galle",
    "Matara",
    "Ratnapura",
    "Badulla",
    "Nuwara Eliya",
];

const getInitialAddress = (storedUser) => ({
    firstName: "",
    lastName: "",
    street: "",
    district: "",
    city: "",
    phone: "",
    secondaryPhone: "",
    email: storedUser?.email || "",
});

const getInitialAccountDetails = (storedUser) => {
    const nameParts = String(storedUser?.name || "").trim().split(/\s+/).filter(Boolean);
    const emailPrefix = storedUser?.email?.split("@")[0] || "";

    return {
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" "),
        displayName: storedUser?.name || emailPrefix,
        email: storedUser?.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    };
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const storedUser = getStoredUser();
    const displayName = storedUser?.name || storedUser?.email?.split("@")[0] || "customer";
    const [activeView, setActiveView] = useState("dashboard");
    const [addressForms, setAddressForms] = useState({
        billing: getInitialAddress(storedUser),
        shipping: getInitialAddress(storedUser),
    });
    const [accountDetails, setAccountDetails] = useState(getInitialAccountDetails(storedUser));
    const [accountMessage, setAccountMessage] = useState("");
    const [accountError, setAccountError] = useState("");

    useEffect(() => {
        if (!storedUser) {
            navigate("/login?redirect=/profile");
        }
    }, [navigate, storedUser]);

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/login");
    };

    const menuItems = [
        { label: "Dashboard", view: "dashboard" },
        { label: "Orders", to: "/orders" },
        { label: "Addresses", view: "addresses" },
        { label: "Account details", view: "accountDetails" },
        { label: "Wishlist", to: "/wishlist" },
    ];

    const dashboardTiles = [
        { label: "Orders", icon: "orders", to: "/orders" },
        { label: "Addresses", icon: "address", view: "addresses" },
        { label: "Account details", icon: "user", view: "accountDetails" },
        { label: "Wishlist", icon: "heart", to: "/wishlist" },
        { label: "Logout", icon: "logout", action: logoutHandler },
    ];

    const handleAddressChange = (type, field, value) => {
        setAddressForms((currentForms) => ({
            ...currentForms,
            [type]: {
                ...currentForms[type],
                [field]: value,
            },
        }));
    };

    const saveAddress = (event, type) => {
        event.preventDefault();
        localStorage.setItem(`${type}Address`, JSON.stringify(addressForms[type]));
        setActiveView("addresses");
    };

    const handleAccountChange = (field, value) => {
        setAccountDetails((currentDetails) => ({
            ...currentDetails,
            [field]: value,
        }));
        setAccountMessage("");
        setAccountError("");
    };

    const saveAccountDetails = (event) => {
        event.preventDefault();
        setAccountMessage("");
        setAccountError("");

        if (accountDetails.newPassword && accountDetails.newPassword !== accountDetails.confirmPassword) {
            setAccountError("New passwords do not match.");
            return;
        }

        const updatedUser = {
            ...storedUser,
            name: accountDetails.displayName,
            email: accountDetails.email,
        };

        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setAccountDetails((currentDetails) => ({
            ...currentDetails,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }));
        setAccountMessage("Account details saved.");
    };

    const renderAccountDetailsForm = () => (
        <form onSubmit={saveAccountDetails} className="max-w-[1100px]">
            {accountMessage && (
                <div className="mb-6 border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {accountMessage}
                </div>
            )}
            {accountError && (
                <div className="mb-6 border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {accountError}
                </div>
            )}

            <div className="grid gap-8 md:grid-cols-2">
                <label className="block text-lg">
                    First name <span className="text-red-500">*</span>
                    <input
                        required
                        value={accountDetails.firstName}
                        onChange={(event) => handleAccountChange("firstName", event.target.value)}
                        className="mt-3 h-[52px] w-full border border-gray-200 px-4 outline-none focus:border-pink-300"
                    />
                </label>
                <label className="block text-lg">
                    Last name <span className="text-red-500">*</span>
                    <input
                        required
                        value={accountDetails.lastName}
                        onChange={(event) => handleAccountChange("lastName", event.target.value)}
                        className="mt-3 h-[52px] w-full border border-gray-200 px-4 outline-none focus:border-pink-300"
                    />
                </label>
            </div>

            <label className="mt-7 block text-lg">
                Display name <span className="text-red-500">*</span>
                <input
                    required
                    value={accountDetails.displayName}
                    onChange={(event) => handleAccountChange("displayName", event.target.value)}
                    className="mt-3 h-[52px] w-full border border-gray-200 px-4 outline-none focus:border-pink-300"
                />
                <span className="mt-2 block text-base italic text-gray-600">
                    This will be how your name will be displayed in the account section and in reviews
                </span>
            </label>

            <label className="mt-7 block text-lg">
                Email address <span className="text-red-500">*</span>
                <input
                    required
                    type="email"
                    value={accountDetails.email}
                    onChange={(event) => handleAccountChange("email", event.target.value)}
                    className="mt-3 h-[52px] w-full border border-gray-200 px-4 outline-none focus:border-pink-300"
                />
            </label>

            <fieldset className="mt-12 rounded-xl border border-gray-200 px-8 pb-8 pt-7">
                <legend className="px-5 text-3xl font-extrabold">Password change</legend>

                <label className="mt-4 block text-lg">
                    Current password (leave blank to leave unchanged)
                    <input
                        type="password"
                        value={accountDetails.currentPassword}
                        onChange={(event) => handleAccountChange("currentPassword", event.target.value)}
                        className="mt-3 h-[52px] w-full border border-gray-200 px-4 outline-none focus:border-pink-300"
                    />
                </label>

                <label className="mt-7 block text-lg">
                    New password (leave blank to leave unchanged)
                    <input
                        type="password"
                        value={accountDetails.newPassword}
                        onChange={(event) => handleAccountChange("newPassword", event.target.value)}
                        className="mt-3 h-[52px] w-full border border-gray-200 px-4 outline-none focus:border-pink-300"
                    />
                </label>

                <label className="mt-7 block text-lg">
                    Confirm new password
                    <input
                        type="password"
                        value={accountDetails.confirmPassword}
                        onChange={(event) => handleAccountChange("confirmPassword", event.target.value)}
                        className="mt-3 h-[52px] w-full border border-gray-200 px-4 outline-none focus:border-pink-300"
                    />
                </label>
            </fieldset>

            <button
                type="submit"
                className="mt-8 h-[52px] bg-[#2b2b2b] px-9 text-base font-extrabold uppercase text-white transition hover:bg-pink-600"
            >
                Save changes
            </button>
        </form>
    );

    const renderAddressForm = (type) => {
        const form = addressForms[type];
        const title = type === "billing" ? "Billing address" : "Shipping address";

        return (
            <form onSubmit={(event) => saveAddress(event, type)} className="max-w-[1100px]">
                <h2 className="mb-8 text-3xl font-extrabold">{title}</h2>

                <div className="grid gap-8 md:grid-cols-2">
                    <label className="block text-lg">
                        First Name <span className="text-red-500">*</span>
                        <input
                            required
                            value={form.firstName}
                            onChange={(event) => handleAddressChange(type, "firstName", event.target.value)}
                            className="mt-3 h-[52px] w-full border border-gray-200 px-4 outline-none focus:border-pink-300"
                        />
                    </label>
                    <label className="block text-lg">
                        Last Name <span className="text-red-500">*</span>
                        <input
                            required
                            value={form.lastName}
                            onChange={(event) => handleAddressChange(type, "lastName", event.target.value)}
                            className="mt-3 h-[52px] w-full border border-gray-200 px-4 outline-none focus:border-pink-300"
                        />
                    </label>
                </div>

                <label className="mt-7 block text-lg">
                    Country / Region <span className="text-red-500">*</span>
                    <p className="mt-3 font-semibold text-gray-600">Sri Lanka</p>
                </label>

                <label className="mt-7 block max-w-[528px] text-lg">
                    Street Address <span className="text-red-500">*</span>
                    <input
                        required
                        value={form.street}
                        onChange={(event) => handleAddressChange(type, "street", event.target.value)}
                        className="mt-3 h-[52px] w-full border border-gray-200 px-4 outline-none focus:border-pink-300"
                        placeholder="House number and street name"
                    />
                </label>

                <label className="mt-7 block max-w-[528px] text-lg">
                    District  (optional)
                    <select
                        value={form.district}
                        onChange={(event) => handleAddressChange(type, "district", event.target.value)}
                        className="mt-3 h-[52px] w-full border border-gray-200 px-4 text-gray-500 outline-none focus:border-pink-300"
                    >
                        <option value="">Select an option...</option>
                        {districts.map((district) => (
                            <option key={district} value={district}>
                                {district}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="mt-7 block max-w-[528px] text-lg">
                    Town / City <span className="text-red-500">* *</span>
                    <select
                        required
                        value={form.city}
                        onChange={(event) => handleAddressChange(type, "city", event.target.value)}
                        className="mt-3 h-[52px] w-full border border-gray-200 px-4 text-gray-500 outline-none focus:border-pink-300"
                    >
                        <option value="">Select an option...</option>
                        {sriLankanCities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="mt-7 block max-w-[528px] text-lg">
                    Phone <span className="text-red-500">*</span>
                    <input
                        required
                        value={form.phone}
                        onChange={(event) => handleAddressChange(type, "phone", event.target.value)}
                        className="mt-3 h-[52px] w-full border border-gray-200 px-4 outline-none focus:border-pink-300"
                    />
                </label>

                <label className="mt-7 block max-w-[528px] text-lg">
                    Secondary Number (optional)
                    <input
                        value={form.secondaryPhone}
                        onChange={(event) => handleAddressChange(type, "secondaryPhone", event.target.value)}
                        className="mt-3 h-[52px] w-full border border-gray-200 px-4 outline-none focus:border-pink-300"
                    />
                </label>

                <label className="mt-7 block max-w-[528px] text-lg">
                    Email address <span className="text-red-500">*</span>
                    <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(event) => handleAddressChange(type, "email", event.target.value)}
                        className="mt-3 h-[52px] w-full border border-gray-200 px-4 outline-none focus:border-pink-300"
                    />
                </label>

                <button
                    type="submit"
                    className="mt-8 h-[52px] bg-[#2b2b2b] px-9 text-base font-extrabold uppercase text-white transition hover:bg-pink-600"
                >
                    Save address
                </button>
            </form>
        );
    };

    return (
        <main className="min-h-screen bg-white text-gray-950">
            <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
                <img
                    src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=1800&q=85"
                    alt="Skincare products"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1460px] flex-col items-center justify-center px-6 text-center text-white sm:min-h-[320px]">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">My account</h1>
                    <div className="mt-6 flex items-center gap-3 text-lg font-medium">
                        <Link to="/" className="text-white/85 transition hover:text-white">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="font-bold">My account</span>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1460px] px-6 py-12 sm:py-16">
                <div className="grid gap-10 lg:grid-cols-[315px_1fr]">
                    <aside className="border-gray-200 lg:border-r lg:pr-9">
                        <h2 className="border-b border-gray-200 pb-5 text-2xl font-extrabold uppercase">
                            My Account
                        </h2>
                        <nav className="mt-5 space-y-1 text-lg font-bold">
                            {menuItems.map((item) =>
                                item.view ? (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onClick={() => setActiveView(item.view)}
                                        className={`block w-full px-5 py-3 text-left transition hover:bg-[#f2f2f2] hover:text-pink-600 ${
                                            activeView === item.view ? "bg-[#f2f2f2]" : ""
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ) : (
                                    <Link
                                        key={item.label}
                                        to={item.to}
                                        className="block px-5 py-3 transition hover:bg-[#f2f2f2] hover:text-pink-600"
                                    >
                                        {item.label}
                                    </Link>
                                )
                            )}
                            <button
                                type="button"
                                onClick={logoutHandler}
                                className="block w-full px-5 py-3 text-left transition hover:bg-[#f2f2f2] hover:text-pink-600"
                            >
                                Logout
                            </button>
                        </nav>
                    </aside>

                    <section className="lg:pl-1">
                        {activeView === "addresses" ? (
                            <>
                                <p className="text-lg leading-8 text-gray-600">
                                    The following addresses will be used on the checkout page by default.
                                </p>

                                <div className="mt-8 grid gap-12 lg:grid-cols-2">
                                    {[
                                        ["Billing Address", "Add Billing address"],
                                        ["Shipping Address", "Add Shipping address"],
                                    ].map(([title, action]) => (
                                        <section key={title}>
                                            <h2 className="text-3xl font-extrabold uppercase">{title}</h2>
                                            <button
                                                type="button"
                                                onClick={() => setActiveView(title === "Billing Address" ? "editBilling" : "editShipping")}
                                                className="mt-7 inline-flex items-center gap-3 text-xl transition hover:text-pink-600"
                                            >
                                                <Icon name="edit" className="h-5 w-5" />
                                                {action}
                                            </button>
                                            <p className="mt-8 text-xl italic leading-8 text-gray-600">
                                                You have not set up this type of address yet.
                                            </p>
                                        </section>
                                    ))}
                                </div>
                            </>
                        ) : activeView === "editBilling" ? (
                            renderAddressForm("billing")
                        ) : activeView === "editShipping" ? (
                            renderAddressForm("shipping")
                        ) : activeView === "accountDetails" ? (
                            renderAccountDetailsForm()
                        ) : (
                            <>
                                <p className="text-lg leading-8 text-gray-600">
                                    Hello <strong>{displayName}</strong> (not <strong>{displayName}</strong>?{" "}
                                    <button
                                        type="button"
                                        onClick={logoutHandler}
                                        className="font-semibold text-gray-950 transition hover:text-pink-600"
                                    >
                                        Log out
                                    </button>
                                    )
                                </p>
                                <p className="mt-7 max-w-[1120px] text-lg leading-8 text-gray-600">
                                    From your account dashboard you can view your{" "}
                                    <Link to="/orders" className="font-semibold text-gray-950 hover:text-pink-600">
                                        recent orders
                                    </Link>
                                    , manage your{" "}
                                    <button
                                        type="button"
                                        onClick={() => setActiveView("addresses")}
                                        className="font-semibold text-gray-950 hover:text-pink-600"
                                    >
                                        shipping and billing addresses
                                    </button>
                                    , and edit your{" "}
                                    <span className="font-semibold text-gray-950">password and account details</span>.
                                </p>

                                <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {dashboardTiles.map((tile) => {
                                        const content = (
                                            <>
                                                <Icon name={tile.icon} className="mb-4 h-16 w-16 text-gray-300 transition group-hover:text-gray-950" />
                                                <span className="text-lg font-bold">{tile.label}</span>
                                            </>
                                        );

                                        if (tile.action || tile.view) {
                                            return (
                                                <button
                                                    key={tile.label}
                                                    type="button"
                                                    onClick={tile.action || (() => setActiveView(tile.view))}
                                                    className="group flex min-h-[154px] flex-col items-center justify-center border border-gray-200 bg-white px-6 py-8 text-center shadow-[0_1px_10px_rgba(0,0,0,0.08)] transition hover:border-gray-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
                                                >
                                                    {content}
                                                </button>
                                            );
                                        }

                                        return (
                                            <Link
                                                key={tile.label}
                                                to={tile.to}
                                                className="group flex min-h-[154px] flex-col items-center justify-center border border-gray-200 bg-white px-6 py-8 text-center shadow-[0_1px_10px_rgba(0,0,0,0.08)] transition hover:border-gray-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
                                            >
                                                {content}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </section>
        </main>
    );
};

export default ProfilePage;
