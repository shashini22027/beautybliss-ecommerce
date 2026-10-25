import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import api from "../services/api";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const address = "123 Beauty Lane, Colombo 03, Sri Lanka";
    const phone = "+94 70 198 4663";
    const contactEmail = "hello@beautybliss.com";
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    useEffect(() => {
        if (status !== "success") return;

        const timer = setTimeout(() => {
            setStatus("idle");
            setMessage("");
        }, 4000);

        return () => clearTimeout(timer);
    }, [status]);

    const subscribeHandler = async (e) => {
        e.preventDefault();
        setStatus("sending");
        setMessage("");

        try {
            try {
                await api.post("/newsletter/subscribe", { email });
            } catch (err) {
                if (err?.response?.status !== 404) {
                    throw err;
                }

                await api.post("/messages", {
                    name: "Newsletter Subscriber",
                    email,
                    company: "Newsletter subscription",
                    message: `A customer subscribed to the newsletter with this email: ${email}`,
                });
            }

            setEmail("");
            setStatus("success");
            setMessage("Thank you for subscribing!");
        } catch (err) {
            setStatus("error");
            setMessage(err?.response?.data?.message || "Subscription failed. Please try again.");
        }
    };

    return (
        <footer
            className="border-t border-gray-200 bg-[#f6f6f6] pb-8 pt-16 text-gray-600"
        >
            <div className="mx-auto grid max-w-[1540px] grid-cols-1 gap-12 px-6 md:grid-cols-4">
                {/* Brand & About */}
                <div className="space-y-6">
                    <h3 className="text-3xl font-extrabold tracking-[0.12em] text-gray-950">
                        BEAUTYBLISS <span className="text-pink-600">COSMETICS</span>
                    </h3>
                    <p className="max-w-sm text-sm leading-relaxed text-gray-600">
                        Elevate your beauty with our curated collection of premium cosmetics and skincare. Experience the perfect blend of luxury and elegance.
                    </p>
                    <div className="flex space-x-4">
                        <a href="https://www.facebook.com/" className="flex h-10 w-10 items-center justify-center border border-gray-200 bg-white text-gray-700 transition hover:border-gray-950 hover:text-pink-600"><FaFacebook size={18} /></a>
                        <a href="https://www.instagram.com/" className="flex h-10 w-10 items-center justify-center border border-gray-200 bg-white text-gray-700 transition hover:border-gray-950 hover:text-pink-600"><FaInstagram size={18} /></a>
                        <a href="https://www.twitter.com/" className="flex h-10 w-10 items-center justify-center border border-gray-200 bg-white text-gray-700 transition hover:border-gray-950 hover:text-pink-600"><FaTwitter size={18} /></a>
                        <a href="https://www.youtube.com/" className="flex h-10 w-10 items-center justify-center border border-gray-200 bg-white text-gray-700 transition hover:border-gray-950 hover:text-pink-600"><FaYoutube size={18} /></a>
                    </div>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="mb-6 text-[11px] font-extrabold uppercase tracking-[0.3em] text-gray-950">Contact Us</h4>
                    <ul className="space-y-5 text-sm text-gray-600">
                        <li>
                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-start gap-3 transition-colors hover:text-pink-600"
                            >
                                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-950 transition-colors group-hover:text-pink-600" />
                                <span>{address}</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href={`tel:${phone.replace(/\s+/g, "")}`}
                                className="group flex items-center gap-3 transition-colors hover:text-pink-600"
                            >
                                <Phone className="h-5 w-5 shrink-0 text-gray-950 transition-colors group-hover:text-pink-600" />
                                <span>{phone}</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href={`mailto:${contactEmail}`}
                                className="group flex items-center gap-3 transition-colors hover:text-pink-600"
                            >
                                <Mail className="h-5 w-5 shrink-0 text-gray-950 transition-colors group-hover:text-pink-600" />
                                <span>{contactEmail}</span>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Customer Care */}
                <div>
                    <h4 className="mb-6 text-[11px] font-extrabold uppercase tracking-[0.3em] text-gray-950">Customer Care</h4>
                    <ul className="space-y-4 text-sm text-gray-600">
                        <li><Link to="/track-order" className="transition-colors hover:text-pink-600">Track Order</Link></li>
                        <li><Link to="/privacy-policy" className="transition-colors hover:text-pink-600">Privacy Policy</Link></li>
                        <li><Link to="/shipping-delivery" className="transition-colors hover:text-pink-600">Shipping and Delivery</Link></li>
                        <li><Link to="/return-refund-policy" className="transition-colors hover:text-pink-600">Return & Refund Policy</Link></li>
                        <li><Link to="/terms-conditions" className="transition-colors hover:text-pink-600">Terms and Conditions</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="mb-6 text-[11px] font-extrabold uppercase tracking-[0.3em] text-gray-950">Beauty Insider</h4>
                    <p className="mb-4 text-sm leading-relaxed text-gray-600">Subscribe to get exclusive beauty tips and first access to new collections.</p>
                    <form onSubmit={subscribeHandler} className="flex flex-col space-y-2">
                        <input
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border border-gray-200 bg-white px-4 py-3 text-sm text-gray-950 transition placeholder:text-gray-400 focus:border-gray-950 focus:outline-none focus:ring-2 focus:ring-pink-100"
                        />
                        <button
                            type="submit"
                            disabled={status === "sending"}
                            className="bb-storefront-button w-full"
                        >
                            {status === "sending" ? "Sending..." : "Subscribe"}
                        </button>
                        {message && (
                            <p className={`text-xs ${status === "success" ? "text-pink-600" : "text-red-500"}`}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
