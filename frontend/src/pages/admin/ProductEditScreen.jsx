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
  Tag,
  Upload,
  X,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  User,
  Users,
} from "lucide-react";

import api from "../../services/api";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  } catch {
    return null;
  }
};

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const isCreate = !productId;

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [userInfo] = useState(getStoredUser);

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

  const sidebarItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      link: "/admin-dashboard",
    },
    {
      name: "Customers",
      icon: Users,
      link: "/admin/userlist",
    },
    {
      name: "Products",
      icon: Package,
      link: "/admin/productlist",
      active: true,
    },
    {
      name: "Orders",
      icon: ShoppingBag,
      link: "/admin/orderlist",
    },
  ];

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
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const hasValidImage =
    image &&
    image !== "" &&
    image !== "/images/sample.jpg" &&
    !imageError;

  return (
    <main className="min-h-screen bg-white text-gray-950">
      {/* HERO SECTION */}
      <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
        <img
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1800&q=85"
          alt="Beauty products"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1460px] flex-col items-center justify-center px-6 text-center text-white sm:min-h-[320px]">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            {isCreate ? "Create Product" : "Edit Product"}
          </h1>

          <div className="mt-6 flex items-center gap-3 text-lg font-medium">
            <Link
              to="/"
              className="text-white/85 transition hover:text-white"
            >
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

            <span className="font-bold">
              {isCreate ? "Create" : "Edit"} Product
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1460px] px-6 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[315px_1fr]">
          {/* SIDEBAR */}
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
                    className={`flex items-center gap-3 px-5 py-3 transition hover:bg-[#f2f2f2] hover:text-pink-600 ${item.active ? "bg-[#f2f2f2]" : ""
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

          {/* MAIN CONTENT */}
          <section className="lg:pl-1">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-extrabold uppercase">
                  {isCreate ? "Create Product" : "Update Product"}
                </h2>

                <p className="mt-3 text-lg leading-8 text-gray-600">
                  Manage BeautyBliss product information, images, pricing,
                  inventory and product details.
                </p>
              </div>

              <Link
                to="/admin/productlist"
                className="inline-flex items-center gap-2 bg-[#2b2b2b] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-pink-600"
              >
                <ArrowLeft size={16} />
                Back
              </Link>
            </div>

            {loading ? (
              <div className="border border-gray-200 bg-white py-20 text-center text-sm font-bold uppercase tracking-widest text-gray-400 shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                Loading product...
              </div>
            ) : error ? (
              <div className="border border-red-100 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : (
              <form
                onSubmit={submitHandler}
                className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
              >
                {/* IMAGE SECTION */}
                <section className="bg-[#f6f6f6] p-6">
                  <h3 className="border-b border-gray-200 pb-4 text-2xl font-extrabold uppercase">
                    Product Image
                  </h3>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={uploadFileHandler}
                    className="hidden"
                  />

                  <div className="mt-6">
                    {hasValidImage ? (
                      <div className="group relative overflow-hidden bg-white">
                        <img
                          src={image}
                          alt="Product preview"
                          onError={() => setImageError(true)}
                          className="h-[420px] w-full object-contain transition duration-500 group-hover:scale-105"
                        />

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
                        >
                          <Upload size={28} />

                          <span className="text-sm font-bold uppercase tracking-widest">
                            Replace Image
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setImage("")}
                          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center bg-black text-white transition hover:bg-red-600"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex h-[420px] w-full flex-col items-center justify-center border-2 border-dashed bg-white p-8 text-center transition ${uploading
                            ? "border-amber-400 bg-amber-50"
                            : "border-gray-300 hover:border-pink-500"
                          }`}
                      >
                        {uploading ? (
                          <>
                            <span className="mb-5 h-12 w-12 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />

                            <span className="text-sm font-bold uppercase tracking-widest text-amber-700">
                              Uploading...
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="mb-5 flex h-20 w-20 items-center justify-center bg-[#f6f6f6] text-pink-600">
                              <Upload size={32} />
                            </div>

                            <p className="text-xl font-extrabold uppercase">
                              Upload Product Image
                            </p>

                            <p className="mt-3 text-base text-gray-500">
                              JPG, PNG or WEBP
                            </p>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="mt-6">
                    {!showUrlInput ? (
                      <button
                        type="button"
                        onClick={() => setShowUrlInput(true)}
                        className="text-sm font-bold uppercase tracking-widest text-gray-500 transition hover:text-pink-600"
                      >
                        Enter image URL manually
                      </button>
                    ) : (
                      <div className="border border-gray-200 bg-white p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <label className="text-sm font-bold uppercase tracking-widest text-gray-500">
                            Image URL
                          </label>

                          <button
                            type="button"
                            onClick={() => setShowUrlInput(false)}
                            className="text-sm font-bold uppercase tracking-widest text-pink-600"
                          >
                            Hide
                          </button>
                        </div>

                        <div className="relative">
                          <ImageIcon
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500"
                          />

                          <input
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            value={image}
                            onChange={(event) =>
                              setImage(event.target.value)
                            }
                            className="w-full border border-gray-300 py-4 pl-12 pr-4 text-base font-medium outline-none transition focus:border-pink-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* DETAILS SECTION */}
                <section className="bg-[#f6f6f6] p-6">
                  <h3 className="border-b border-gray-200 pb-4 text-2xl font-extrabold uppercase">
                    Product Details
                  </h3>

                  <div className="mt-6 space-y-6">
                    <Field
                      icon={Package}
                      label="Product Name"
                      value={name}
                      onChange={setName}
                      required
                    />

                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field
                        icon={DollarSign}
                        label="Price (Rs.)"
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

                    <div className="grid gap-6 sm:grid-cols-2">
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
                      <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-gray-500">
                        Description
                      </label>

                      <div className="relative">
                        <AlignLeft
                          size={18}
                          className="absolute left-4 top-5 text-pink-500"
                        />

                        <textarea
                          value={description}
                          required
                          rows={6}
                          onChange={(event) =>
                            setDescription(event.target.value)
                          }
                          className="w-full resize-none border border-gray-300 bg-white py-4 pl-12 pr-4 text-base font-medium outline-none transition focus:border-pink-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={updating || uploading}
                      className="flex h-14 w-full items-center justify-center gap-3 bg-[#2b2b2b] text-sm font-extrabold uppercase tracking-widest text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updating ? (
                        "Saving Changes..."
                      ) : (
                        <>
                          <Check size={18} />
                          Save Product
                        </>
                      )}
                    </button>
                  </div>
                </section>
              </form>
            )}
          </section>
        </div>
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
}) => {
  return (
    <div>
      <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-gray-500">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500"
        />

        <input
          type={type}
          step={step}
          value={value}
          required={required}
          onChange={(event) => onChange(event.target.value)}
          className="w-full border border-gray-300 bg-white py-4 pl-12 pr-4 text-base font-medium outline-none transition focus:border-pink-500"
        />
      </div>
    </div>
  );
};

export default ProductEditScreen;

