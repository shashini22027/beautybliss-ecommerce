import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Package, Plus, Trash2 } from "lucide-react";
import api from "../../services/api";

const getTextValue = (value, fallback = "") => {
  if (!value) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  return value.name || value.title || value._id || fallback;
};

const ProductListScreen = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const totalValue = products.reduce(
      (sum, product) =>
        sum + Number(product.price || 0) * Number(product.countInStock || 0),
      0
    );

    return {
      total: products.length,
      lowStock,
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

  return (
    <main className="min-h-screen bg-[#fff7f8] px-4 py-10 text-gray-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <Link
          to="/admin-dashboard"
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-pink-200 bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 shadow-sm transition hover:border-pink-300 hover:text-gray-950"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-pink-600">
            <ArrowLeft size={12} strokeWidth={3} />
          </span>
          Back to Dashboard
        </Link>

        <div className="mb-8 rounded-2xl border border-pink-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-pink-500">
                Admin Catalog
              </p>
              <h1 className="flex items-center gap-3 font-serif text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                <Package size={34} className="text-pink-500" />
                Products
              </h1>
              <p className="mt-3 text-sm font-medium leading-6 text-gray-500">
                Manage BeautyBliss inventory, pricing, stock levels, and product details.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-[#fff0f4] px-5 py-4">
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Items
                  </p>
                </div>
                <div className="rounded-xl bg-[#fff0f4] px-5 py-4">
                  <p className="text-2xl font-bold">{stats.lowStock}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Low
                  </p>
                </div>
                <div className="rounded-xl bg-[#fff0f4] px-5 py-4">
                  <p className="text-2xl font-bold">${stats.totalValue.toFixed(0)}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Value
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/product/create")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-pink-500 px-6 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-pink-500/20 transition hover:bg-pink-600 active:scale-95"
              >
                <Plus size={16} />
                New Product
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-pink-200 bg-white py-20 text-center text-sm font-bold uppercase tracking-widest text-gray-400 shadow-sm">
            Loading products...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-pink-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-pink-100 bg-[#fff0f4]">
                    {["Product", "Price", "Stock", "Category", "Brand", "Actions"].map(
                      (head) => (
                        <th
                          key={head}
                          className={`px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ${
                            head === "Actions" ? "text-right" : ""
                          }`}
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {products.map((product) => {
                    const stock = Number(product.countInStock || 0);

                    return (
                      <tr key={product._id} className="transition hover:bg-[#fff7f8]">
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-gray-800">{product.name}</p>
                          <p className="mt-1 font-mono text-[10px] text-gray-400">
                            {product._id?.substring(0, 10)}...
                          </p>
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-gray-950">
                          ${Number(product.price || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-5 text-sm font-bold">
                          <span
                            className={`rounded-lg px-3 py-2 ${
                              stock <= 5
                                ? "bg-rose-50 text-rose-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {stock}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-500">
                          {getTextValue(product.category, "Uncategorized")}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-500">
                          {getTextValue(product.brand, "BeautyBliss")}
                        </td>
                        <td className="space-x-3 px-6 py-5 text-right">
                          <Link
                            to={`/admin/product/${product._id}/edit`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition hover:bg-pink-100 hover:text-pink-700"
                            aria-label="Edit product"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteHandler(product._id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-800"
                            aria-label="Delete product"
                          >
                            <Trash2 size={16} />
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
      </section>
    </main>
  );
};

export default ProductListScreen;
