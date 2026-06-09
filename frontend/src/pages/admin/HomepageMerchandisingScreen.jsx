import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LayoutDashboard,
  LogOut,
  Package,
  Sparkles,
  Tag,
  Truck,
  Users,
  ShoppingBag,
} from "lucide-react";
import api from "../../services/api";
import { formatPrice } from "../../utils/currency";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  } catch {
    return null;
  }
};

const getProductImage = (product) =>
  product.image || product.images?.[0] || "/images/banner.jpg";

const getSectionLabel = (product, section) => {
  if (section === "newArrival") return "New";
  if (section === "hotDeal") return product.discountLabel || "Hot Deal";
  if (product.discountLabel) return product.discountLabel;
  return "Featured";
};

const sectionConfig = [
  {
    key: "bestSeller",
    title: "Best Selling Products",
    description: "Products promoted here are shown in the best selling section on the home page.",
    query: "section=bestSeller&limit=8",
    tone: "amber",
  },
  {
    key: "newArrival",
    title: "New Arrival",
    description: "Products tagged as new will appear in the New Arrival carousel.",
    query: "section=newArrival&limit=8",
    tone: "sky",
  },
  {
    key: "hotDeal",
    title: "Hot Deals",
    description: "Products with compare-at pricing or hot deal flags appear here.",
    query: "section=hotDeal&limit=8",
    tone: "rose",
  },
];

const HomepageMerchandisingScreen = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionProducts, setSectionProducts] = useState({
    bestSeller: [],
    newArrival: [],
    hotDeal: [],
  });

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        setError(null);

        const responses = await Promise.all(
          sectionConfig.map((section) => api.get(`/products?${section.query}`))
        );

        const nextSections = {};
        responses.forEach((response, index) => {
          const key = sectionConfig[index].key;
          nextSections[key] = Array.isArray(response.data) ? response.data : [];
        });

        setSectionProducts(nextSections);
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  const stats = useMemo(() => {
    const bestSeller = sectionProducts.bestSeller.length;
    const newArrival = sectionProducts.newArrival.length;
    const hotDeal = sectionProducts.hotDeal.length;
    const total = new Set(
      [...sectionProducts.bestSeller, ...sectionProducts.newArrival, ...sectionProducts.hotDeal].map(
        (product) => product._id || product.id || product.name
      )
    ).size;

    return { bestSeller, newArrival, hotDeal, total };
  }, [sectionProducts]);

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, link: "/admin-dashboard" },
    { name: "Customers", icon: Users, link: "/admin/userlist" },
    { name: "Products", icon: Package, link: "/admin/productlist" },
    { name: "Orders", icon: ShoppingBag, link: "/admin/orderlist" },
    { name: "Sales", icon: Truck, link: "/admin/sales" },
  ];

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
        <img
          src="/images/banner.jpg"
          alt="Beauty products arranged for homepage merchandising"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1460px] flex-col items-center justify-center px-6 text-center text-white sm:min-h-[320px]">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Homepage Merchandising
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
            <span className="font-bold">Merchandising</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1460px] px-6 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[315px_1fr]">
          <aside className="border-gray-200 lg:border-r lg:pr-9">
            <h2 className="border-b border-gray-200 pb-5 text-2xl font-extrabold uppercase">
              Admin Panel
            </h2>

            <nav className="mt-5 space-y-1 text-lg font-bold">
              {sidebarItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    to={item.link}
                    className={`flex items-center gap-3 px-5 py-3 transition hover:bg-[#f2f2f2] hover:text-pink-600 ${
                      item.link === "/admin-dashboard" ? "bg-[#f2f2f2]" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={logoutHandler}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-[#f2f2f2] hover:text-pink-600"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </nav>

            <div className="mt-8 border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-[#2b2b2b] text-lg font-extrabold text-white">
                  {userInfo?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-extrabold">
                    {userInfo?.name || "Admin"}
                  </p>
                  <p className="mt-1 truncate text-sm text-gray-500">
                    {userInfo?.email || "admin@beautybliss.com"}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="min-w-0 lg:pl-1">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <p className="max-w-3xl text-lg leading-8 text-gray-600">
                Control which products appear in Best Selling, New Arrival, and Hot Deals on the home page.
                Use the product editor to toggle the homepage flags and compare-at pricing.
              </p>

              <Link
                to="/admin/product/create"
                className="inline-flex h-12 items-center justify-center gap-3 bg-[#2b2b2b] px-6 text-sm font-bold uppercase text-white transition hover:bg-pink-600"
              >
                <Tag size={18} />
                Add Product
              </Link>
            </div>

            {error && (
              <div className="mt-7 border border-red-100 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Best Sellers" value={stats.bestSeller} tone="amber" icon={Sparkles} />
              <StatCard label="New Arrivals" value={stats.newArrival} tone="sky" icon={Tag} />
              <StatCard label="Hot Deals" value={stats.hotDeal} tone="rose" icon={Truck} />
              <StatCard label="Total Featured" value={stats.total} tone="gray" icon={Package} />
            </div>

            {loading ? (
              <div className="mt-10 border border-gray-200 bg-white py-20 text-center text-sm font-bold uppercase tracking-widest text-gray-400 shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                Loading homepage sections...
              </div>
            ) : (
              <div className="mt-12 space-y-12">
                {sectionConfig.map((section) => {
                  const products = sectionProducts[section.key] || [];

                  return (
                    <section key={section.key} className="border border-gray-200 bg-white p-6 shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <h2 className="text-2xl font-extrabold uppercase">{section.title}</h2>
                          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                            {section.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Link
                            to="/admin/productlist"
                            className="inline-flex h-11 items-center justify-center gap-2 border border-gray-200 bg-white px-5 text-xs font-bold uppercase tracking-widest text-gray-700 transition hover:border-gray-950 hover:text-gray-950"
                          >
                            Manage Products
                            <ArrowRight size={16} />
                          </Link>
                          <Link
                            to="/admin/product/create"
                            className="inline-flex h-11 items-center justify-center gap-2 bg-[#2b2b2b] px-5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-pink-600"
                          >
                            Create Product
                          </Link>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {products.length > 0 ? (
                          products.map((product) => (
                            <article
                              key={product._id || product.id || product.name}
                              className="group overflow-hidden border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
                            >
                              <div className="relative aspect-square overflow-hidden bg-[#f6f6f6]">
                                <img
                                  src={getProductImage(product)}
                                  alt={product.name}
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                                <span className={`absolute left-3 top-3 inline-flex border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                  section.tone === "amber"
                                    ? "border-amber-100 bg-amber-50 text-amber-700"
                                    : section.tone === "sky"
                                      ? "border-sky-100 bg-sky-50 text-sky-700"
                                      : "border-rose-100 bg-rose-50 text-rose-700"
                                }`}>
                                  {getSectionLabel(product, section.key)}
                                </span>
                              </div>

                              <div className="space-y-3 p-4">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                                  {product.brand || "BeautyBliss"}
                                </p>
                                <h3 className="min-h-[48px] text-sm font-bold leading-6 text-gray-950">
                                  {product.name}
                                </h3>
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-extrabold text-gray-950">
                                      {typeof product.price === "number" ? formatPrice(product.price) : product.price}
                                    </p>
                                    {product.compareAtPrice && (
                                      <p className="text-xs text-gray-400 line-through">
                                        {formatPrice(product.compareAtPrice)}
                                      </p>
                                    )}
                                  </div>
                                  <Link
                                    to={`/admin/product/${product._id}/edit`}
                                    className="inline-flex h-9 items-center justify-center bg-gray-950 px-3 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-pink-600"
                                  >
                                    Edit
                                  </Link>
                                </div>
                              </div>
                            </article>
                          ))
                        ) : (
                          <div className="col-span-full border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
                            <p className="text-lg font-bold text-gray-950">No products assigned yet</p>
                            <p className="mt-2 text-sm text-gray-500">
                              Open the product editor and mark items for this homepage section.
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

const StatCard = ({ label, value, tone, icon: Icon }) => {
  const toneClasses = {
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    sky: "bg-sky-50 text-sky-700 border-sky-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    gray: "bg-gray-50 text-gray-700 border-gray-100",
  };

  return (
    <div className={`border px-6 py-7 shadow-[0_1px_10px_rgba(0,0,0,0.08)] ${toneClasses[tone]}`}>
      <Icon className="mb-5 h-11 w-11 text-gray-300" />
      <p className="text-3xl font-extrabold text-gray-950">{value}</p>
      <p className="mt-2 text-sm font-bold uppercase tracking-widest text-gray-500">{label}</p>
    </div>
  );
};

export default HomepageMerchandisingScreen;
