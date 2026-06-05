import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice, parsePrice } from "../utils/currency";

const getCartItems = () => {
    try {
        const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

        if (Array.isArray(storedCartItems) && storedCartItems.length) return storedCartItems;
        if (Array.isArray(storedCartItems?.cartItems) && storedCartItems.cartItems.length) return storedCartItems.cartItems;
        if (Array.isArray(storedCart) && storedCart.length) return storedCart;
        if (Array.isArray(storedCart?.cartItems)) return storedCart.cartItems;
        return [];
    } catch {
        return [];
    }
};

const getProductData = (item) => {
    if (item?.product && typeof item.product === "object") {
        return { ...item.product, qty: item.qty || item.quantity, quantity: item.quantity || item.qty };
    }

    return item || {};
};

const getItemQty = (item) => Number(item.qty || item.quantity || 1);

const getItemPrice = (item) => {
    const product = getProductData(item);
    return parsePrice(product.price);
};

const getItemId = (item) => {
    const product = getProductData(item);
    const productId = item?.product && typeof item.product !== "object" ? item.product : "";
    return product._id || product.id || item?._id || item?.id || productId || product.name;
};

const getSavedCheckoutOrders = () => {
    try {
        const savedOrders = JSON.parse(localStorage.getItem("checkoutOrders") || "[]");
        return Array.isArray(savedOrders) ? savedOrders : [];
    } catch {
        return [];
    }
};

const sriLankanCities = [
    "Colombo",
    "Dehiwala-Mount Lavinia",
    "Moratuwa",
    "Sri Jayawardenepura Kotte",
    "Negombo",
    "Gampaha",
    "Kelaniya",
    "Kadawatha",
    "Ja-Ela",
    "Wattala",
    "Ragama",
    "Kandana",
    "Panadura",
    "Kalutara",
    "Horana",
    "Kandy",
    "Peradeniya",
    "Katugastota",
    "Gampola",
    "Nawalapitiya",
    "Matale",
    "Dambulla",
    "Kurunegala",
    "Kuliyapitiya",
    "Puttalam",
    "Chilaw",
    "Anuradhapura",
    "Polonnaruwa",
    "Trincomalee",
    "Batticaloa",
    "Ampara",
    "Kalmunai",
    "Jaffna",
    "Vavuniya",
    "Mannar",
    "Kilinochchi",
    "Galle",
    "Hikkaduwa",
    "Matara",
    "Weligama",
    "Hambantota",
    "Tangalle",
    "Ratnapura",
    "Embilipitiya",
    "Badulla",
    "Bandarawela",
    "Ella",
    "Nuwara Eliya",
    "Hatton",
    "Monaragala",
];

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

const initialCheckoutForm = {
    billingFirstName: "",
    billingLastName: "",
    billingStreet: "",
    billingCity: "",
    billingPhone: "",
    billingSecondaryPhone: "",
    billingEmail: "",
    shippingFirstName: "",
    shippingLastName: "",
    shippingStreet: "",
    shippingDistrict: "",
    shippingCity: "",
    shippingPhone: "",
    orderNotes: "",
};

const fieldLabels = {
    billingFirstName: "First name",
    billingLastName: "Last name",
    billingStreet: "Street address",
    billingCity: "Town / City",
    billingPhone: "Phone",
    billingEmail: "Email address",
    shippingFirstName: "Shipping first name",
    shippingLastName: "Shipping last name",
    shippingStreet: "Shipping street address",
    shippingCity: "Shipping city",
    shippingPhone: "Shipping phone",
};

const requiredBillingFields = [
    "billingFirstName",
    "billingLastName",
    "billingStreet",
    "billingCity",
    "billingPhone",
    "billingEmail",
];

const requiredShippingFields = [
    "shippingFirstName",
    "shippingLastName",
    "shippingStreet",
    "shippingCity",
    "shippingPhone",
];

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [shipDifferent, setShipDifferent] = useState(true);
    const [cartItems, setCartItems] = useState(getCartItems);
    const [checkoutForm, setCheckoutForm] = useState(initialCheckoutForm);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");

    const subtotal = useMemo(
        () => cartItems.reduce((total, item) => total + getItemPrice(item) * getItemQty(item), 0),
        [cartItems]
    );

    const saveCart = (items) => {
        setCartItems(items);
        localStorage.setItem("cartItems", JSON.stringify(items));
        localStorage.setItem("cart", JSON.stringify(items));
    };

    const removeItem = (targetItem) => {
        const targetProduct = getProductData(targetItem);
        const targetKey = targetProduct._id || targetProduct.id || targetProduct.name;
        saveCart(
            cartItems.filter((item) => {
                const product = getProductData(item);
                const key = product._id || product.id || product.name;
                return key !== targetKey;
            })
        );
    };

    const handleFieldChange = (event) => {
        const { name, value } = event.target;

        setCheckoutForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));

        setErrors((currentErrors) => {
            if (!currentErrors[name]) return currentErrors;
            const nextErrors = { ...currentErrors };
            delete nextErrors[name];
            return nextErrors;
        });
        setFormError("");
    };

    const validateCheckout = () => {
        const nextErrors = {};
        const requiredFields = shipDifferent
            ? [...requiredBillingFields, ...requiredShippingFields]
            : requiredBillingFields;

        requiredFields.forEach((fieldName) => {
            if (!String(checkoutForm[fieldName] || "").trim()) {
                nextErrors[fieldName] = `${fieldLabels[fieldName]} is required.`;
            }
        });

        if (checkoutForm.billingEmail && !/^\S+@\S+\.\S+$/.test(checkoutForm.billingEmail)) {
            nextErrors.billingEmail = "Enter a valid email address.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handlePlaceOrder = () => {
        if (cartItems.length === 0) {
            setFormError("Your cart is empty. Add products before placing an order.");
            return;
        }

        if (!validateCheckout()) {
            setFormError("Please fill all required fields before placing your order.");
            return;
        }

        const savedOrders = getSavedCheckoutOrders();
        const orderItems = cartItems.map((item) => {
            const product = getProductData(item);
            const qty = getItemQty(item);
            const price = getItemPrice(item);

            return {
                _id: getItemId(item),
                product: getItemId(item),
                name: product.name || "BeautyBliss product",
                qty,
                quantity: qty,
                image: product.image || product.images?.[0] || "",
                images: product.images || (product.image ? [product.image] : []),
                price,
                lineTotal: price * qty,
            };
        });
        const orderTotal = orderItems.reduce((total, item) => total + item.lineTotal, 0);
        const customerName = `${checkoutForm.billingFirstName} ${checkoutForm.billingLastName}`.trim();
        const shippingName = shipDifferent
            ? `${checkoutForm.shippingFirstName} ${checkoutForm.shippingLastName}`.trim()
            : customerName;

        const checkoutOrder = {
            _id: `checkout-${Date.now()}`,
            orderNo: `C${String(52 + savedOrders.length).padStart(4, "0")}`,
            orderItems,
            subtotal: orderTotal,
            shippingPrice: 0,
            totalPrice: orderTotal,
            paymentMethod,
            isPaid: paymentMethod === "card",
            isDelivered: false,
            createdAt: new Date().toISOString(),
            customer: {
                name: customerName,
                email: checkoutForm.billingEmail,
                phone: checkoutForm.billingPhone,
            },
            shippingAddress: {
                fullName: shippingName,
                phone: shipDifferent ? checkoutForm.shippingPhone : checkoutForm.billingPhone,
                address: shipDifferent ? checkoutForm.shippingStreet : checkoutForm.billingStreet,
                city: shipDifferent ? checkoutForm.shippingCity : checkoutForm.billingCity,
                district: shipDifferent ? checkoutForm.shippingDistrict : "",
                country: "Sri Lanka",
            },
            orderNotes: checkoutForm.orderNotes,
            source: "checkout",
        };

        localStorage.setItem("checkoutOrders", JSON.stringify([checkoutOrder, ...savedOrders]));
        navigate("/orders");
    };

    const getFieldClassName = (fieldName, extraClasses = "") =>
        `${extraClasses} border ${
            errors[fieldName] ? "border-red-400" : "border-gray-200"
        } outline-none focus:border-pink-300`;

    const renderError = (fieldName) =>
        errors[fieldName] ? (
            <p className="mt-2 text-sm font-semibold text-red-600">{errors[fieldName]}</p>
        ) : null;

    return (
        <main className="min-h-screen bg-white text-gray-950">
            <section className="relative min-h-[195px] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1800&q=85"
                    alt="Beauty checkout"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 mx-auto flex min-h-[195px] max-w-[1540px] items-center justify-center px-6 text-white">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-3xl font-extrabold uppercase">
                        <Link to="/cart" className="text-white/80 transition hover:text-white">
                            Shopping Cart
                        </Link>
                        <span className="text-white/80">→</span>
                        <span className="border-b-4 border-black pb-2">Checkout</span>
                        <span className="text-white/80">→</span>
                        <span className="text-white/80">Order Complete</span>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1460px] px-6 py-12">
                <div className="grid gap-20 lg:grid-cols-[1fr_0.95fr]">
                    <section>
                        <h1 className="mb-8 text-3xl font-extrabold uppercase">Billing Details</h1>

                        <form className="space-y-7">
                            <div className="grid gap-7 md:grid-cols-2">
                                <label className="block text-lg">
                                    First Name <span className="text-red-500">*</span>
                                    <input
                                        name="billingFirstName"
                                        value={checkoutForm.billingFirstName}
                                        onChange={handleFieldChange}
                                        className={getFieldClassName("billingFirstName", "mt-3 h-[52px] w-full px-4")}
                                    />
                                    {renderError("billingFirstName")}
                                </label>
                                <label className="block text-lg">
                                    Last Name <span className="text-red-500">*</span>
                                    <input
                                        name="billingLastName"
                                        value={checkoutForm.billingLastName}
                                        onChange={handleFieldChange}
                                        className={getFieldClassName("billingLastName", "mt-3 h-[52px] w-full px-4")}
                                    />
                                    {renderError("billingLastName")}
                                </label>
                            </div>

                            <label className="block text-lg">
                                Country / Region <span className="text-red-500">*</span>
                                <p className="mt-3 font-semibold text-gray-600">Sri Lanka</p>
                            </label>

                            <label className="block text-lg">
                                Street Address <span className="text-red-500">*</span>
                                <input
                                    name="billingStreet"
                                    value={checkoutForm.billingStreet}
                                    onChange={handleFieldChange}
                                    className={getFieldClassName("billingStreet", "mt-3 h-[52px] w-full max-w-[340px] px-4")}
                                    placeholder="House number and street name"
                                />
                                {renderError("billingStreet")}
                            </label>

                            <label className="block text-lg">
                                Town / City <span className="text-red-500">*</span>
                                <select
                                    name="billingCity"
                                    value={checkoutForm.billingCity}
                                    onChange={handleFieldChange}
                                    className={getFieldClassName("billingCity", "mt-3 h-[52px] w-full px-4 text-gray-500")}
                                >
                                    <option value="">Select an option...</option>
                                    {sriLankanCities.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                {renderError("billingCity")}
                            </label>

                            <label className="block text-lg">
                                Phone <span className="text-red-500">*</span>
                                <input
                                    name="billingPhone"
                                    value={checkoutForm.billingPhone}
                                    onChange={handleFieldChange}
                                    className={getFieldClassName("billingPhone", "mt-3 h-[52px] w-full px-4")}
                                />
                                {renderError("billingPhone")}
                            </label>

                            <label className="block text-lg">
                                Secondary Number (optional)
                                <input
                                    name="billingSecondaryPhone"
                                    value={checkoutForm.billingSecondaryPhone}
                                    onChange={handleFieldChange}
                                    className="mt-3 h-[52px] w-full border border-gray-200 px-4 outline-none focus:border-pink-300"
                                />
                            </label>

                            <label className="block text-lg">
                                Email address <span className="text-red-500">*</span>
                                <input
                                    type="email"
                                    name="billingEmail"
                                    value={checkoutForm.billingEmail}
                                    onChange={handleFieldChange}
                                    className={getFieldClassName("billingEmail", "mt-3 h-[52px] w-full px-4")}
                                />
                                {renderError("billingEmail")}
                            </label>

                            <label className="flex items-center gap-3 text-lg font-bold">
                                <input
                                    type="checkbox"
                                    checked={shipDifferent}
                                    onChange={(event) => setShipDifferent(event.target.checked)}
                                    className="h-4 w-4"
                                />
                                Ship to a different address?
                            </label>

                            {shipDifferent && (
                                <div className="space-y-7 pt-2">
                                    <div className="grid gap-7 md:grid-cols-2">
                                        <label className="block text-lg">
                                            First name <span className="text-red-500">*</span>
                                            <input
                                                name="shippingFirstName"
                                                value={checkoutForm.shippingFirstName}
                                                onChange={handleFieldChange}
                                                className={getFieldClassName("shippingFirstName", "mt-3 h-[52px] w-full px-4")}
                                            />
                                            {renderError("shippingFirstName")}
                                        </label>
                                        <label className="block text-lg">
                                            Last name <span className="text-red-500">*</span>
                                            <input
                                                name="shippingLastName"
                                                value={checkoutForm.shippingLastName}
                                                onChange={handleFieldChange}
                                                className={getFieldClassName("shippingLastName", "mt-3 h-[52px] w-full px-4")}
                                            />
                                            {renderError("shippingLastName")}
                                        </label>
                                    </div>

                                    <label className="block text-lg">
                                        Country / Region <span className="text-red-500">*</span>
                                        <p className="mt-3 font-semibold text-gray-600">Sri Lanka</p>
                                    </label>

                                    <label className="block text-lg">
                                        Street address <span className="text-red-500">*</span>
                                        <input
                                            name="shippingStreet"
                                            value={checkoutForm.shippingStreet}
                                            onChange={handleFieldChange}
                                            className={getFieldClassName("shippingStreet", "mt-3 h-[52px] w-full px-4")}
                                            placeholder="House number and street name"
                                        />
                                        {renderError("shippingStreet")}
                                    </label>

                                    <label className="block text-lg">
                                        District (optional)
                                        <select
                                            name="shippingDistrict"
                                            value={checkoutForm.shippingDistrict}
                                            onChange={handleFieldChange}
                                            className="mt-3 h-[52px] w-full border border-gray-200 px-4 text-gray-500 outline-none focus:border-pink-300"
                                        >
                                            <option value="">Select an option...</option>
                                            {districts.map((district) => (
                                                <option key={district} value={district}>{district}</option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="block text-lg">
                                        City <span className="text-red-500">*</span>
                                        <select
                                            name="shippingCity"
                                            value={checkoutForm.shippingCity}
                                            onChange={handleFieldChange}
                                            className={getFieldClassName("shippingCity", "mt-3 h-[52px] w-full bg-gray-100 px-4 text-gray-500")}
                                        >
                                            <option value="">Select an option...</option>
                                            {sriLankanCities.map((city) => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        {renderError("shippingCity")}
                                    </label>

                                    <label className="block text-lg">
                                        Phone <span className="text-red-500">*</span>
                                        <input
                                            name="shippingPhone"
                                            value={checkoutForm.shippingPhone}
                                            onChange={handleFieldChange}
                                            className={getFieldClassName("shippingPhone", "mt-3 h-[52px] w-full px-4")}
                                            placeholder="phone Number"
                                        />
                                        {renderError("shippingPhone")}
                                    </label>
                                </div>
                            )}

                            <label className="block text-lg">
                                Order notes (optional)
                                <textarea
                                    rows="8"
                                    name="orderNotes"
                                    value={checkoutForm.orderNotes}
                                    onChange={handleFieldChange}
                                    className="mt-3 w-full border border-gray-200 px-4 py-4 outline-none focus:border-pink-300"
                                    placeholder="Notes about your order, e.g. special notes for delivery."
                                />
                            </label>
                        </form>
                    </section>

                    <aside className="bg-[#f6f6f6] px-9 pb-10 pt-12">
                        <h2 className="mb-8 text-center text-3xl font-extrabold uppercase">Your Order</h2>

                        <div className="rounded-xl bg-white px-8 py-7 shadow-sm">
                            <div className="grid grid-cols-[1fr_140px] border-b border-gray-200 pb-5 text-xl font-extrabold uppercase">
                                <span>Product</span>
                                <span className="text-right">Subtotal</span>
                            </div>

                            {cartItems.length === 0 ? (
                                <p className="py-8 text-gray-500">Your cart is empty.</p>
                            ) : (
                                cartItems.map((item) => {
                                    const product = getProductData(item);
                                    const qty = getItemQty(item);
                                    const lineTotal = getItemPrice(item) * qty;

                                    return (
                                        <div key={`${product.name}-${qty}`} className="border-b border-gray-200 py-5">
                                            <div className="grid grid-cols-[1fr_140px] gap-4">
                                                <p className="text-lg leading-6 text-gray-600">{product.name}</p>
                                                <p className="text-right text-lg text-gray-600">{formatPrice(lineTotal)}</p>
                                            </div>
                                            <div className="mt-3 inline-flex h-10 items-center border border-gray-200">
                                                <span className="flex h-full w-8 items-center justify-center text-gray-500">-</span>
                                                <span className="flex h-full w-10 items-center justify-center">{qty}</span>
                                                <span className="flex h-full w-8 items-center justify-center text-gray-500">+</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item)}
                                                    className="ml-3 font-bold transition hover:text-red-600"
                                                    aria-label="Remove product"
                                                >
                                                    x
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                            <div className="grid grid-cols-[1fr_140px] border-b border-gray-200 py-5 text-lg">
                                <span className="font-bold">Subtotal</span>
                                <span className="text-right">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="grid grid-cols-[1fr_140px] border-b border-gray-200 py-5 text-lg">
                                <span className="font-bold">Shipping</span>
                                <span className="text-right">Free Shipping</span>
                            </div>
                            <div className="grid grid-cols-[1fr_140px] py-5 text-xl font-bold">
                                <span>Total</span>
                                <span className="text-right">{formatPrice(subtotal)}</span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-5 text-lg">
                            {[
                                ["card", "Pay by Visa, MasterCard, AMEX,Lanka QR"],
                                ["cod", "Cash on delivery"],
                            ].map(([value, label]) => (
                                <label key={value} className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={paymentMethod === value}
                                        onChange={() => setPaymentMethod(value)}
                                    />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-7 border-t border-gray-200 pt-7 text-base leading-7 text-gray-600">
                            Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{" "}
                            <strong className="text-gray-950">privacy policy</strong>.
                        </div>

                        {formError && (
                            <div className="mt-6 border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                                {formError}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handlePlaceOrder}
                            className="mt-7 h-[60px] w-full bg-[#2b2b2b] text-lg font-bold uppercase text-white transition hover:bg-pink-600"
                        >
                            Place Order
                        </button>
                    </aside>
                </div>
            </section>
        </main>
    );
};

export default CheckoutPage;
