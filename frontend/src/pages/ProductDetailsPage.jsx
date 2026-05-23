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
  const [activeImage, setActiveImage] = useState('');
  const { addToCart } = useContext(CartContext);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      setActiveImage(data.image);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center py-20 text-stone-500 font-serif">Loading beauty details...</div>;

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  const handleMainImageClick = () => {
    if (allImages.length <= 1) return;
    const currentIndex = allImages.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setActiveImage(allImages[nextIndex]);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left Side: Images Gallery */}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-pink-100/60 flex justify-center items-center aspect-square overflow-hidden cursor-pointer select-none" onClick={handleMainImageClick}>
            <img src={activeImage} alt={product.name} className="w-full h-full object-cover rounded-xl transition duration-300" />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto py-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${activeImage === img ? 'border-primary-500 scale-[1.03]' : 'border-pink-50 hover:border-pink-200'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {allImages.length > 1 && (
            <p className="text-[10px] text-stone-400 text-center italic">Tip: Click the main image to cycle through photos</p>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="flex-grow space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-[10px] font-bold text-nude-500 uppercase tracking-widest">{product.brand}</span>
              {product.country && (
                <span className="text-[10px] font-bold bg-pink-50 text-primary-700 px-2 rounded-full uppercase tracking-wider">{product.country} Beauty</span>
              )}
            </div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <RatingStars rating={product.rating} />
              <span className="text-xs text-stone-400">({product.numReviews} Reviews)</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-900">${product.price.toFixed(2)}</p>
          
          <div className="text-sm text-stone-600 leading-relaxed pr-2 space-y-2">
            <p>{product.description}</p>
            {product.color && (
              <p className="text-xs font-semibold text-stone-700">Shade / Color: <span className="text-primary-700 uppercase">{product.color}</span></p>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-pink-50/60">
            <span className="text-sm text-stone-500">Qty</span>
            <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="border border-stone-200 rounded p-1.5 text-sm focus:outline-none">
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

      <ReviewSection product={product} onReviewAdded={fetchProduct} />
    </div>
  );
};

export default ProductDetailsPage;
