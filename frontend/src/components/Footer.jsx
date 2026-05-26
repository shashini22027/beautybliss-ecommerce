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
        <footer className="bg-stone-950 text-stone-300 pt-16 pb-8">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand & About */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-serif font-bold tracking-tighter">
                        BEAUTYBLISS <span className="text-pink-500">COSMETICS</span>
                    </h3>
                    <p className="text-stone-400 text-sm leading-relaxed">
                        Elevate your beauty with our curated collection of premium cosmetics and skincare. Experience the perfect blend of luxury and elegance.
                    </p>
                    <div className="flex space-x-4">
                        <a href="https://www.facebook.com/" className="text-stone-400 hover:text-pink-500 transition-colors"><FaFacebook size={20} /></a>
                        <a href="https://www.instagram.com/" className="text-stone-400 hover:text-pink-500 transition-colors"><FaInstagram size={20} /></a>
                        <a href="https://www.twitter.com/" className="text-stone-400 hover:text-pink-500 transition-colors"><FaTwitter size={20} /></a>
                        <a href="https://www.youtube.com/" className="text-stone-400 hover:text-pink-500 transition-colors"><FaYoutube size={20} /></a>
                    </div>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-sm uppercase tracking-widest font-bold mb-6 text-pink-500">Contact Us</h4>
                    <ul className="space-y-4 text-sm text-stone-300">
                        <li className="flex items-start gap-3">
                            <span className="text-pink-500 mt-1">📍</span>
                            <span>123 Beauty Lane,<br />Colombo 03, Sri Lanka</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-pink-500">📞</span>
                            <span>+94 70 198 4663</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-pink-500">✉️</span>
                            <span>hello@beautybliss.com</span>
                        </li>
                    </ul>
                </div>

                {/* Customer Care */}
                <div>
                    <h4 className="text-sm uppercase tracking-widest font-bold mb-6 text-pink-500">Customer Care</h4>
                    <ul className="space-y-4 text-sm text-stone-300">
                        <li><Link to="/privacy-policy" className="hover:text-pink-500 transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms-conditions" className="hover:text-pink-500 transition-colors">Terms & Conditions</Link></li>
                        <li><Link to="/about" className="hover:text-pink-500 transition-colors">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-pink-500 transition-colors">Contact Support</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-sm uppercase tracking-widest font-bold mb-6">Beauty Insider</h4>
                    <p className="text-sm text-stone-400 mb-4">Subscribe to get exclusive beauty tips and first access to new collections.</p>
                    <form onSubmit={subscribeHandler} className="flex flex-col space-y-2">
                        <input
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-stone-900 border border-stone-800 px-4 py-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition"
                        />
                        <button
                            type="submit"
                            disabled={status === "sending"}
                            className="bg-pink-500 hover:bg-pink-600 text-white py-2 text-xs font-semibold uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                            {status === "sending" ? "Sending..." : "Subscribe"}
                        </button>
                        {message && (
                            <p className={`text-xs ${status === "success" ? "text-pink-400" : "text-red-400"}`}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 uppercase tracking-widest gap-4">
                <p>&copy; {currentYear} BeautyBliss Cosmetics. All rights reserved.</p>
                <div className="flex space-x-6">
                    <Link to="/privacy-policy" className="hover:text-stone-300 transition-colors">Privacy Policy</Link>
                    <Link to="/terms-conditions" className="hover:text-stone-300 transition-colors">Terms & Conditions</Link>
                    <Link to="/about" className="hover:text-stone-300 transition-colors">About Us</Link>
                    <Link to="/contact" className="hover:text-stone-300 transition-colors">Contact</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
