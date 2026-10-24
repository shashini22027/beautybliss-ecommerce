import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AdminSidebar from './components/AdminSidebar';

const InventoryScreen = () => {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [thresholds, setThresholds] = useState({});
  const [adjustments, setAdjustments] = useState({});
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadInventory = useCallback(async () => {
    setError('');
    try {
      const { data } = await api.get('/admin/inventory');
      const inventoryProducts = Array.isArray(data.products) ? data.products : [];
      setProducts(inventoryProducts);
      setMovements(Array.isArray(data.movements) ? data.movements : []);
      setLowStockCount(Number(data.lowStockCount) || 0);
      setThresholds(Object.fromEntries(inventoryProducts.map((product) => [product._id, Number(product.lowStockThreshold ?? 5)])));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadInventory(); }, [loadInventory]);

  const updateAdjustment = (key, field, value) => {
    setAdjustments((current) => ({ ...current, [key]: { ...current[key], [field]: value } }));
  };

  const submitAdjustment = async (event, product, variant = null) => {
    event.preventDefault();
    const key = `${product._id}:${variant?._id || 'base'}`;
    const form = adjustments[key] || {};
    setSavingId(key);
    setError('');
    setNotice('');
    try {
      const { data } = await api.post('/admin/inventory/adjust', {
        productId: product._id,
        variantId: variant?._id,
        quantityChange: Number(form.quantityChange),
        reason: form.reason,
      });
      setNotice(`${product.name}${variant ? ` · ${variant.name}` : ''}: ${data.message}`);
      setAdjustments((current) => ({ ...current, [key]: { quantityChange: '', reason: '' } }));
      await loadInventory();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save the stock adjustment.');
    } finally {
      setSavingId('');
    }
  };

  const saveThreshold = async (event, product) => {
    event.preventDefault();
    setSavingId(`threshold:${product._id}`);
    setError('');
    setNotice('');
    try {
      await api.patch(`/admin/inventory/${product._id}/threshold`, { threshold: Number(thresholds[product._id]) });
      setNotice(`Low-stock threshold saved for ${product.name}.`);
      await loadInventory();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save the low-stock threshold.');
    } finally {
      setSavingId('');
    }
  };

  const renderStockRow = (product, variant = null) => {
    const key = `${product._id}:${variant?._id || 'base'}`;
    const form = adjustments[key] || {};
    const quantity = Number(variant?.countInStock ?? product.countInStock ?? 0);
    const label = variant?.name || 'Main stock';
    return (
      <div key={key} className="border-t border-gray-100 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {variant?.hex && <span className="h-4 w-4 rounded-full border border-gray-300" style={{ backgroundColor: variant.hex }} aria-hidden="true" />}
            <span className="text-sm font-medium text-gray-800">{label}</span>
          </div>
          <span className={`text-sm font-bold ${quantity === 0 ? 'text-red-700' : quantity <= Number(product.lowStockThreshold ?? 5) ? 'text-amber-700' : 'text-emerald-700'}`}>{quantity} in stock</span>
        </div>
        <form onSubmit={(event) => submitAdjustment(event, product, variant)} className="mt-3 grid gap-2 sm:grid-cols-[140px_minmax(180px,1fr)_auto]">
          <label className="sr-only" htmlFor={`change-${key}`}>Stock change for {product.name} {label}</label>
          <input id={`change-${key}`} type="number" step="1" required value={form.quantityChange || ''} onChange={(event) => updateAdjustment(key, 'quantityChange', event.target.value)} placeholder="e.g. 12 or -2" className="h-10 border border-gray-300 px-3 text-sm" />
          <label className="sr-only" htmlFor={`reason-${key}`}>Reason for stock change</label>
          <input id={`reason-${key}`} type="text" required minLength={3} maxLength={200} value={form.reason || ''} onChange={(event) => updateAdjustment(key, 'reason', event.target.value)} placeholder="Reason (delivery, damage, recount…)" className="h-10 border border-gray-300 px-3 text-sm" />
          <button type="submit" disabled={Boolean(savingId)} className="h-10 bg-gray-950 px-4 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#a94f61] disabled:cursor-wait disabled:opacity-60">{savingId === key ? 'Saving…' : 'Adjust stock'}</button>
        </form>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="bg-[#f7f1ee] px-6 py-12 sm:py-16"><div className="mx-auto max-w-[1460px]"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-700">Operations</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Inventory management</h1><p className="mt-3 max-w-2xl text-gray-600">Review live stock, adjust product or shade quantities, set low-stock thresholds, and inspect recent stock changes.</p></div></section>
      <section className="mx-auto grid max-w-[1460px] gap-10 px-6 py-10 lg:grid-cols-[315px_1fr]"><AdminSidebar /><section className="min-w-0">
        {error && <div role="alert" className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
        {notice && <div role="status" className="mb-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</div>}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-[#ead4d6] bg-[#fff7f7] p-5"><div><p className="text-sm font-medium text-gray-600">Products at or below their stock threshold</p><p className="mt-1 text-3xl font-bold">{loading ? '—' : lowStockCount}</p></div><button type="button" onClick={loadInventory} disabled={loading} className="h-10 border border-gray-300 bg-white px-4 text-sm font-semibold hover:border-gray-500 disabled:opacity-50">Refresh inventory</button></div>
        {loading ? <div role="status" className="border border-gray-200 px-6 py-16 text-center text-sm text-gray-500">Loading inventory…</div> : products.length === 0 ? <div className="border border-gray-200 px-6 py-16 text-center text-sm text-gray-500">No products are in the catalog yet.</div> : <div className="space-y-4">{products.map((product) => {
          const variants = Array.isArray(product.variants) ? product.variants : [];
          const low = Number(product.countInStock || 0) <= Number(product.lowStockThreshold ?? 5);
          return <article key={product._id} className="border border-gray-200 bg-white">
            <header className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{product.name}</h2>{low && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900">Low stock</span>}</div><p className="mt-1 text-sm text-gray-500">Total: {Number(product.countInStock || 0)} units · {variants.length ? `${variants.length} shades` : 'Single stock'} · <Link to={`/admin/product/${product._id}/edit`} className="font-medium text-rose-700 underline">Edit product</Link></p></div>
              <form onSubmit={(event) => saveThreshold(event, product)} className="flex items-end gap-2"><label className="grid gap-1 text-xs font-medium text-gray-600">Low-stock threshold<input type="number" min="0" max="100000" step="1" required value={thresholds[product._id] ?? 5} onChange={(event) => setThresholds((current) => ({ ...current, [product._id]: event.target.value }))} className="h-10 w-28 border border-gray-300 px-3 text-sm text-gray-900" /></label><button type="submit" disabled={Boolean(savingId)} className="h-10 border border-gray-300 px-3 text-xs font-semibold hover:border-gray-600 disabled:opacity-50">{savingId === `threshold:${product._id}` ? 'Saving…' : 'Save'}</button></form>
            </header>
            {variants.length ? variants.map((variant) => renderStockRow(product, variant)) : renderStockRow(product)}
          </article>;
        })}</div>}
        <section className="mt-10"><h2 className="text-xl font-semibold">Recent stock activity</h2><p className="mt-1 text-sm text-gray-500">Last 100 stock changes and order reservations.</p>
          {loading ? <p className="mt-4 text-sm text-gray-500">Loading activity…</p> : movements.length === 0 ? <p className="mt-4 border border-gray-200 p-6 text-sm text-gray-500">No stock movements have been recorded yet.</p> : <div className="mt-4 overflow-x-auto border border-gray-200"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Product / shade</th><th className="px-4 py-3">Change</th><th className="px-4 py-3">Reason</th><th className="px-4 py-3">Recorded by</th></tr></thead><tbody className="divide-y divide-gray-100">{movements.map((movement) => <tr key={movement._id}><td className="whitespace-nowrap px-4 py-3 text-gray-600">{new Date(movement.createdAt).toLocaleString()}</td><td className="px-4 py-3 font-medium">{movement.productName}{movement.variantName ? ` · ${movement.variantName}` : ''}</td><td className={`px-4 py-3 font-bold ${movement.quantityChange < 0 ? 'text-amber-800' : 'text-emerald-800'}`}>{movement.quantityChange > 0 ? '+' : ''}{movement.quantityChange}</td><td className="max-w-[280px] px-4 py-3 text-gray-600">{movement.reason}</td><td className="px-4 py-3 text-gray-600">{movement.actor?.name || (movement.type === 'order' ? 'Order system' : 'Admin')}</td></tr>)}</tbody></table></div>}
        </section>
      </section></section>
    </main>
  );
};

export default InventoryScreen;
