import { useRef, useState } from 'react';
import { ImagePlus, Star, Trash2, Video } from 'lucide-react';
import API from '../services/api';
import { getImageUrl } from '../utils/image';

const MAX_MEDIA_FILES = 5;
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ReviewSection = ({ product, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [media, setMedia] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const imageInput = useRef(null);
  const videoInput = useRef(null);
  const reviews = product?.reviews || [];

  const addMedia = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = '';

    if (media.length + selectedFiles.length > MAX_MEDIA_FILES) {
      setMessage({ type: 'error', text: `You can attach up to ${MAX_MEDIA_FILES} files.` });
      return;
    }

    const invalidFile = selectedFiles.find((file) => file.size > MAX_FILE_SIZE);
    if (invalidFile) {
      setMessage({ type: 'error', text: 'Each photo or video must be 20 MB or smaller.' });
      return;
    }

    setMedia((currentMedia) => [...currentMedia, ...selectedFiles]);
    setMessage(null);
  };

  const clearForm = () => {
    setRating(0);
    setComment('');
    setName('');
    setEmail('');
    setMedia([]);
    setMessage(null);
  };

  const submitReview = async (event) => {
    event.preventDefault();
    if (!rating) {
      setMessage({ type: 'error', text: 'Please choose a star rating.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    const reviewData = {
      rating,
      comment,
      name,
      email,
    };

    try {
      let submission = reviewData;
      if (media.length) {
        const formData = new FormData();
        Object.entries(reviewData).forEach(([key, value]) => formData.append(key, String(value)));
        media.forEach((file) => formData.append('media', file));
        submission = formData;
      }

      await API.post(`/products/${product._id}/reviews`, submission);
      clearForm();
      setMessage({ type: 'success', text: 'Thank you! Your review has been posted.' });
      await onReviewAdded?.();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Your review could not be submitted. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-10">
      {reviews.length > 0 && (
        <div className="space-y-5">
          <h3 className="text-xl font-semibold text-gray-900">Customer Reviews</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review, index) => (
              <article key={review._id || `${review.name}-${index}`} className="rounded-lg border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    {review.createdAt && (
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0" aria-label={`${review.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-700">{review.comment}</p>
                {review.media?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {review.media.map((item, mediaIndex) => (
                      item.type === 'video' ? (
                        <video
                          key={`${item.url}-${mediaIndex}`}
                          className="max-h-56 max-w-full rounded-md"
                          controls
                          preload="metadata"
                          src={getImageUrl(item.url)}
                        />
                      ) : (
                        <a
                          key={`${item.url}-${mediaIndex}`}
                          href={getImageUrl(item.url)}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`View photo uploaded by ${review.name}`}
                        >
                          <img
                            className="h-24 w-24 rounded-md object-cover"
                            src={getImageUrl(item.url)}
                            alt={`Review from ${review.name}`}
                            loading="lazy"
                          />
                        </a>
                      )
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={submitReview} className="mx-auto w-full max-w-md space-y-5">
        <div>
          <div className="flex items-center gap-2" role="group" aria-label="Choose a rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
                aria-pressed={rating === star}
                className="rounded-sm p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                <Star
                  size={29}
                  strokeWidth={1.5}
                  className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                />
              </button>
            ))}
            <span className="ml-1 text-sm font-medium text-gray-600">{rating}/5</span>
          </div>
          <label htmlFor="product-review" className="mt-4 block text-sm font-medium text-gray-700">
            Write a review
          </label>
          <textarea
            id="product-review"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={5000}
            required
            rows={6}
            placeholder="Share your thoughts about this product..."
            className="mt-2 w-full resize-y rounded-md border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="review-name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="review-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              autoComplete="name"
              required
              className="mt-2 h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
          <div>
            <label htmlFor="review-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="review-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              autoComplete="email"
              required
              className="mt-2 h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="mr-1 text-sm font-medium text-gray-700">Add photos or video</span>
            <input
              ref={imageInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={addMedia}
              className="hidden"
              aria-label="Choose photos"
            />
            <input
              ref={videoInput}
              type="file"
              accept="video/mp4,video/webm"
              multiple
              onChange={addMedia}
              className="hidden"
              aria-label="Choose videos"
            />
            <button
              type="button"
              onClick={() => imageInput.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 px-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              <ImagePlus size={17} /> Photo
            </button>
            <button
              type="button"
              onClick={() => videoInput.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 px-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Video size={17} /> Video
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">Up to 5 files; JPG, PNG, WebP, MP4 or WebM (20 MB each).</p>
          {media.length > 0 && (
            <ul className="mt-3 space-y-2">
              {media.map((file, index) => (
                <li key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center justify-between gap-3 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setMedia((currentMedia) => currentMedia.filter((_, fileIndex) => fileIndex !== index))}
                    className="shrink-0 rounded p-1 text-gray-500 hover:text-red-600"
                    aria-label={`Remove ${file.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {message && (
          <p
            role="status"
            className={`text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-700'}`}
          >
            {message.text}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="h-10 w-full border border-gray-950 bg-gray-950 px-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-pink-600 hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={clearForm}
            disabled={submitting}
            className="h-10 w-full border border-gray-300 bg-white px-4 text-sm font-semibold uppercase text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default ReviewSection;
