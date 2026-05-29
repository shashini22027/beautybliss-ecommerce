import React, { useEffect, useState } from 'react';
import RatingStars from './RatingStars';
import API from '../services/api';

const ReviewSection = ({ product, onReviewAdded }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const canSubmitReview = Boolean(product?._id);
  const [localReviews, setLocalReviews] = useState(product?.reviews || []);

  useEffect(() => {
    setLocalReviews(product?.reviews || []);
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      if (canSubmitReview) {
        await API.post(`/products/${product._id}/reviews`, { rating, comment });
        if (onReviewAdded) onReviewAdded();
      } else {
        setLocalReviews((reviews) => [
          {
            _id: `local-review-${Date.now()}`,
            name: 'Customer',
            rating,
            comment,
          },
          ...reviews,
        ]);
      }

      alert('Review submitted successfully!');
      setComment('');
      setRating(5);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit review. Make sure you are logged in!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.05fr_0.95fr]">
      <div>
        <div className="mb-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-pink-600">
            Customer Notes
          </p>
          <h3 className="text-3xl font-bold tracking-tight text-gray-950">
            Reviews
          </h3>
        </div>

        {localReviews.length === 0 ? (
          <div className="border border-gray-100 bg-gray-50 px-6 py-12 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-400">
              No reviews yet
            </p>
            <p className="mt-3 text-sm text-gray-500">
              Be the first to share your experience with this beauty item.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {localReviews.map((rev) => (
              <div key={rev._id || `${rev.name}-${rev.comment}`} className="border border-gray-100 bg-white p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-bold text-gray-900">
                    {rev.name}
                  </span>
                  <RatingStars rating={rev.rating} />
                </div>
                <p className="text-sm leading-7 text-gray-600">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-fit border border-gray-100 bg-white p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-pink-600">
          Your Opinion
        </p>
        <h3 className="text-2xl font-bold tracking-tight text-gray-950">
          Write a Customer Review
        </h3>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-gray-500">
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="h-12 w-full border border-gray-200 bg-white px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-100"
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-gray-500">
              Comment
            </label>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full resize-none border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-100"
              placeholder="Describe your experience with this beauty item..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 w-full items-center justify-center bg-gray-950 px-8 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewSection;
