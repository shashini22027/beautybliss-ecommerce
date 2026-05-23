import React, { useState } from 'react';
import RatingStars from './RatingStars';
import API from '../services/api';

const ReviewSection = ({ product, onReviewAdded }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post(`/products/${product._id}/reviews`, { rating, comment });
      alert('Review submitted successfully!');
      setComment('');
      setRating(5);
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit review. Make sure you are logged in!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-pink-100/60 pt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="space-y-4">
        <h3 className="text-xl font-serif text-stone-900 font-bold">Reviews</h3>
        {product.reviews && product.reviews.length === 0 ? (
          <p className="text-stone-400 text-sm">No reviews yet for this product.</p>
        ) : (
          <div className="space-y-4">
            {product.reviews && product.reviews.map((rev) => (
              <div key={rev._id} className="p-4 bg-white rounded-lg border border-pink-50 shadow-xxs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-stone-800 text-sm">{rev.name}</span>
                  <RatingStars rating={rev.rating} />
                </div>
                <p className="text-stone-600 text-xs">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white p-6 border border-pink-100 rounded-xl space-y-4 h-fit">
        <h3 className="text-lg font-serif text-stone-900 font-bold">Write a Customer Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Rating</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full border border-stone-200 rounded p-2 text-sm focus:outline-none focus:border-primary-400">
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Comment</label>
            <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border border-stone-200 rounded p-2 text-sm focus:outline-none focus:border-primary-400" placeholder="Describe your experience with this beauty item..." required></textarea>
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-stone-900 hover:bg-stone-950 text-white font-semibold py-2 rounded text-xs uppercase tracking-wider transition disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewSection;
