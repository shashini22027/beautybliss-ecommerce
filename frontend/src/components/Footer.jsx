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
            className="border-t border-rose-100 pt-16 pb-8 text-[#785d68]"
            style={{
                background:
                    "linear-gradient(120deg, #fff9f4 0%, #fdecef 56%, #fffafa 100%)",
            }}
        >
            <div className="mx-auto grid max-w-[1540px] grid-cols-1 gap-12 px-6 md:grid-cols-4">
                {/* Brand & About */}
                <div className="space-y-6">
                    <h3 className="font-serif text-3xl font-bold tracking-tight text-[#2f2029]">
                        BEAUTYBLISS <span className="text-[#9d5f72]">COSMETICS</span>
                    </h3>
                    <p className="max-w-sm text-sm leading-relaxed text-[#785d68]">
                        Elevate your beauty with our curated collection of premium cosmetics and skincare. Experience the perfect blend of luxury and elegance.
                    </p>
                    <div className="flex space-x-4">
                        <a href="https://www.facebook.com/" className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white text-[#8b6674] shadow-sm transition hover:border-[#d8a7b1] hover:text-[#8f4d63]"><FaFacebook size={18} /></a>
                        <a href="https://www.instagram.com/" className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white text-[#8b6674] shadow-sm transition hover:border-[#d8a7b1] hover:text-[#8f4d63]"><FaInstagram size={18} /></a>
                        <a href="https://www.twitter.com/" className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white text-[#8b6674] shadow-sm transition hover:border-[#d8a7b1] hover:text-[#8f4d63]"><FaTwitter size={18} /></a>
                        <a href="https://www.youtube.com/" className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white text-[#8b6674] shadow-sm transition hover:border-[#d8a7b1] hover:text-[#8f4d63]"><FaYoutube size={18} /></a>
                    </div>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="mb-6 text-[11px] font-bold uppercase tracking-[0.3em] text-[#9d5f72]">Contact Us</h4>
                    <ul className="space-y-4 text-sm text-[#785d68]">
                        <li className="flex items-start gap-3">
                            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-300" />
                            <span>123 Beauty Lane,<br />Colombo 03, Sri Lanka</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                            <span>+94 70 198 4663</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                            <span>hello@beautybliss.com</span>
                        </li>
                    </ul>
                </div>

                {/* Customer Care */}
                <div>
                    <h4 className="mb-6 text-[11px] font-bold uppercase tracking-[0.3em] text-[#9d5f72]">Customer Care</h4>
                    <ul className="space-y-4 text-sm text-[#785d68]">
                        <li><Link to="/privacy-policy" className="transition-colors hover:text-[#8f4d63]">Privacy Policy</Link></li>
                        <li><Link to="/terms-conditions" className="transition-colors hover:text-[#8f4d63]">Terms & Conditions</Link></li>
                        <li><Link to="/about" className="transition-colors hover:text-[#8f4d63]">About Us</Link></li>
                        <li><Link to="/contact" className="transition-colors hover:text-[#8f4d63]">Contact Support</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="mb-6 text-[11px] font-bold uppercase tracking-[0.3em] text-[#9d5f72]">Beauty Insider</h4>
                    <p className="mb-4 text-sm leading-relaxed text-[#785d68]">Subscribe to get exclusive beauty tips and first access to new collections.</p>
                    <form onSubmit={subscribeHandler} className="flex flex-col space-y-2">
                        <input
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border border-rose-100 bg-white px-4 py-3 text-sm text-[#2f2029] shadow-sm transition placeholder:text-[#b794a1] focus:border-[#d8a7b1] focus:outline-none focus:ring-2 focus:ring-rose-100"
                        />
                        <button
                            type="submit"
                            disabled={status === "sending"}
                            className="bg-[#3a2430] py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5b2c45] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {status === "sending" ? "Sending..." : "Subscribe"}
                        </button>
                        {message && (
                            <p className={`text-xs ${status === "success" ? "text-[#8f4d63]" : "text-red-500"}`}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>

            <div className="mx-auto mt-16 flex max-w-[1540px] flex-col items-center justify-between gap-4 border-t border-rose-200/70 px-6 pt-8 text-xs uppercase tracking-widest text-[#8b6674] md:flex-row">
                <p>&copy; {currentYear} BeautyBliss Cosmetics. All rights reserved.</p>
                <div className="flex space-x-6">
                    <Link to="/privacy-policy" className="transition-colors hover:text-[#2f2029]">Privacy Policy</Link>
                    <Link to="/terms-conditions" className="transition-colors hover:text-[#2f2029]">Terms & Conditions</Link>
                    <Link to="/about" className="transition-colors hover:text-[#2f2029]">About Us</Link>
                    <Link to="/contact" className="transition-colors hover:text-[#2f2029]">Contact</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
