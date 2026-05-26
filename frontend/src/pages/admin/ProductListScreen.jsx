import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Edit, Trash2, Plus, ArrowLeft } from "lucide-react";
import api from "../../services/api";

const ProductListScreen = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
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

    const createProductHandler = async () => {
        if (window.confirm("Create a new product?")) {
            navigate(`/admin/product/create`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-stone-200 rounded-full text-[10px] uppercase tracking-[0.2em] font-black text-stone-500 hover:text-stone-900 hover:bg-stone-50 hover:shadow-lg hover:shadow-stone-200/50 transition-all mb-10 group"
            >
                <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                    <ArrowLeft size={12} strokeWidth={3} />
                </div>
                <span>Back to Dashboard</span>
            </Link>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-stone-900 flex items-center gap-3">
                        <Package size={32} className="text-pink-500" />
                        Products
                    </h1>
                    <p className="text-stone-500 uppercase tracking-widest text-[10px] font-bold mt-2">Manage inventory and product catalog</p>
                </div>
                <button
                    onClick={createProductHandler}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-pink-600 transition-all shadow-xl shadow-pink-500/20 active:scale-95"
                >
                    <Plus size={16} />
                    New Product
                </button>
            </div>

            {loading ? (
                <div className="py-20 text-center animate-pulse tracking-widest uppercase text-stone-400">Loading products...</div>
            ) : error ? (
                <div className="py-20 text-center text-red-500 font-medium">{error}</div>
            ) : (
                <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50 border-b border-stone-200">
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Product ID</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Product Name</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Price</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Stock</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Category</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Brand</th>
                                    <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-stone-50/50 transition-colors group">
                                        <td className="px-6 py-5 font-mono text-[10px] text-stone-400">{product._id.substring(0, 10)}...</td>
                                        <td className="px-6 py-5 text-sm font-medium text-stone-700">{product.name}</td>
                                        <td className="px-6 py-5 text-sm font-bold text-stone-900">${product.price}</td>
                                        <td className="px-6 py-5 text-sm font-bold">
                                            {product.countInStock <= 5 ? (
                                                <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded-md">{product.countInStock}</span>
                                            ) : (
                                                <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{product.countInStock}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-stone-500">{typeof product.category === 'object' ? product.category?.name : product.category}</td>
                                        <td className="px-6 py-5 text-sm text-stone-500">{product.brand}</td>
                                        <td className="px-6 py-5 text-right space-x-3">
                                            <Link
                                                to={`/admin/product/${product._id}/edit`}
                                                className="inline-flex items-center justify-center p-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 hover:text-black transition-colors"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => deleteHandler(product._id)}
                                                className="inline-flex items-center justify-center p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:text-red-800 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductListScreen;
