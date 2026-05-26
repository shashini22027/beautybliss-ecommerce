import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlignLeft,
  ArrowLeft,
  Check,
  DollarSign,
  Hash,
  Image as ImageIcon,
  Package,
  Sparkles,
  Tag,
  Upload,
  X,
} from "lucide-react";
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
        setError(null);
        const { data } = await api.get(`/products/${productId}`);
        const product = data.product || data;

        setName(product.name || "");
        setPrice(product.price || 0);
        setImage(product.image || "");
        setBrand(product.brand || "");
        setCategory(
          typeof product.category === "object"
            ? product.category?._id || product.category?.name || ""
            : product.category || ""
        );
        setCountInStock(product.countInStock || 0);
        setDescription(product.description || "");
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const uploadFileHandler = async (event) => {
    const file = event.target.files[0];
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

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      setUpdating(true);
      setError(null);

      const payload = {
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      };

      if (isCreate) {
        await api.post("/products", payload);
      } else {
        await api.put(`/products/${productId}`, payload);
      }

      navigate("/admin/productlist");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setUpdating(false);
    }
  };

  const hasValidImage =
    image && image !== "" && image !== "/images/sample.jpg" && !imageError;

  return (
    <main className="min-h-screen bg-[#fff7f8] px-4 py-10 text-gray-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <Link
          to="/admin/productlist"
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-pink-200 bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 shadow-sm transition hover:border-pink-300 hover:text-gray-950"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-pink-600">
            <ArrowLeft size={12} strokeWidth={3} />
          </span>
          Back to Products
        </Link>

        <div className="mb-8 rounded-2xl border border-pink-200 bg-white p-6 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-pink-500">
            {isCreate ? "New Catalog Item" : "Catalog Editor"}
          </p>
          <h1 className="flex items-center gap-3 font-serif text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
            <Sparkles size={34} className="text-pink-500" />
            {isCreate ? "Create Product" : "Edit Product"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-gray-500">
            Update product details, inventory, pricing, and imagery for your
            BeautyBliss catalog.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-pink-200 bg-white py-20 text-center text-sm font-bold uppercase tracking-widest text-gray-400 shadow-sm">
            Loading product data...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : (
          <form onSubmit={submitHandler} className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-2xl border border-pink-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                Product Image
              </h2>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={uploadFileHandler}
                className="hidden"
              />

              {hasValidImage ? (
                <div className="group relative h-96 overflow-hidden rounded-2xl border border-pink-100 bg-[#fff0f4]">
                  <img
                    src={image}
                    alt="Product preview"
                    onError={() => setImageError(true)}
                    className="h-full w-full object-contain bg-white transition duration-500 group-hover:scale-[1.02]"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-950/45 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/20">
                      <Upload size={20} />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Replace Photo
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-950/70 text-white shadow-lg transition hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex h-96 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
                    uploading
                      ? "border-amber-400 bg-amber-50"
                      : "border-pink-200 bg-[#fff0f4] hover:border-pink-400 hover:bg-[#ffe9f0]"
                  }`}
                >
                  {uploading ? (
                    <>
                      <span className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
                      <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                        Uploading image...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-pink-500 shadow-sm">
                        <Upload size={24} />
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {imageError
                          ? "Image failed to load. Upload a new image."
                          : "Upload product image"}
                      </span>
                      <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        JPG, PNG or WebP
                      </span>
                    </>
                  )}
                </button>
              )}

              <div className="mt-5">
                {!showUrlInput ? (
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-400 transition hover:text-pink-600"
                  >
                    Or enter image URL manually
                  </button>
                ) : (
                  <div className="rounded-xl border border-pink-100 bg-[#fff7f8] p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Direct Image URL
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowUrlInput(false)}
                        className="text-[10px] font-bold uppercase tracking-widest text-gray-400 transition hover:text-pink-600"
                      >
                        Hide
                      </button>
                    </div>
                    <div className="relative">
                      <ImageIcon
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500"
                      />
                      <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={image}
                        onChange={(event) => setImage(event.target.value)}
                        className="w-full rounded-xl border border-pink-100 bg-white py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-pink-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                Product Details
              </h2>

              <div className="space-y-5">
                <Field
                  icon={Package}
                  label="Product Name"
                  value={name}
                  onChange={setName}
                  required
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    icon={DollarSign}
                    label="Price ($)"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={setPrice}
                    required
                  />
                  <Field
                    icon={Hash}
                    label="Stock Count"
                    type="number"
                    value={countInStock}
                    onChange={setCountInStock}
                    required
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    icon={Tag}
                    label="Brand"
                    value={brand}
                    onChange={setBrand}
                    required
                  />
                  <Field
                    icon={Tag}
                    label="Category"
                    value={category}
                    onChange={setCategory}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Description
                  </label>
                  <div className="relative">
                    <AlignLeft
                      size={16}
                      className="absolute left-4 top-5 text-pink-500"
                    />
                    <textarea
                      value={description}
                      required
                      rows="5"
                      onChange={(event) => setDescription(event.target.value)}
                      className="w-full resize-none rounded-xl border border-pink-100 bg-[#fff7f8] py-4 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updating || uploading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-pink-500/20 transition hover:bg-pink-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updating ? (
                    "Saving Changes..."
                  ) : (
                    <>
                      <Check size={16} /> Save Product
                    </>
                  )}
                </button>
              </div>
            </section>
          </form>
        )}
      </section>
    </main>
  );
};

const Field = ({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  step,
}) => (
  <div>
    <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-500">
      {label}
    </label>
    <div className="relative">
      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />
      <input
        type={type}
        step={step}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-pink-100 bg-[#fff7f8] py-4 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100"
      />
    </div>
  </div>
);

export default ProductEditScreen;
