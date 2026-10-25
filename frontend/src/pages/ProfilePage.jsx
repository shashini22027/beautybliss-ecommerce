import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import api from "../services/api";
import { loginSuccess } from "../redux/slices/authSlice";
import { selectWishlistItems } from "../redux/slices/wishlistSlice";

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
    const dispatch = useDispatch();
    const { search } = useLocation();
    const passwordReset = new URLSearchParams(search).get("password_reset") === "true";
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
    const [accountSaving, setAccountSaving] = useState(false);
    const [savedRoutines, setSavedRoutines] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(false);
    const [appointmentsError, setAppointmentsError] = useState("");
    const [dashboardOrders, setDashboardOrders] = useState([]);
    const [dashboardAppointments, setDashboardAppointments] = useState([]);
    const [rewardSummary, setRewardSummary] = useState(null);
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [dashboardError, setDashboardError] = useState("");
    const accountId = storedUser?._id || storedUser?.id;
    const wishlistItems = useSelector(selectWishlistItems);

    useEffect(() => {
        if (!storedUser) {
            navigate("/login?redirect=/profile");
        }
    }, [navigate, storedUser]);

    useEffect(() => {
        if (!accountId) return;
        api.get('/users/profile').then(({ data }) => {
            const nameParts = String(data.name || '').trim().split(/\s+/).filter(Boolean);
            setAccountDetails((current) => ({ ...current, firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' '), displayName: data.name || '', email: data.email || '' }));
            setAddressForms((current) => ({ billing: data.addresses?.billing || current.billing, shipping: data.addresses?.shipping || current.shipping }));
            setSavedRoutines(data.savedRoutines || []);
            const latestUser = getStoredUser();
            dispatch(loginSuccess({ ...latestUser, ...data, token: latestUser?.token }));
        }).catch((error) => setAccountError(error.response?.data?.message || 'Could not load your saved account details.'));
    }, [accountId, dispatch]);

    useEffect(() => {
        if (!accountId) return undefined;
        let active = true;
        setDashboardLoading(true);
        setDashboardError("");
        Promise.allSettled([api.get('/orders/myorders'), api.get('/appointments/mine'), api.get('/users/profile/rewards')])
            .then(([ordersResult, appointmentsResult, rewardsResult]) => {
                if (!active) return;
                let failed = false;
                if (ordersResult.status === 'fulfilled') {
                    const orderData = ordersResult.value.data;
                    setDashboardOrders(Array.isArray(orderData) ? orderData : orderData.orders || []);
                } else failed = true;
                if (appointmentsResult.status === 'fulfilled') {
                    const appointmentData = appointmentsResult.value.data;
                    setDashboardAppointments(Array.isArray(appointmentData) ? appointmentData : []);
                } else failed = true;
                if (rewardsResult.status === 'fulfilled') setRewardSummary(rewardsResult.value.data);
                else failed = true;
                if (failed) setDashboardError('Some account activity could not be loaded. You can still open each section for details.');
            })
            .finally(() => { if (active) setDashboardLoading(false); });
        return () => { active = false; };
    }, [accountId]);

    const todayInColombo = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date());
    const upcomingAppointments = dashboardAppointments
        .filter((appointment) => appointment.appointmentDate >= todayInColombo && ['pending', 'confirmed'].includes(appointment.status))
        .sort((first, second) => `${first.appointmentDate} ${first.time}`.localeCompare(`${second.appointmentDate} ${second.time}`));
    const recentDashboardOrder = [...dashboardOrders].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))[0];
    const latestSavedRoutine = [...savedRoutines].sort((first, second) => new Date(second.savedAt) - new Date(first.savedAt))[0];

    const logoutHandler = () => {
        const keysToRemove = [
            'userInfo', 'cartItems', 'cart', 'checkoutOrders', 
            'pendingPaymentOrder', 'wishlistItems', 'billingAddress', 'shippingAddress'
        ];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        window.location.href = '/login';
    };

    const menuItems = [
        { label: "Dashboard", view: "dashboard" },
        { label: "Orders", to: "/orders" },
        { label: "Appointments", view: "appointments" },
        { label: "Rewards", view: "rewards" },
        { label: "Saved routines", view: "routines" },
        { label: "Addresses", view: "addresses" },
        { label: "Account details", view: "accountDetails" },
        { label: "Wishlist", to: "/wishlist" },
    ];

    const dashboardTiles = [
        { label: "Orders", icon: "orders", to: "/orders" },
        { label: "Appointments", icon: "orders", view: "appointments" },
        { label: "Beauty rewards", icon: "heart", view: "rewards" },
        { label: "Saved routines", icon: "heart", view: "routines" },
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

    const saveAddress = async (event, type) => {
        event.preventDefault();
        setAccountSaving(true);
        setAccountError("");
        try {
            const { data } = await api.put('/users/profile', { addresses: { [type]: addressForms[type] } });
            localStorage.setItem(`${type}Address`, JSON.stringify(addressForms[type]));
            setAddressForms((current) => ({ ...current, [type]: data.addresses?.[type] || current[type] }));
            setAccountMessage(`${type === 'billing' ? 'Billing' : 'Shipping'} address saved to your account.`);
            setActiveView("addresses");
        } catch (error) {
            setAccountError(error.response?.data?.message || 'Could not save this address. Please try again.');
        } finally { setAccountSaving(false); }
    };

    useEffect(() => {
        if (activeView !== 'appointments') return;
        let active = true;
        setAppointmentsLoading(true);
        setAppointmentsError('');
        api.get('/appointments/mine').then(({ data }) => {
            if (active) setAppointments(Array.isArray(data) ? data : []);
        }).catch((error) => {
            if (active) setAppointmentsError(error.response?.data?.message || 'Could not load your appointment history.');
        }).finally(() => { if (active) setAppointmentsLoading(false); });
        return () => { active = false; };
    }, [activeView]);

    const removeSavedRoutine = async (routineId) => {
        try {
            const { data } = await api.delete(`/users/profile/routines/${routineId}`);
            setSavedRoutines(data.savedRoutines || []);
        } catch (error) {
            setAccountError(error.response?.data?.message || 'Could not remove the saved routine.');
        }
    };

    const handleAccountChange = (field, value) => {
        setAccountDetails((currentDetails) => {
            const updated = { ...currentDetails, [field]: value };
            if (field === 'firstName' || field === 'lastName') {
                updated.displayName = [updated.firstName, updated.lastName].filter(Boolean).join(' ');
            } else if (field === 'displayName') {
                const nameParts = value.trim().split(/\s+/).filter(Boolean);
                updated.firstName = nameParts[0] || '';
                updated.lastName = nameParts.slice(1).join(' ');
            }
            return updated;
        });
        setAccountMessage("");
        setAccountError("");
    };

    const saveAccountDetails = async (event) => {
        event.preventDefault();
        setAccountMessage("");
        setAccountError("");

        if (accountDetails.newPassword && accountDetails.newPassword !== accountDetails.confirmPassword) {
            setAccountError("New passwords do not match.");
            return;
        }
        const sensitiveChange = accountDetails.email !== storedUser?.email || Boolean(accountDetails.newPassword);
        if (sensitiveChange && !accountDetails.currentPassword) {
            setAccountError('Enter your current password to change your email or password.');
            return;
        }
        setAccountSaving(true);
        try {
            const { data } = await api.put('/users/profile', {
                name: accountDetails.displayName,
                email: accountDetails.email,
                currentPassword: accountDetails.currentPassword,
                newPassword: accountDetails.newPassword || undefined,
            });
            dispatch(loginSuccess({ ...storedUser, ...data, token: data.token || storedUser.token }));
            setAccountDetails((currentDetails) => ({ ...currentDetails, currentPassword: "", newPassword: "", confirmPassword: "" }));
            setAccountMessage("Account details saved to your account.");
        } catch (error) {
            setAccountError(error.response?.data?.message || 'Could not save your account details. Please try again.');
        } finally { setAccountSaving(false); }
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
                disabled={accountSaving}
                className="mt-8 h-[52px] bg-[#2b2b2b] px-9 text-base font-extrabold uppercase text-white transition hover:bg-pink-600 disabled:cursor-wait disabled:opacity-60"
            >
                {accountSaving ? 'Saving…' : 'Save changes'}
            </button>
            <section className="mt-12 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900">Privacy and account removal</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">To request account deletion or help with personal information, contact support. Include the email on your account; support may need to confirm your identity and review open orders or appointments.</p>
                <a href={`mailto:consultant@beautybliss.com?subject=${encodeURIComponent('Account deletion request')}&body=${encodeURIComponent(`Please help me with an account deletion request. Account email: ${storedUser?.email || ''}`)}`} className="mt-3 inline-block text-sm font-semibold text-rose-700 underline">Request account deletion</a>
            </section>
        </form>
    );

    const renderAddressForm = (type) => {
        const form = addressForms[type];
        const title = type === "billing" ? "Billing address" : "Shipping address";

        return (
            <form onSubmit={(event) => saveAddress(event, type)} className="max-w-[1100px]">
                {accountError && <div role="alert" className="mb-6 border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{accountError}</div>}
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
                    disabled={accountSaving}
                    className="mt-8 h-[52px] bg-[#2b2b2b] px-9 text-base font-extrabold uppercase text-white transition hover:bg-pink-600 disabled:cursor-wait disabled:opacity-60"
                >
                    {accountSaving ? 'Saving…' : 'Save address'}
                </button>
            </form>
        );
    };

    return (
        <main className="min-h-screen bg-white text-gray-950">
            <section className="bb-page-title-banner flex items-center justify-center">
                <img
                    src="/images/banner.jpg"
                    alt="Skincare products"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 flex w-full items-center justify-center px-4 text-center text-white">
                    <h1>My Account</h1>
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
                        {activeView === "rewards" ? (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a94f61]">BeautyBliss loyalty</p>
                                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Beauty rewards</h2>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">Earn 1 point for every LKR 100 in a successfully paid order. Points do not expire. Unpaid and refunded orders do not earn points.</p>
                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    <article className="border border-[#ead4d6] bg-[#fff7f7] p-6">
                                        <p className="text-sm font-medium text-gray-600">Lifetime points earned</p>
                                        <p className="mt-2 text-4xl font-semibold text-gray-950" aria-live="polite">{rewardSummary ? Number(rewardSummary.points || 0).toLocaleString() : '—'}</p>
                                        <p className="mt-2 text-xs text-gray-500">Calculated from eligible paid orders on your account.</p>
                                    </article>
                                    <article className="border border-[#eee5e1] bg-[#fbf8f5] p-6">
                                        <p className="text-sm font-medium text-gray-600">Eligible purchases</p>
                                        <p className="mt-2 text-2xl font-semibold text-gray-950">{rewardSummary ? `${rewardSummary.eligibleOrderCount} orders` : '—'}</p>
                                        <p className="mt-2 text-xs text-gray-500">LKR {Number(rewardSummary?.eligibleSpend || 0).toLocaleString()} paid total.</p>
                                    </article>
                                </div>
                                <div className="mt-6 border border-gray-200 bg-white p-5">
                                    <h3 className="font-semibold">Recent points activity</h3>
                                    {!rewardSummary ? <p className="mt-3 text-sm text-gray-500">Loading rewards…</p> : rewardSummary.recentEligibleOrders?.length ? <ul className="mt-3 divide-y divide-gray-100">{rewardSummary.recentEligibleOrders.map((order, index) => <li key={`${order.orderNo || index}-${order.paidAt || ''}`} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><span><span className="font-medium">{order.orderNo || 'Paid order'}</span><span className="ml-2 text-gray-500">{order.paidAt ? new Date(order.paidAt).toLocaleDateString() : ''}</span></span><span className="font-semibold text-[#884252]">+{order.points} points</span></li>)}</ul> : <p className="mt-3 text-sm leading-6 text-gray-600">No qualifying paid orders yet. Points will appear here after payment is confirmed.</p>}
                                </div>
                                <p className="mt-4 text-xs leading-5 text-gray-500">Points currently track qualifying purchases. They cannot yet be redeemed at checkout.</p>
                            </div>
                        ) : activeView === "appointments" ? (
                            <div>
                                <h2 className="text-3xl font-extrabold uppercase">Appointment history</h2>
                                <p className="mt-3 text-sm leading-6 text-gray-600">Requests show as pending until the consultant confirms them. Cancellation and rescheduling links are sent by email.</p>
                                {appointmentsLoading ? <p className="mt-8 text-sm text-gray-500">Loading appointments…</p> : appointmentsError ? <p role="alert" className="mt-6 bg-red-50 p-4 text-sm text-red-700">{appointmentsError}</p> : appointments.length === 0 ? <p className="mt-8 border border-gray-200 p-8 text-center text-sm text-gray-500">No appointments found for this account.</p> : <div className="mt-6 space-y-4">{appointments.map((appointment) => <article key={appointment._id} className="rounded-lg border border-gray-200 p-5"><div className="flex flex-wrap justify-between gap-3"><h3 className="font-semibold">{appointment.appointmentDate} at {appointment.time} · {appointment.mode}</h3><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-900">{appointment.status}</span></div><p className="mt-2 text-sm text-gray-600">{appointment.concern || 'Skin consultation'} · Sri Lanka time</p></article>)}</div>}
                            </div>
                        ) : activeView === "routines" ? (
                            <div>
                                <h2 className="text-3xl font-extrabold uppercase">Saved skincare routines</h2>
                                <p className="mt-3 text-sm leading-6 text-gray-600">Your saved routines are attached to your account and can be reopened from the skin consultation page.</p>
                                {accountError && <p role="alert" className="mt-4 bg-red-50 p-3 text-sm text-red-700">{accountError}</p>}
                                {savedRoutines.length === 0 ? <p className="mt-8 border border-gray-200 p-8 text-center text-sm text-gray-500">No routines saved yet. Visit <Link className="font-semibold text-pink-700 underline" to="/skin-consultation">Skin consultation</Link> to create one.</p> : <div className="mt-6 space-y-4">{savedRoutines.map((routine) => <article key={routine._id || `${routine.concernId}-${routine.skinType}`} className="flex flex-wrap items-center justify-between gap-4 border border-gray-200 p-5"><div><h3 className="font-semibold">{routine.concernTitle}</h3><p className="mt-1 text-sm text-gray-600">{routine.skinType} skin · {routine.sensitivity || 'Sensitivity not set'} · Saved {new Date(routine.savedAt).toLocaleDateString()}</p></div><div className="flex items-center gap-4"><Link to="/skin-consultation" className="text-sm font-semibold text-pink-700 underline">Open consultation</Link><button type="button" onClick={() => removeSavedRoutine(routine._id)} className="text-sm font-semibold text-red-700 underline">Remove</button></div></article>)}</div>}
                            </div>
                        ) : activeView === "addresses" ? (
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
                                            {addressForms[title === 'Billing Address' ? 'billing' : 'shipping']?.street ? <address className="mt-6 not-italic leading-7 text-gray-600">{addressForms[title === 'Billing Address' ? 'billing' : 'shipping'].firstName} {addressForms[title === 'Billing Address' ? 'billing' : 'shipping'].lastName}<br />{addressForms[title === 'Billing Address' ? 'billing' : 'shipping'].street}<br />{addressForms[title === 'Billing Address' ? 'billing' : 'shipping'].city}, {addressForms[title === 'Billing Address' ? 'billing' : 'shipping'].district}<br />{addressForms[title === 'Billing Address' ? 'billing' : 'shipping'].phone}</address> : <p className="mt-8 text-xl italic leading-8 text-gray-600">You have not set up this type of address yet.</p>}
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
                                {passwordReset && (
                                    <div className="mb-8 flex items-center gap-4 rounded bg-[#54a155] px-6 py-4 text-[15px] font-medium text-white shadow-sm">
                                        <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Your password has been reset successfully.
                                    </div>
                                )}
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

                                <section className="mt-8" aria-labelledby="beauty-overview-heading">
                                    <div className="flex flex-wrap items-end justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a94f61]">Your BeautyBliss</p>
                                            <h2 id="beauty-overview-heading" className="mt-1 text-2xl font-semibold tracking-tight">Beauty overview</h2>
                                        </div>
                                        <Link to="/skin-consultation" className="text-sm font-semibold text-[#884252] underline">Get beauty recommendations</Link>
                                    </div>
                                    {dashboardError && <p role="status" className="mt-4 border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{dashboardError}</p>}
                                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                        {[
                                            { label: 'Orders', value: dashboardLoading ? '…' : dashboardOrders.length, to: '/orders', hint: 'View purchases and delivery updates' },
                                            { label: 'Upcoming appointments', value: dashboardLoading ? '…' : upcomingAppointments.length, view: 'appointments', hint: 'Requests and confirmed sessions' },
                                            { label: 'Saved routines', value: savedRoutines.length, view: 'routines', hint: latestSavedRoutine ? 'Latest: ' + latestSavedRoutine.concernTitle : 'Build a routine for your needs' },
                                            { label: 'Reward points', value: dashboardLoading ? '…' : (rewardSummary?.points || 0).toLocaleString(), view: 'rewards', hint: 'Earn points on paid orders' },
                                            { label: 'Wishlist', value: wishlistItems.length, to: '/wishlist', hint: 'Your saved product picks' },
                                        ].map((item) => {
                                            const card = <><span className="text-sm font-medium text-gray-600">{item.label}</span><span className="mt-2 block text-3xl font-semibold text-gray-950">{item.value}</span><span className="mt-2 block text-xs leading-5 text-gray-500">{item.hint}</span></>;
                                            return item.to ? <Link key={item.label} to={item.to} className="border border-[#eee5e1] bg-[#fbf8f5] p-4 transition hover:border-[#c98b96]">{card}</Link> : <button key={item.label} type="button" onClick={() => setActiveView(item.view)} className="border border-[#eee5e1] bg-[#fbf8f5] p-4 text-left transition hover:border-[#c98b96]">{card}</button>;
                                        })}
                                    </div>
                                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                        <article className="border border-[#eee5e1] bg-white p-5">
                                            <div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Recent order</h3><Link to="/orders" className="text-sm font-medium text-[#884252] underline">Order history</Link></div>
                                            {recentDashboardOrder ? <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm"><div><p className="font-medium">{recentDashboardOrder.orderNo || 'BeautyBliss order'}</p><p className="mt-1 text-gray-500">{recentDashboardOrder.createdAt ? new Date(recentDashboardOrder.createdAt).toLocaleDateString() : 'Date unavailable'} · {recentDashboardOrder.isPaid ? 'Paid' : 'Payment pending'} · {recentDashboardOrder.isDelivered ? 'Delivered' : 'In progress'}</p></div><span className="font-semibold">{typeof recentDashboardOrder.totalPrice === 'number' ? 'LKR ' + recentDashboardOrder.totalPrice.toLocaleString() : 'View order'}</span></div> : <p className="mt-3 text-sm leading-6 text-gray-600">{dashboardLoading ? 'Loading your orders…' : 'Your recent purchases will appear here.'}</p>}
                                        </article>
                                        <article className="border border-[#eee5e1] bg-white p-5">
                                            <div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Next consultation</h3><button type="button" onClick={() => setActiveView('appointments')} className="text-sm font-medium text-[#884252] underline">Appointment history</button></div>
                                            {upcomingAppointments[0] ? <div className="mt-3 text-sm"><p className="font-medium">{upcomingAppointments[0].appointmentDate} at {upcomingAppointments[0].time} · Sri Lanka time</p><p className="mt-1 text-gray-500">{upcomingAppointments[0].concern || 'Beauty consultation'} · <span className="capitalize">{upcomingAppointments[0].status}</span></p></div> : <p className="mt-3 text-sm leading-6 text-gray-600">{dashboardLoading ? 'Loading your appointments…' : 'No upcoming consultation. You can request a time with our beauty consultant.'}</p>}
                                            <Link to="/skin-consultation#appointment" className="mt-3 inline-block text-sm font-semibold text-[#884252] underline">Book a consultation</Link>
                                        </article>
                                    </div>
                                    <article className="mt-4 flex flex-col justify-between gap-4 border border-[#ead4d6] bg-[#fff7f7] p-5 sm:flex-row sm:items-center">
                                        <div><h3 className="font-semibold">{latestSavedRoutine ? 'Continue your ' + latestSavedRoutine.concernTitle.toLowerCase() + ' routine' : 'Find products for your skin routine'}</h3><p className="mt-1 text-sm leading-6 text-gray-600">{latestSavedRoutine ? 'Your saved profile is ' + latestSavedRoutine.skinType.toLowerCase() + ' skin. Review the routine and current catalog recommendations.' : 'Answer a few questions to explore a morning and evening routine with products from the current catalog.'}</p></div>
                                        <Link to={latestSavedRoutine ? '/products?skinConcern=' + encodeURIComponent(latestSavedRoutine.concernId) : '/skin-consultation'} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-sm bg-[#292526] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a94f61]">{latestSavedRoutine ? 'Shop routine matches' : 'Start consultation'}</Link>
                                    </article>
                                </section>

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
