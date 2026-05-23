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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 flex-shrink-0 flex lg:flex-col gap-2 border-b lg:border-b-0 lg:border-r border-pink-100 pb-4 lg:pb-0 lg:pr-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'overview' ? 'bg-primary-600 text-white' : 'text-stone-600 hover:bg-pink-50'}`}
        >
          <LayoutDashboard size={18} />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'products' ? 'bg-primary-600 text-white' : 'text-stone-600 hover:bg-pink-50'}`}
        >
          <ShoppingCart size={18} />
          Products
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'categories' ? 'bg-primary-600 text-white' : 'text-stone-600 hover:bg-pink-50'}`}
        >
          <FolderHeart size={18} />
          Categories
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'orders' ? 'bg-primary-600 text-white' : 'text-stone-600 hover:bg-pink-50'}`}
        >
          <PackageOpen size={18} />
          Orders
        </button>
      </div>

      {/* Main Tab Panel */}
      <div className="flex-grow space-y-6">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif text-stone-900 font-bold">Admin Console Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-sm">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Total Sales</span>
                <p className="text-3xl font-bold text-primary-700 mt-2">${stats.totalSales.toFixed(2)}</p>
              </div>
              <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-sm">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Total Orders</span>
                <p className="text-3xl font-bold text-stone-900 mt-2">{stats.totalOrders}</p>
              </div>
              <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-sm">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Registered Customers</span>
                <p className="text-3xl font-bold text-stone-900 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-sm">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Active Catalog</span>
                <p className="text-3xl font-bold text-stone-900 mt-2">{stats.totalProducts} items</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-pink-50 pb-4">
              <h2 className="text-2xl font-serif text-stone-900 font-bold">Product Catalog</h2>
              {editingProduct && (
                <button onClick={resetProductForm} className="text-xs text-red-500 underline font-semibold">
                  Add New Instead
                </button>
              )}
            </div>

            {/* Product Creation / Edition Form */}
            <form onSubmit={handleSaveProduct} className="bg-white border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
                <Plus size={16} />
                {editingProduct ? 'Edit Product Details' : 'Register New Product'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Product Title</label>
                  <input type="text" value={prodName} onChange={e => setProdName(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary-400" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Price ($)</label>
                  <input type="number" step="0.01" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary-400" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Brand Name</label>
                  <input type="text" value={prodBrand} onChange={e => setProdBrand(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary-400" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Product Category</label>
                  <select value={prodCategory} onChange={e => setProdCategory(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-primary-400" required>
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Stock Level</label>
                  <input type="number" value={prodStock} onChange={e => setProdStock(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary-400" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Upload Product Image</label>
                  <div className="flex gap-2">
                    <input type="text" value={prodImage} readOnly className="w-full border border-stone-200 rounded px-3 py-1.5 text-[10px] bg-stone-50 text-stone-500 focus:outline-none" placeholder="Image url..." />
                    <label className="flex items-center gap-1 bg-primary-50 text-primary-700 px-3 rounded-lg text-xs font-semibold cursor-pointer border border-primary-100 hover:bg-primary-100 transition">
                      <UploadCloud size={14} />
                      Upload
                      <input type="file" onChange={handleUploadFile} className="hidden" accept="image/*" />
                    </label>
                  </div>
                  {uploading && <span className="text-[10px] text-primary-500 italic block mt-1">Uploading media file...</span>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Description</label>
                <textarea rows="2" value={prodDescription} onChange={e => setProdDescription(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary-400" required></textarea>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-full text-xs uppercase tracking-wider transition">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                {editingProduct && (
                  <button type="button" onClick={resetProductForm} className="border border-stone-200 text-stone-600 py-2 px-6 rounded-full text-xs uppercase tracking-wider hover:bg-stone-50 transition">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Products Table list */}
            <div className="bg-white border border-pink-100 rounded-2xl shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-pink-50/50 text-stone-500 uppercase font-semibold border-b border-pink-100">
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50/55">
                  {products.map(p => (
                    <tr key={p._id} className="hover:bg-pink-50/20 transition">
                      <td className="p-4">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-pink-100" />
                      </td>
                      <td className="p-4 font-semibold text-stone-800">{p.name}</td>
                      <td className="p-4 text-stone-500">{p.brand}</td>
                      <td className="p-4 font-bold text-stone-900">${p.price.toFixed(2)}</td>
                      <td className="p-4 font-semibold text-stone-600">{p.countInStock} items</td>
                      <td className="p-4 text-center space-x-2">
                        <button onClick={() => handleEditClick(p)} className="p-1.5 bg-stone-50 hover:bg-primary-50 hover:text-primary-700 rounded text-stone-400 transition">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteProduct(p._id)} className="p-1.5 bg-stone-50 hover:bg-red-50 hover:text-red-650 rounded text-stone-400 transition">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Categories */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-serif text-stone-900 font-bold border-b border-pink-50 pb-4">Category Management</h2>
            
            {/* Create Category Form */}
            <form onSubmit={handleCreateCategory} className="bg-white border border-pink-100 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
                <Plus size={16} />
                Create New Category
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Category Name</label>
                  <input type="text" value={catName} onChange={e => setCatName(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary-400" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Upload Category Banner</label>
                  <div className="flex gap-2">
                    <input type="text" value={catImage} readOnly className="w-full border border-stone-200 rounded px-3 py-1.5 text-[10px] bg-stone-50 text-stone-500 focus:outline-none" placeholder="Banner url..." />
                    <label className="flex items-center gap-1 bg-primary-50 text-primary-700 px-3 rounded-lg text-xs font-semibold cursor-pointer border border-primary-100 hover:bg-primary-100 transition">
                      <UploadCloud size={14} />
                      Upload
                      <input type="file" onChange={handleUploadCatFile} className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Description</label>
                <textarea rows="2" value={catDescription} onChange={e => setCatDescription(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary-400" required></textarea>
              </div>
              <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-full text-xs uppercase tracking-wider transition">
                Create Category
              </button>
            </form>

            {/* Categories list cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map(c => (
                <div key={c._id} className="flex gap-4 p-4 bg-white border border-pink-100 rounded-2xl items-center shadow-xxs">
                  <img src={c.image} alt={c.name} className="w-12 h-12 object-cover rounded-xl border border-pink-50" />
                  <div>
                    <h4 className="font-bold text-stone-850 text-sm">{c.name}</h4>
                    <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">{c.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-serif text-stone-900 font-bold border-b border-pink-50 pb-4">Incoming Orders Dashboard</h2>
            <div className="space-y-4">
              {orders.map(o => (
                <div key={o._id} className="bg-white border border-pink-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center border-b border-pink-50 pb-4 mb-4">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">User Info</span>
                      <p className="font-semibold text-xs text-stone-850">{o.user?.name || 'Guest User'} ({o.user?.email || 'N/A'})</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Date Placed</span>
                      <p className="text-xs text-stone-700 font-bold">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {o.orderItems && o.orderItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-stone-600">
                        <span>{item.name} x {item.qty}</span>
                        <span>${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-pink-50 pt-4 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${o.isPaid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {o.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${o.isDelivered ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        {o.isDelivered ? 'Delivered' : 'Pending Delivery'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block">Total paid</span>
                        <span className="font-bold text-stone-900 text-sm">${o.totalPrice.toFixed(2)}</span>
                      </div>
                      {!o.isDelivered && (
                        <button
                          onClick={() => handleDeliverOrder(o._id)}
                          className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold py-1.5 px-4 rounded-full transition shadow-xxs"
                        >
                          <CheckCircle size={12} />
                          Confirm Delivery
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
