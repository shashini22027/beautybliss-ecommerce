import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Edit,
  Image,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  User,
  Users,
} from "lucide-react";
import api from "../../services/api";
import { formatPrice } from "../../utils/currency";

const getTextValue = (value, fallback = "") => {
  if (!value) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  return value.name || value.title || value._id || fallback;
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  } catch {
    return null;
  }
};

const getProductImage = (product) =>
  product.image || product.images?.[0] || product.thumbnail || "";

const ProductListScreen = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(getStoredUser);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, link: "/admin-dashboard" },
    { name: "Customers", icon: Users, link: "/admin/userlist" },
    { name: "Products", icon: Package, link: "/admin/productlist", active: true },
    { name: "Orders", icon: ShoppingBag, link: "/admin/orderlist" },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/products");
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const stats = useMemo(() => {
    const lowStock = products.filter((product) => Number(product.countInStock || 0) <= 5)
      .length;
    const outOfStock = products.filter((product) => Number(product.countInStock || 0) === 0)
      .length;
    const totalValue = products.reduce(
      (sum, product) =>
        sum + Number(product.price || 0) * Number(product.countInStock || 0),
      0
    );

    return {
      total: products.length,
      lowStock,
      outOfStock,
      totalValue,
    };
  }, [products]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error(err?.response?.data?.message || err.message);
      }
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
        <img
          src="/images/banner.jpg"
          alt="Beauty products arranged for product management"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1460px] flex-col items-center justify-center px-6 text-center text-white sm:min-h-[320px]">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Products
          </h1>
          <div className="mt-6 flex items-center gap-3 text-lg font-medium">
            <Link to="/" className="text-white/85 transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/admin-dashboard"
              className="text-white/85 transition hover:text-white"
            >
              Admin dashboard
            </Link>
            <span>/</span>
            <span className="font-bold">Products</span>
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
                      item.active ? "bg-[#f2f2f2]" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              <Link
                to="/profile"
                className="flex items-center gap-3 px-5 py-3 transition hover:bg-[#f2f2f2] hover:text-pink-600"
              >
                <User className="h-5 w-5" />
                Profile
              </Link>
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
                Manage BeautyBliss inventory, pricing, stock levels, and product
                details from the product catalog.
              </p>

              <button
                type="button"
                onClick={() => navigate("/admin/product/create")}
                className="inline-flex h-12 items-center justify-center gap-3 bg-[#2b2b2b] px-6 text-sm font-bold uppercase text-white transition hover:bg-pink-600"
              >
                <Plus size={18} />
                New Product
              </button>
            </div>

            <div className="mt-10 grid min-w-0 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Items", stats.total],
                ["Low Stock", stats.lowStock],
                ["Out of Stock", stats.outOfStock],
                ["Stock Value", formatPrice(stats.totalValue)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="min-w-0 border border-gray-200 bg-white px-6 py-7 shadow-[0_1px_10px_rgba(0,0,0,0.08)]"
                >
                  <p className="break-words text-2xl font-extrabold leading-tight text-gray-950 sm:text-3xl">
                    {value}
                  </p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-widest text-gray-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-extrabold uppercase">
                Product Records
              </h2>

              {loading ? (
                <div className="mt-7 border border-gray-200 bg-white py-20 text-center text-sm font-bold uppercase tracking-widest text-gray-400 shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                  Loading products...
                </div>
              ) : error ? (
                <div className="mt-7 border border-red-100 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
                  {error}
                </div>
              ) : products.length === 0 ? (
                <div className="mt-7 bg-[#f6f6f6] px-6 py-16 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-white text-pink-600 shadow-sm">
                    <Package className="h-7 w-7" />
                  </div>
                  <h3 className="text-3xl font-extrabold uppercase text-gray-950">
                    No products yet
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-lg leading-7 text-gray-600">
                    Add your first BeautyBliss product to start building the catalog.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/product/create")}
                    className="mt-7 inline-flex h-12 items-center justify-center gap-3 bg-[#2b2b2b] px-6 text-sm font-bold uppercase text-white transition hover:bg-pink-600"
                  >
                    <Plus size={18} />
                    New Product
                  </button>
                </div>
              ) : (
                <div className="mt-7 max-w-full overflow-hidden border border-gray-200 bg-white shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                  <div className="max-w-full overflow-x-auto">
                    <table className="w-full min-w-[760px] table-fixed text-left">
                      <thead>
                        <tr className="border-b border-gray-200 bg-[#f2f2f2]">
                          <th className="w-[86px] px-4 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                            Product ID
                          </th>
                          <th className="w-[260px] px-4 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                            Product
                          </th>
                          <th className="w-[104px] px-4 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                            Price
                          </th>
                          <th className="w-[110px] px-4 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                            Stock
                          </th>
                          <th className="w-[120px] px-4 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                            Category
                          </th>
                          <th className="w-[110px] px-4 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                            Brand
                          </th>
                          <th className="w-[92px] px-4 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {products.map((product, index) => {
                          const stock = Number(product.countInStock || 0);
                          const image = getProductImage(product);
                          const productId = product._id || product.id;

                          return (
                            <tr key={product._id} className="transition hover:bg-[#f8f8f8]">
                              <td className="whitespace-nowrap px-4 py-4 font-mono text-[10px] text-gray-400">
                                {`P${String(index + 1).padStart(4, "0")}`}
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex min-w-0 items-center gap-4">
                                  <Link
                                    to={productId ? `/product/${productId}` : "#"}
                                    state={{ product }}
                                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-[#f6f6f6]"
                                  >
                                    {image ? (
                                      <img
                                        src={image}
                                        alt={product.name || "Product"}
                                        className="h-full w-full object-contain"
                                      />
                                    ) : (
                                      <Image className="h-6 w-6 text-gray-400" />
                                    )}
                                  </Link>
                                  <div className="min-w-0">
                                    <Link
                                      to={productId ? `/product/${productId}` : "#"}
                                      state={{ product }}
                                      className="block truncate text-sm font-bold leading-6 text-gray-800 transition hover:text-pink-600"
                                    >
                                      {product.name}
                                    </Link>
                                    <p className="mt-1 truncate text-xs font-medium text-gray-400">
                                      {getTextValue(product.subcategory, "BeautyBliss catalog item")}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-gray-950">
                                {formatPrice(product.price)}
                              </td>
                              <td className="whitespace-nowrap px-4 py-4 text-sm font-bold">
                                <span
                                  className={`inline-flex border px-3 py-2 text-[10px] font-bold uppercase tracking-wide ${
                                    stock === 0
                                      ? "border-red-100 bg-red-50 text-red-700"
                                      : stock <= 5
                                        ? "border-rose-100 bg-rose-50 text-rose-700"
                                        : "border-emerald-100 bg-emerald-50 text-emerald-700"
                                  }`}
                                >
                                  {stock === 0 ? "Out" : `${stock} Stock`}
                                </span>
                              </td>
                              <td className="truncate px-4 py-4 text-sm text-gray-500">
                                {getTextValue(product.category, "Uncategorized")}
                              </td>
                              <td className="truncate px-4 py-4 text-sm text-gray-500">
                                {getTextValue(product.brand, "BeautyBliss")}
                              </td>
                              <td className="whitespace-nowrap px-4 py-4 text-right">
                                <Link
                                  to={`/admin/product/${product._id}/edit`}
                                  className="mr-2 inline-flex h-8 w-8 items-center justify-center bg-gray-100 text-gray-600 transition hover:bg-pink-100 hover:text-pink-700"
                                  aria-label="Edit product"
                                >
                                  <Edit size={15} />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => deleteHandler(product._id)}
                                  className="inline-flex h-8 w-8 items-center justify-center bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-800"
                                  aria-label="Delete product"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default ProductListScreen;
