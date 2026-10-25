import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/authSlice";
import { apiFetch } from "../utils/api";

const getCheckoutOrders = () => {
  try {
    const checkoutOrders = JSON.parse(localStorage.getItem("checkoutOrders") || "[]");
    return Array.isArray(checkoutOrders) ? checkoutOrders : [];
  } catch {
    return [];
  }
};

const getOrderKey = (order) => {
  const value = order?.orderNo || order?.orderNumber || order?._id || order?.id || "";
  return String(value).trim().toUpperCase();
};

const TrackOrderPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const orderInputRef = useRef(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderEmail, setOrderEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        let loadedOrders = getCheckoutOrders();

        if (user) {
          const response = await apiFetch("/api/orders/myorders", { method: "GET" });
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data?.message || "Unable to load your orders");
          }

          const myOrders = Array.isArray(data) ? data : data.orders || [];
          loadedOrders = [...myOrders, ...loadedOrders];
        }

        const uniqueOrders = loadedOrders.reduce((result, order) => {
          const key = getOrderKey(order);
          if (!key) return result;
          if (!result.some((current) => getOrderKey(current) === key)) {
            result.push(order);
          }
          return result;
        }, []);

        setOrders(uniqueOrders);
      } catch (loadError) {
        setError(loadError.message || "Unable to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.email]);

  const handleTryAgain = () => {
    setError("");
    setOrderNumber("");
    setOrderEmail("");
    orderInputRef.current?.focus();
  };

  const handleTrackOrder = async (event) => {
    event.preventDefault();

    const normalizedOrderNumber = orderNumber.trim().toUpperCase();
    const normalizedEmail = (orderEmail || user?.email || "").trim().toLowerCase();

    if (!normalizedOrderNumber) {
      setError("Please enter your order number.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter the email address used at checkout to verify your order.");
      return;
    }

    let matchedOrder = orders.find((order) => {
      const key = getOrderKey(order);
      const orderId = String(order?._id || order?.id || "").toUpperCase();
      return key === normalizedOrderNumber || orderId === normalizedOrderNumber;
    });

    if (matchedOrder) {
      const orderEmails = [matchedOrder.customer?.email, matchedOrder.shippingAddress?.email]
        .map((email) => String(email || "").trim().toLowerCase());
      if (!orderEmails.includes(normalizedEmail)) matchedOrder = null;
    }

    if (!matchedOrder) {
      try {
        setLoading(true);
        const response = await apiFetch(`/api/orders/track/${encodeURIComponent(normalizedOrderNumber)}?email=${encodeURIComponent(normalizedEmail)}`, {
          method: "GET",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Unable to find order");
        }

        matchedOrder = data;
      } catch (lookupError) {
        setLoading(false);
        setError("We couldn’t find an order with that number. Please check the order ID on your receipt or confirmation email.");
        return;
      }
    }

    setLoading(false);

    const orderId = matchedOrder._id || matchedOrder.id;
    const trackedOrderNumber = matchedOrder.orderNo || matchedOrder.orderNumber || normalizedOrderNumber;

    navigate(`/order/${orderId}`, {
      state: {
        orderNo: trackedOrderNumber,
        orderEmail: matchedOrder.shippingAddress?.email || matchedOrder.customer?.email || "",
      },
    });
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="bb-page-title-banner flex items-center justify-center">
        <div className="relative z-10 flex w-full flex-col items-center justify-center">
          <h1>
            Track Your Order
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1460px] px-6 py-12 lg:py-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-xl font-medium uppercase leading-9 text-gray-700 sm:text-2xl">
            Enter the order number and the email address used at checkout. We use both details to protect your order information.
          </p>

          <div className="mt-8 space-y-4 text-base uppercase leading-7 text-gray-600">
            <p>Please note all prepaid orders are delivered within 2-5 working days.</p>
            <p>
              Sundays and Public holidays such as Sinhala – Tamil New Year and Christmas are not counted as working days.
            </p>
          </div>

          <form onSubmit={handleTrackOrder} className="mt-8 max-w-[760px]">
            <label htmlFor="tracking-order-number" className="block text-lg font-semibold uppercase tracking-[0.08em] text-gray-800">
              Your Order No <span className="text-red-500">(required)</span>
            </label>

            <input
              ref={orderInputRef}
              id="tracking-order-number"
              type="text"
              value={orderNumber}
              onChange={(event) => {
                setOrderNumber(event.target.value);
                if (error) setError("");
              }}
              placeholder="Enter your order number"
              className="mt-4 h-14 w-full border border-gray-300 bg-[#f8f8f8] px-4 text-base uppercase text-gray-900 shadow-sm outline-none transition placeholder:normal-case focus:border-[#2b2b2b] focus:ring-2 focus:ring-pink-100"
            />

            <label htmlFor="tracking-email" className="mt-6 block text-lg font-semibold uppercase tracking-[0.08em] text-gray-800">
              Checkout Email <span className="text-red-500">(required)</span>
            </label>
            <input
              id="tracking-email"
              type="email"
              autoComplete="email"
              value={orderEmail || user?.email || ""}
              onChange={(event) => {
                setOrderEmail(event.target.value);
                if (error) setError("");
              }}
              placeholder="Email used at checkout"
              className="mt-4 h-14 w-full border border-gray-300 bg-[#f8f8f8] px-4 text-base text-gray-900 shadow-sm outline-none transition placeholder:normal-case focus:border-[#2b2b2b] focus:ring-2 focus:ring-pink-100"
            />

            <button
              type="submit"
              className="mt-6 flex h-14 w-full items-center justify-center border border-gray-300 bg-[#f4f4f4] text-base font-bold uppercase tracking-[0.18em] text-gray-900 transition hover:bg-[#2b2b2b] hover:text-white"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>

            {error && (
              <div className="mt-5 border border-red-200 bg-red-50 px-5 py-4 text-left">
                <p className="text-base font-medium leading-7 text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={handleTryAgain}
                  className="mt-4 inline-flex h-11 items-center justify-center border border-red-200 bg-white px-5 text-sm font-bold uppercase tracking-[0.14em] text-red-700 transition hover:bg-red-100"
                >
                  Try Again
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
};

export default TrackOrderPage;
