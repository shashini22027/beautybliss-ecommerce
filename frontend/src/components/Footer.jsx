import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import api from "../services/api";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

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
            await api.post("/api/newsletter/subscribe", { email });
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
                    <ul className="space-y-4 text-sm text-gray-600">
                        <li className="flex items-start gap-3">
                            <span className="mt-1 h-2.5 w-2.5 bg-pink-600" />
                            <span>123 Beauty Lane,<br />Colombo 03, Sri Lanka</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 bg-pink-600" />
                            <span>+94 70 198 4663</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 bg-pink-600" />
                            <span>hello@beautybliss.com</span>
                        </li>
                    </ul>
                </div>

                {/* Customer Care */}
                <div>
                    <h4 className="mb-6 text-[11px] font-extrabold uppercase tracking-[0.3em] text-gray-950">Customer Care</h4>
                    <ul className="space-y-4 text-sm text-gray-600">
                        <li><Link to="/privacy-policy" className="transition-colors hover:text-pink-600">Privacy Policy</Link></li>
                        <li><Link to="/terms-conditions" className="transition-colors hover:text-pink-600">Terms & Conditions</Link></li>
                        <li><Link to="/about" className="transition-colors hover:text-pink-600">About Us</Link></li>
                        <li><Link to="/contact" className="transition-colors hover:text-pink-600">Contact Support</Link></li>
                        <li><Link to="/track-your-order" className="transition-colors hover:text-pink-600">Track Your Order</Link></li>
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
                            className="bg-[#2b2b2b] py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
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

            <div className="mx-auto mt-16 flex max-w-[1540px] flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 pt-8 text-xs uppercase tracking-widest text-gray-500 md:flex-row">
                <p>&copy; {currentYear} BeautyBliss Cosmetics. All rights reserved.</p>
                <div className="flex space-x-6">
                    <Link to="/privacy-policy" className="transition-colors hover:text-gray-950">Privacy Policy</Link>
                    <Link to="/terms-conditions" className="transition-colors hover:text-gray-950">Terms & Conditions</Link>
                    <Link to="/about" className="transition-colors hover:text-gray-950">About Us</Link>
                    <Link to="/contact" className="transition-colors hover:text-gray-950">Contact</Link>
                    <Link to="/track-your-order" className="transition-colors hover:text-gray-950">Track Order</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
