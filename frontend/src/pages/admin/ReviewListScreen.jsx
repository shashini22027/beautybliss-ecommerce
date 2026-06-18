import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/image";
import {
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  ShoppingBag,
  Star,
  User,
  Users,
} from "lucide-react";
import api from "../../services/api";
import AdminSidebar from "./components/AdminSidebar";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  } catch {
    return null;
  }
};

const formatDate = (date) => {
  if (!date) return "Pending";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ReviewListScreen = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(getStoredUser);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get("/products");
        const products = Array.isArray(data) ? data : data.products || [];
        const productReviews = products.flatMap((product) =>
          (product.reviews || []).map((review) => ({
            ...review,
            productId: product._id || product.id,
            productName: product.name,
            productImage: getImageUrl(product.image || product.images?.[0] || ""),
          }))
        );

        setReviews(productReviews);
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const stats = useMemo(() => {
    const averageRating = reviews.length
      ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
      : 0;
    const fiveStarReviews = reviews.filter((review) => Number(review.rating || 0) === 5).length;
    const uniqueCustomers = new Set(reviews.map((review) => review.user || review.name).filter(Boolean)).size;

    return {
      total: reviews.length,
      averageRating,
      fiveStarReviews,
      uniqueCustomers,
    };
  }, [reviews]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
        <img
          src="/images/admin_banner.png"
          alt="Beauty products arranged for review management"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1460px] flex-col items-center justify-center px-6 text-center text-white sm:min-h-[320px]">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Reviews
          </h1>
          <div className="mt-6 flex items-center gap-3 text-lg font-medium">
            <Link to="/" className="text-white/85 transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link to="/admin-dashboard" className="text-white/85 transition hover:text-white">
              Admin dashboard
            </Link>
            <span>/</span>
            <span className="font-bold">Reviews</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1460px] px-6 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[315px_1fr]">
          <AdminSidebar />

          <section className="min-w-0 lg:pl-1">
            <p className="text-lg leading-8 text-gray-600">
              Review customer feedback submitted from product pages and monitor product experience quality.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Reviews", stats.total],
                ["Average Rating", stats.averageRating.toFixed(1)],
                ["5 Star Reviews", stats.fiveStarReviews],
                ["Customers", stats.uniqueCustomers],
              ].map(([label, value]) => (
                <div key={label} className="border border-gray-200 bg-white px-6 py-7 shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                  <p className="text-3xl font-extrabold text-gray-950">{value}</p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-widest text-gray-500">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-extrabold uppercase">Customer Reviews</h2>

              {loading ? (
                <div className="mt-7 border border-gray-200 bg-white py-20 text-center text-sm font-bold uppercase tracking-widest text-gray-400 shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                  Loading reviews...
                </div>
              ) : error ? (
                <div className="mt-7 border border-red-100 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
                  {error}
                </div>
              ) : reviews.length === 0 ? (
                <div className="mt-7 bg-[#f6f6f6] px-6 py-16 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-white text-pink-600 shadow-sm">
                    <MessageSquare className="h-7 w-7" />
                  </div>
                  <h3 className="text-3xl font-extrabold uppercase text-gray-950">No reviews yet</h3>
                  <p className="mx-auto mt-3 max-w-md text-lg leading-7 text-gray-600">
                    Customer product reviews will appear here after users submit feedback.
                  </p>
                </div>
              ) : (
                <div className="mt-7 grid gap-5">
                  {reviews.map((review) => (
                    <article key={review._id || `${review.productName}-${review.name}-${review.comment}`} className="border border-gray-200 bg-white p-6 shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                        <Link
                          to={review.productId ? `/product/${review.productId}` : "#"}
                          className="flex h-20 w-20 flex-shrink-0 items-center justify-center bg-[#f6f6f6]"
                        >
                          {review.productImage ? (
                            <img src={review.productImage} alt={review.productName} className="h-full w-full object-contain" />
                          ) : (
                            <Package className="h-7 w-7 text-gray-400" />
                          )}
                        </Link>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <p className="text-lg font-extrabold text-gray-950">{review.name || "Customer"}</p>
                              <p className="mt-1 text-sm font-medium text-gray-500">
                                {review.productName || "BeautyBliss product"} • {formatDate(review.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                  key={index}
                                  className={`h-5 w-5 ${index < Number(review.rating || 0) ? "fill-current" : ""}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-4 text-base leading-7 text-gray-600">{review.comment}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default ReviewListScreen;
