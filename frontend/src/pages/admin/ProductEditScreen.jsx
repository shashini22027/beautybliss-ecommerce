import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AlignLeft,
  ArrowLeft,
  Check,
  DollarSign,
  Hash,
  Image as ImageIcon,
  Package,
  Star,
  Tag,
  Upload,
  X,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
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

const MAX_STANDARD_IMAGES = 2;
const MAX_LIPSTICK_IMAGES = 5;

const normalizeImageValues = (...values) => {
  const images = [];

  const pushValue = (value) => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) {
        images.push(trimmed);
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(pushValue);
      return;
    }

    if (value && typeof value === "object" && typeof value.url === "string") {
      pushValue(value.url);
    }
  };

  values.forEach(pushValue);

  return [...new Set(images)];
};

const isLipstickProduct = (name, subcategory, categoryName) =>
  [name, subcategory, categoryName].filter(Boolean).join(" ").toLowerCase().includes("lipstick");

const getCategoryName = (categories, categoryId) =>
  categories.find((cat) => cat._id === categoryId)?.name || "";

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const isCreate = !productId;
  const location = useLocation();
  const useFloralBloomTemplate = isCreate && location.state?.template === "floralBloom";

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [userInfo] = useState(getStoredUser);

  const [name, setName] = useState(
    useFloralBloomTemplate ? "BeautyBliss Floral Bloom Perfume" : ""
  );
  const [price, setPrice] = useState(useFloralBloomTemplate ? 13200 : 0);
  const [image, setImage] = useState(
    useFloralBloomTemplate
      ? "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80"
      : ""
  );
  const [images, setImages] = useState(
    useFloralBloomTemplate
      ? ["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80"]
      : []
  );
  const [imageError, setImageError] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [brand, setBrand] = useState(useFloralBloomTemplate ? "BeautyBliss" : "");
  const [subcategory, setSubcategory] = useState(
    useFloralBloomTemplate ? "Perfumes" : ""
  );
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(useFloralBloomTemplate ? 24 : 0);
  const [description, setDescription] = useState(
    useFloralBloomTemplate
      ? "Immerse yourself in a blooming paradise with this enchanting eau de parfum. Featuring a sophisticated blend of fresh jasmine, delicate white rose, and a subtle touch of warm musk, it delivers a captivating, romantic, and long-lasting scent trail perfect for the modern, elegant woman."
      : ""
  );
  const [compareAtPrice, setCompareAtPrice] = useState(
    useFloralBloomTemplate ? 16500 : ""
  );
  const [discountLabel, setDiscountLabel] = useState(
    useFloralBloomTemplate ? "20% OFF" : ""
  );
  const [rating, setRating] = useState(useFloralBloomTemplate ? 4.9 : "");
  const [isBestSeller, setIsBestSeller] = useState(useFloralBloomTemplate);
  const [isNewArrival, setIsNewArrival] = useState(useFloralBloomTemplate);
  const [isHotDeal, setIsHotDeal] = useState(useFloralBloomTemplate);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

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

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        // data may be an array directly or { categories: [...] }
        const cats = Array.isArray(data) ? data : data.categories || [];
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!useFloralBloomTemplate || categories.length === 0 || category) {
      return;
    }

    const fragrancesCategory = categories.find(
      (cat) => (cat.name || "").toLowerCase() === "fragrances"
    );

    if (fragrancesCategory?._id) {
      setCategory(fragrancesCategory._id);
    }
  }, [categories, category, useFloralBloomTemplate]);

  const categoryName = getCategoryName(categories, category);
  const imageLimit = isLipstickProduct(name, subcategory, categoryName)
    ? MAX_LIPSTICK_IMAGES
    : MAX_STANDARD_IMAGES;

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
        const normalizedImages = normalizeImageValues(product.image, product.images);

        setName(product.name || "");
        setPrice(product.price || 0);
        setImage(normalizedImages[0] || "");
        setImages(normalizedImages);
        setBrand(product.brand || "");
        setSubcategory(product.subcategory || "");

        setCategory(
          typeof product.category === "object"
            ? product.category?._id || ""
            : product.category || ""
        );

        setCountInStock(product.countInStock || 0);
        setDescription(product.description || "");
        setCompareAtPrice(product.compareAtPrice ?? "");
        setDiscountLabel(product.discountLabel || "");
        setRating(product.rating ?? "");
        setIsBestSeller(Boolean(product.isBestSeller));
        setIsNewArrival(Boolean(product.isNewArrival));
        setIsHotDeal(Boolean(product.isHotDeal));
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const uploadFileHandler = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (!selectedFiles.length) return;

    const remainingSlots = imageLimit - images.length;
    if (remainingSlots <= 0) {
      setError(`This product can only have up to ${imageLimit} image${imageLimit === 1 ? "" : "s"}.`);
      return;
    }

    const filesToUpload = selectedFiles.slice(0, remainingSlots);
    const formData = new FormData();

    filesToUpload.forEach((file) => {
      formData.append("images", file);
    });

    try {
      setUploading(true);

      const { data } = await api.post("/upload", formData);
      const uploadedImages = normalizeImageValues(data.urls, data.url);

      setImages((current) => {
        const nextImages = normalizeImageValues(current, uploadedImages).slice(0, imageLimit);
        setImage(nextImages[0] || "");
        return nextImages;
      });
      setImageError(false);
    } catch (err) {
      console.error("Image upload failed", err);
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const setPrimaryImage = (index) => {
    setImages((current) => {
      if (!current[index]) {
        return current;
      }

      const nextImages = [current[index], ...current.filter((_, itemIndex) => itemIndex !== index)];
      setImage(nextImages[0] || "");
      return nextImages;
    });
  };

  const removeImage = (index) => {
    setImages((current) => {
      if (current.length <= 1) {
        setError("Each product needs at least one image.");
        return current;
      }

      const nextImages = current.filter((_, itemIndex) => itemIndex !== index);
      setImage(nextImages[0] || "");
      return nextImages;
    });
  };

  const addManualImage = () => {
    const nextUrl = manualImageUrl.trim();

    if (!nextUrl) {
      return;
    }

    if (images.length >= imageLimit) {
      setError(`This product can only have up to ${imageLimit} image${imageLimit === 1 ? "" : "s"}.`);
      return;
    }

    const nextImages = normalizeImageValues(images, nextUrl).slice(0, imageLimit);
    setImages(nextImages);
    setImage(nextImages[0] || "");
    setManualImageUrl("");
    setShowUrlInput(false);
    setImageError(false);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      setUpdating(true);
      setError(null);

      const parsedCompareAtPrice =
        compareAtPrice === "" || Number.isNaN(Number(compareAtPrice))
          ? null
          : Number(compareAtPrice);

      if (!images.length) {
        setError("Please add at least one product image.");
        return;
      }

      if (images.length > imageLimit) {
        setError(`This product can only have up to ${imageLimit} image${imageLimit === 1 ? "" : "s"}.`);
        return;
      }

      const payload = {
        name,
        price,
        image: images[0] || "",
        images,
        brand,
        subcategory,
        category,
        countInStock,
        description,
        compareAtPrice: parsedCompareAtPrice,
        discountLabel,
        rating: rating === "" ? undefined : Number(rating),
        isBestSeller,
        isNewArrival,
        isHotDeal,
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
    images[0] &&
    images[0] !== "" &&
    images[0] !== "/images/sample.jpg" &&
    !imageError;

  return (
    <main className="min-h-screen bg-white text-gray-950">
      {/* HERO SECTION */}
      <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
        <img
          src="/images/admin_banner.png"
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
                to="/admin/sales"
                className="flex items-center gap-3 px-5 py-3 transition hover:bg-[#f2f2f2] hover:text-pink-600"
              >
                <DollarSign className="h-5 w-5" />
                Sales
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
                    Product Images
                  </h3>

                  <p className="mt-4 text-sm font-medium leading-6 text-gray-500">
                    Upload up to {imageLimit} image{imageLimit === 1 ? "" : "s"}.
                    Lipstick products can use 5 images.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    multiple
                    onChange={uploadFileHandler}
                    className="hidden"
                  />

                  <div className="mt-6">
                    {hasValidImage ? (
                      <div className="group relative overflow-hidden bg-white">
                        <img
                          src={images[0]}
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
                            Add More Images
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeImage(0)}
                          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center bg-black text-white transition hover:bg-red-600"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex h-[420px] w-full flex-col items-center justify-center border-2 border-dashed bg-white p-8 text-center transition ${
                          uploading
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
                              Upload Product Images
                            </p>

                            <p className="mt-3 text-base text-gray-500">
                              JPG, PNG or WEBP
                            </p>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {images.length > 0 ? (
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {images.map((img, index) => (
                        <div
                          key={`${img}-${index}`}
                          className={`group relative overflow-hidden bg-white ${index === 0 ? "ring-2 ring-pink-500" : ""}`}
                        >
                          <img
                            src={img}
                            alt={`Product ${index + 1}`}
                            className="h-32 w-full object-contain"
                          />

                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/60 p-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(index)}
                              className="text-[10px] font-bold uppercase tracking-widest text-white"
                            >
                              Primary
                            </button>

                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="text-[10px] font-bold uppercase tracking-widest text-white"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-6">
                    {!showUrlInput ? (
                      <button
                        type="button"
                        onClick={() => setShowUrlInput(true)}
                        className="text-sm font-bold uppercase tracking-widest text-gray-500 transition hover:text-pink-600"
                      >
                        Add image URL manually
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
                            value={manualImageUrl}
                            onChange={(event) => setManualImageUrl(event.target.value)}
                            className="w-full border border-gray-300 py-4 pl-12 pr-4 text-base font-medium outline-none transition focus:border-pink-500"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={addManualImage}
                          className="mt-4 inline-flex h-11 items-center justify-center bg-[#2b2b2b] px-5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-pink-600"
                        >
                          Add URL
                        </button>
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
                        icon={Package}
                        label="Subcategory"
                        value={subcategory}
                        onChange={setSubcategory}
                        required
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Category Dropdown */}
                      <div>
                        <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-gray-500">
                          Category
                        </label>

                        <div className="relative">
                          <Tag
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500"
                          />

                          <select
                            value={category}
                            required
                            onChange={(event) =>
                              setCategory(event.target.value)
                            }
                            className="w-full appearance-none border border-gray-300 bg-white py-4 pl-12 pr-4 text-base font-medium outline-none transition focus:border-pink-500"
                          >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat._id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <Field
                        icon={Star}
                        label="Rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={rating}
                        onChange={setRating}
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

                    <div className="space-y-5 border border-gray-200 bg-white p-5">
                      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">
                            Homepage Merchandising
                          </h4>
                          <p className="mt-2 text-sm text-gray-500">
                            Control where this product appears on the homepage.
                          </p>
                        </div>
                      </div>

                      <Field
                        icon={DollarSign}
                        label="Compare At Price (optional)"
                        type="number"
                        step="0.01"
                        value={compareAtPrice}
                        onChange={setCompareAtPrice}
                      />

                      <Field
                        icon={Tag}
                        label="Discount Label (optional)"
                        value={discountLabel}
                        onChange={setDiscountLabel}
                      />

                      <div className="grid gap-4 sm:grid-cols-3">
                        <ToggleField
                          label="Best Selling"
                          checked={isBestSeller}
                          onChange={setIsBestSeller}
                        />

                        <ToggleField
                          label="New Arrival"
                          checked={isNewArrival}
                          onChange={setIsNewArrival}
                        />

                        <ToggleField
                          label="Hot Deal"
                          checked={isHotDeal}
                          onChange={setIsHotDeal}
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
  min,
  max,
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
          min={min}
          max={max}
          value={value}
          required={required}
          onChange={(event) => onChange(event.target.value)}
          className="w-full border border-gray-300 bg-white py-4 pl-12 pr-4 text-base font-medium outline-none transition focus:border-pink-500"
        />
      </div>
    </div>
  );
};

const ToggleField = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center justify-between gap-4 border border-gray-300 bg-white px-4 py-4">
      <span className="text-sm font-bold uppercase tracking-widest text-gray-500">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-pink-600"
      />
    </label>
  );
};

export default ProductEditScreen;
