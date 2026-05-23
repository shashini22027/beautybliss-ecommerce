import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import ReviewSection from '../components/ReviewSection';
import { CartContext } from '../context/CartContext';
import API from '../services/api';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center py-20">Loading beauty details...</div>;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2 bg-white rounded-2xl p-4 border border-pink-100">
          <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-xl" />
        </div>
        <div className="flex-grow space-y-6">
          <div>
            <span className="text-xs font-bold text-nude-500 uppercase tracking-widest">{product.brand}</span>
            <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <RatingStars rating={product.rating} />
              <span className="text-xs text-stone-400">({product.numReviews} Reviews)</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-900">${product.price.toFixed(2)}</p>
          <div className="max-h-32 overflow-y-auto text-sm text-stone-600 leading-relaxed pr-2">
            {product.description}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-500">Qty</span>
            <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="border border-stone-200 rounded p-1 text-sm focus:outline-none">
              {[...Array(product.countInStock || 10).keys()].map(x => (
                <option key={x + 1} value={x + 1}>{x + 1}</option>
              ))}
            </select>
            <button
              onClick={() => addToCart(product, qty)}
              className="flex-grow bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-full uppercase tracking-wider text-xs transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <ReviewSection product={product} />
    </div>
  );
};

export default ProductDetailsPage;
