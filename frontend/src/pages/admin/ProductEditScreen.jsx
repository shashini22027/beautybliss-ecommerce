import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Package, DollarSign, Image as ImageIcon, Tag, Hash, AlignLeft, Check, Upload, X } from "lucide-react";
import api from "../../services/api";

const ProductEditScreen = () => {
    const { id: productId } = useParams();
    const isCreate = !productId;
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [imageError, setImageError] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");
    
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setImageError(false);
    }, [image]);

    useEffect(() => {
        if (!productId) {
            setLoading(false);
            return;
        }
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/products/${productId}`);
                setName(data.name);
                setPrice(data.price);
                setImage(data.image);
                setBrand(data.brand);
                // Handle category being either an object (populated) or a string (ID)
                setCategory(typeof data.category === 'object' ? data.category?._id : data.category);
                setCountInStock(data.countInStock);
                setDescription(data.description);
            } catch (err) {
                setError(err?.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            setUploading(true);
            const { data } = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setImage(data.url);
        } catch (err) {
            console.error("Image upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);
            if (isCreate) {
                await api.post('/products', {
                    name,
                    price,
                    image,
                    brand,
                    category,
                    countInStock,
                    description,
                });
            } else {
                await api.put(`/products/${productId}`, {
                    name,
                    price,
                    image,
                    brand,
                    category,
                    countInStock,
                    description,
                });
            }
            navigate('/admin/productlist');
        } catch (err) {
            setError(err?.response?.data?.message || err.message);
        } finally {
            setUpdating(false);
        }
    };

    const hasValidImage = image && image !== "" && image !== "/images/sample.jpg" && !imageError;

    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <Link 
                to="/admin/productlist" 
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-500 hover:text-black transition-colors mb-10"
            >
                <ChevronLeft size={16} />
                Back to Products
            </Link>

            <div className="mb-12 text-center">
                <h1 className="text-4xl font-serif font-bold text-stone-900 tracking-tighter">{isCreate ? 'Create Product' : 'Edit Product'}</h1>
                <p className="text-stone-500 uppercase tracking-[0.2em] text-[10px] font-bold mt-2">Manage product details and inventory</p>
            </div>

            {loading ? (
                <div className="py-20 text-center animate-pulse tracking-widest uppercase text-stone-400">Loading product data...</div>
            ) : error ? (
                <div className="py-20 text-center text-red-500 font-medium">{error}</div>
            ) : (
                <div className="bg-white rounded-[2.5rem] p-10 sm:p-16 shadow-2xl shadow-stone-200/50 border border-stone-200">
                    <form onSubmit={submitHandler} className="space-y-8">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-1">Product Name</label>
                            <div className="relative group">
                                <Package size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-black transition-colors" />
                                <input
                                    type="text"
                                    value={name}
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-black outline-none transition-all font-medium text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {/* Price */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-1">Price ($)</label>
                                <div className="relative group">
                                    <DollarSign size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-black transition-colors" />
                                    <input
                                        type="number"
                                        value={price}
                                        required
                                        step="0.01"
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-black outline-none transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>

                            {/* Count In Stock */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-1">Stock Count</label>
                                <div className="relative group">
                                    <Hash size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-black transition-colors" />
                                    <input
                                        type="number"
                                        value={countInStock}
                                        required
                                        onChange={(e) => setCountInStock(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-black outline-none transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-1">Product Image</label>
                            
                            {/* Preview + Upload Area */}
                            <div className="relative">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={uploadFileHandler}
                                    className="hidden"
                                />

                                {hasValidImage ? (
                                    /* Premium Image Card with Hover-to-Replace & Top-Right Delete */
                                    <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-sm bg-stone-50 h-64 group">
                                        <img 
                                            src={image} 
                                            alt="Product preview" 
                                            onError={() => setImageError(true)}
                                            className="w-full h-full object-contain bg-white transition-transform duration-700 group-hover:scale-102"
                                        />
                                        
                                        {/* Glassmorphic replace overlay on hover */}
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white cursor-pointer backdrop-blur-[2px]"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shadow-lg backdrop-blur-md animate-pulse">
                                                <Upload size={20} className="text-white" />
                                            </div>
                                            <span className="text-[10px] uppercase tracking-widest font-bold">Click to replace photo</span>
                                        </div>

                                        {/* Top-Right Remove Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImage("");
                                            }}
                                            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-600 hover:scale-105 active:scale-95 transition-all z-10 shadow-lg hover:shadow-red-500/20"
                                            title="Remove Image"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    /* Premium dashed Upload Drop Zone */
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative cursor-pointer border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 ${
                                            uploading
                                                ? "border-amber-400 bg-amber-50"
                                                : "border-stone-200 bg-stone-50 hover:border-stone-400 hover:bg-stone-100/70"
                                        }`}
                                    >
                                        {uploading ? (
                                            <div className="flex flex-col items-center gap-4 py-4">
                                                <div className="w-10 h-10 rounded-full border-3 border-amber-400 border-t-transparent animate-spin" />
                                                <p className="text-xs uppercase tracking-widest font-bold text-amber-600 animate-pulse">Uploading image...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shadow-sm text-stone-400 group-hover:text-black transition-colors">
                                                    <Upload size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-stone-700">
                                                        {imageError ? "Image failed to load. Click to upload new image" : "Click to upload from device"}
                                                    </p>
                                                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1.5">
                                                        JPG, PNG or WebP — Max 5MB
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Manual URL input option */}
                                <div className="mt-4">
                                    {!showUrlInput ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowUrlInput(true)}
                                            className="text-[9px] uppercase tracking-widest font-bold text-stone-400 hover:text-black transition-colors ml-1"
                                        >
                                            Or enter image URL manually
                                        </button>
                                    ) : (
                                        <div className="space-y-2 pt-2 bg-stone-50/50 p-4 rounded-2xl border border-stone-200">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[9px] uppercase tracking-widest font-bold text-stone-400">Direct Image URL</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowUrlInput(false)}
                                                    className="text-[9px] uppercase tracking-widest font-bold text-stone-400 hover:text-black transition-colors"
                                                >
                                                    Hide Manual Input
                                                </button>
                                            </div>
                                            <div className="relative group">
                                                <ImageIcon size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-black transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="https://example.com/image.jpg"
                                                    value={image}
                                                    onChange={(e) => setImage(e.target.value)}
                                                    className="w-full pl-14 pr-6 py-3.5 bg-white border border-stone-200/60 rounded-xl focus:border-black outline-none transition-all font-medium text-xs shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {/* Brand */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-1">Brand</label>
                                <div className="relative group">
                                    <Tag size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-black transition-colors" />
                                    <input
                                        type="text"
                                        value={brand}
                                        required
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-black outline-none transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-1">Category</label>
                                <div className="relative group">
                                    <Tag size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-black transition-colors" />
                                    <input
                                        type="text"
                                        value={category}
                                        required
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-black outline-none transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-1">Description</label>
                            <div className="relative group">
                                <AlignLeft size={16} className="absolute left-5 top-6 text-stone-400 group-focus-within:text-black transition-colors" />
                                <textarea
                                    value={description}
                                    required
                                    rows="4"
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-black outline-none transition-all font-medium text-sm resize-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={updating || uploading}
                            className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-pink-600 transition-all shadow-xl shadow-pink-500/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                        >
                            {updating ? "Saving Changes..." : (
                                <>
                                    <Check size={16} /> Save Product
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProductEditScreen;
