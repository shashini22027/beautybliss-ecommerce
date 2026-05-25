import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { LayoutDashboard, ShoppingCart, FolderHeart, PackageOpen, Plus, Trash2, Edit2, UploadCloud, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  
  // Data lists
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  // Product Form states
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [uploading, setUploading] = useState(false);

  // Category Form states
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catImage, setCatImage] = useState('');

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchCategories();
    fetchOrders();
  }, []);

  // Handle Image Uploads via Multer
  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await API.post('/upload', formData, config);
      setProdImage(data.image);
      setUploading(false);
    } catch (err) {
      console.error(err);
      alert('Image upload failed. Ensure correct formats: jpg, jpeg, png, webp');
      setUploading(false);
    }
  };

  const handleUploadCatFile = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await API.post('/upload', formData, config);
      setCatImage(data.image);
      setUploading(false);
    } catch (err) {
      console.error(err);
      alert('Image upload failed');
      setUploading(false);
    }
  };

  // Create or Update Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!prodImage) {
      alert('Please upload a product image first.');
      return;
    }

    const payload = {
      name: prodName,
      price: Number(prodPrice),
      brand: prodBrand,
      category: prodCategory,
      countInStock: Number(prodStock),
      description: prodDescription,
      image: prodImage
    };

    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, payload);
        alert('Product updated successfully!');
      } else {
        await API.post('/products', payload);
        alert('Product added successfully!');
      }
      // Reset
      resetProductForm();
      fetchProducts();
      fetchStats();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdPrice(product.price);
    setProdBrand(product.brand);
    setProdCategory(product.category);
    setProdStock(product.countInStock);
    setProdDescription(product.description);
    setProdImage(product.image);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
        fetchStats();
        alert('Product deleted successfully');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice('');
    setProdBrand('');
    setProdCategory('');
    setProdStock('');
    setProdDescription('');
    setProdImage('');
  };

  // Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await API.post('/categories', {
        name: catName,
        description: catDescription,
        image: catImage || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80'
      });
      alert('Category added successfully!');
      setCatName('');
      setCatDescription('');
      setCatImage('');
      fetchCategories();
      fetchStats();
    } catch (err) {
      console.error(err);
      alert('Failed to add category');
    }
  };

  // Confirm/Deliver Order
  const handleDeliverOrder = async (id) => {
    try {
      await API.put(`/orders/${id}/deliver`);
      alert('Order marked as delivered!');
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) return <div className="text-center py-20 text-stone-500 font-serif">Loading Admin Console...</div>;

  return (
    <main className="min-h-screen bg-[#faf7f4] px-4 py-10 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_24px_80px_rgba(28,25,23,0.08)] sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-pink-500">Admin Dashboard</p>
              <h1 className="mt-2 text-4xl font-serif font-bold tracking-tight text-gray-950">BeautyBliss Control Center</h1>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-3xl bg-pink-50 px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-pink-600">Sales</p>
                <p className="mt-2 text-lg font-bold text-pink-700">${stats.totalSales.toFixed(2)}</p>
              </div>
              <div className="rounded-3xl bg-gray-50 px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Orders</p>
                <p className="mt-2 text-lg font-bold text-stone-900">{stats.totalOrders}</p>
              </div>
              <div className="rounded-3xl bg-gray-50 px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Customers</p>
                <p className="mt-2 text-lg font-bold text-stone-900">{stats.totalUsers}</p>
              </div>
              <div className="rounded-3xl bg-gray-50 px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Products</p>
                <p className="mt-2 text-lg font-bold text-stone-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_24px_80px_rgba(28,25,23,0.08)] sm:p-8">
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
              { key: 'products', label: 'Products', icon: <ShoppingCart size={18} /> },
              { key: 'categories', label: 'Categories', icon: <FolderHeart size={18} /> },
              { key: 'orders', label: 'Orders', icon: <PackageOpen size={18} /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${activeTab === tab.key ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {activeTab === 'overview' && (
          <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_24px_80px_rgba(28,25,23,0.08)] sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-pink-100 bg-pink-50 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-pink-700">Total Sales</p>
                <p className="mt-3 text-3xl font-bold text-pink-700">${stats.totalSales.toFixed(2)}</p>
              </div>
              <div className="rounded-3xl border border-pink-100 bg-gray-50 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Total Orders</p>
                <p className="mt-3 text-3xl font-bold text-stone-900">{stats.totalOrders}</p>
              </div>
              <div className="rounded-3xl border border-pink-100 bg-gray-50 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Customers</p>
                <p className="mt-3 text-3xl font-bold text-stone-900">{stats.totalUsers}</p>
              </div>
              <div className="rounded-3xl border border-pink-100 bg-gray-50 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Products</p>
                <p className="mt-3 text-3xl font-bold text-stone-900">{stats.totalProducts}</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'products' && (
          <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_24px_80px_rgba(28,25,23,0.08)] sm:p-8 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-pink-50 pb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-950">Product Catalog</h2>
                <p className="mt-2 text-sm text-gray-500">Manage items, update inventory and keep your catalog polished.</p>
              </div>
              {editingProduct && <button onClick={resetProductForm} className="text-xs text-red-500 underline font-semibold">Add New Instead</button>}
            </div>
            <form onSubmit={handleSaveProduct} className="rounded-[2rem] border border-pink-100 bg-pink-50 p-6 shadow-sm space-y-4">
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Product Title</label>
                  <input value={prodName} onChange={e => setProdName(e.target.value)} className="w-full rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary-400" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Price ($)</label>
                  <input type="number" step="0.01" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary-400" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Brand</label>
                  <input value={prodBrand} onChange={e => setProdBrand(e.target.value)} className="w-full rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary-400" required />
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Category</label>
                  <select value={prodCategory} onChange={e => setProdCategory(e.target.value)} className="w-full rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary-400" required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Stock</label>
                  <input type="number" value={prodStock} onChange={e => setProdStock(e.target.value)} className="w-full rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary-400" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Image URL</label>
                  <div className="flex gap-2">
                    <input type="text" value={prodImage} readOnly className="w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500 focus:outline-none" placeholder="Image url..." />
                    <label className="inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700 border border-primary-100 cursor-pointer hover:bg-primary-50 transition">
                      <UploadCloud size={16} /> Upload
                      <input type="file" onChange={handleUploadFile} className="hidden" accept="image/*" />
                    </label>
                  </div>
                  {uploading && <p className="text-[10px] text-primary-600">Uploading image...</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Description</label>
                <textarea rows="3" value={prodDescription} onChange={e => setProdDescription(e.target.value)} className="w-full rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary-400" required />
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="rounded-full bg-primary-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-primary-700">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                {editingProduct && <button type="button" onClick={resetProductForm} className="rounded-full border border-stone-200 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-stone-700 transition hover:bg-stone-50">Cancel</button>}
              </div>
            </form>
            <div className="rounded-[2rem] border border-pink-100 bg-white shadow-sm overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-pink-50 text-stone-500 uppercase tracking-[0.18em]">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {products.map(p => (
                    <tr key={p._id} className="hover:bg-pink-50/40 transition">
                      <td className="p-4"><img src={p.image} alt={p.name} className="h-10 w-10 rounded-xl object-cover border border-pink-100" /></td>
                      <td className="p-4 font-semibold text-stone-800">{p.name}</td>
                      <td className="p-4 text-stone-500">{p.brand}</td>
                      <td className="p-4 font-bold text-stone-900">${p.price.toFixed(2)}</td>
                      <td className="p-4 font-semibold text-stone-600">{p.countInStock}</td>
                      <td className="p-4 text-center space-x-2">
                        <button onClick={() => handleEditClick(p)} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-stone-500 hover:bg-primary-50 hover:text-primary-700 transition"><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteProduct(p._id)} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-stone-500 hover:bg-red-50 hover:text-red-600 transition"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'categories' && (
          <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_24px_80px_rgba(28,25,23,0.08)] sm:p-8 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-pink-50 pb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-950">Category Management</h2>
                <p className="mt-2 text-sm text-gray-500">Add new categories and keep your storefront navigation updated.</p>
              </div>
            </div>
            <form onSubmit={handleCreateCategory} className="rounded-[2rem] border border-pink-100 bg-pink-50 p-6 shadow-sm space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Category Name</label>
                  <input value={catName} onChange={e => setCatName(e.target.value)} className="w-full rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary-400" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Upload Banner</label>
                  <div className="flex gap-2">
                    <input type="text" value={catImage} readOnly className="w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500 focus:outline-none" placeholder="Banner url..." />
                    <label className="inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700 border border-primary-100 cursor-pointer hover:bg-primary-50 transition"><UploadCloud size={16} />Upload<input type="file" onChange={handleUploadCatFile} className="hidden" accept="image/*" /></label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Description</label>
                <textarea rows="3" value={catDescription} onChange={e => setCatDescription(e.target.value)} className="w-full rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary-400" required />
              </div>
              <button type="submit" className="rounded-full bg-primary-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-primary-700">Create Category</button>
            </form>
            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map(c => (
                <div key={c._id} className="flex gap-4 rounded-[2rem] border border-pink-100 bg-white p-4 shadow-sm">
                  <img src={c.image} alt={c.name} className="h-12 w-12 rounded-xl object-cover border border-pink-50" />
                  <div>
                    <h3 className="font-semibold text-stone-900">{c.name}</h3>
                    <p className="mt-1 text-xs text-stone-500 line-clamp-2">{c.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'orders' && (
          <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_24px_80px_rgba(28,25,23,0.08)] sm:p-8 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-pink-50 pb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-950">Incoming Orders</h2>
                <p className="mt-2 text-sm text-gray-500">Track order status and confirm delivery as shipments arrive.</p>
              </div>
            </div>
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o._id} className="rounded-[2rem] border border-pink-100 bg-gray-50 p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-pink-100 pb-4 mb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.28em] text-stone-500">Customer</span>
                      <p className="mt-2 text-sm font-semibold text-stone-900">{o.user?.name || 'Guest User'}</p>
                      <p className="text-xs text-stone-500">{o.user?.email || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-[0.28em] text-stone-500">Placed</span>
                      <p className="mt-2 text-sm font-semibold text-stone-900">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {o.orderItems?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm text-stone-700">
                        <span>{item.name} x {item.qty}</span>
                        <span>${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] ${o.isPaid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{o.isPaid ? 'Paid' : 'Unpaid'}</span>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] ${o.isDelivered ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{o.isDelivered ? 'Delivered' : 'Pending Delivery'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500">Total</p>
                        <p className="mt-1 text-sm font-bold text-stone-950">${o.totalPrice.toFixed(2)}</p>
                      </div>
                      {!o.isDelivered && (
                        <button onClick={() => handleDeliverOrder(o._id)} className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-primary-700"><CheckCircle size={14} />Confirm Delivery</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
