import React, { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import api from '../services/api';

const fallbackTestimonials = [
  {
    name: 'Raajiya Jazeel',
    handle: '@raaji_jazeel',
    rating: 5,
    text: "Absolutely love this product! I've been using this rosemary oil for 2 months now, and my hair fall and dryness have reduced. Thank you so much!",
  },
  {
    name: 'Janani Rajakaruna',
    handle: '@janai_rakjakaruna',
    rating: 5,
    text: "Got my order super fast, and the delivery was smooth! The products are so cute, and I love them. Totally worth the price - can't wait to get more!",
  },
  {
    name: 'Isuri Sewwandi',
    handle: '@isu_desilva',
    rating: 5,
    text: 'The products are real, and the price is really good for the quality! Hard to find such a great deal. Highly recommend!',
  },
];

const reviewsPerPage = 3;
const pageCount = 2;

const Testimonials = () => {
  const [customerReviews, setCustomerReviews] = useState([]);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadCustomerReviews = async () => {
      try {
        const { data } = await api.get('/products');
        const products = Array.isArray(data) ? data : [];
        const reviews = products
          .flatMap((product) =>
            (product.reviews || []).map((review) => ({
              name: review.name || 'BeautyBliss Customer',
              handle: product.name ? `Reviewed ${product.name}` : '@beautybliss_customer',
              rating: Number(review.rating || 5),
              text: review.comment || '',
              createdAt: review.createdAt,
            }))
          )
          .filter((review) => review.text)
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        if (isMounted) {
          setCustomerReviews(reviews);
        }
      } catch (error) {
        console.error('Failed to load testimonials', error);
      }
    };

    loadCustomerReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const testimonialPages = useMemo(() => {
    const testimonials = [...customerReviews, ...fallbackTestimonials].slice(
      0,
      reviewsPerPage * pageCount
    );

    return Array.from({ length: pageCount }, (_, pageIndex) => {
      const start = pageIndex * reviewsPerPage;
      const page = testimonials.slice(start, start + reviewsPerPage);
      return page.length === reviewsPerPage
        ? page
        : [...page, ...fallbackTestimonials].slice(0, reviewsPerPage);
    });
  }, [customerReviews]);

  const visibleTestimonials = testimonialPages[activePage] || testimonialPages[0];

  return (
    <section className="mx-auto max-w-[1540px] px-6 py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-2 text-3xl font-extrabold uppercase tracking-tight text-gray-950 md:text-4xl">
          Customer Testimonials
        </h2>
        <p className="text-sm text-gray-600">
          What our happy customers are saying about us
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {visibleTestimonials.map((testimonial, index) => (
          <div
            key={`${testimonial.name}-${testimonial.text}-${index}`}
            className="border border-gray-200 bg-white p-8 shadow-[0_1px_10px_rgba(0,0,0,0.08)] transition hover:border-gray-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
          >
            <div className="mb-4 flex gap-1">
              {[...Array(Math.min(Math.max(testimonial.rating, 1), 5))].map((_, i) => (
                <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            <p className="mb-6 text-sm italic leading-7 text-gray-600">
              "{testimonial.text}"
            </p>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-extrabold text-gray-950">{testimonial.name}</h4>
              <p className="text-xs font-bold text-pink-600">{testimonial.handle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        {Array.from({ length: pageCount }, (_, page) => (
          <button
            key={page}
            type="button"
            onClick={() => setActivePage(page)}
            className={`h-3 w-3 rounded-full transition ${
              activePage === page
                ? 'bg-gray-700'
                : 'border-2 border-gray-300 bg-white hover:border-gray-500'
            }`}
            aria-label={`View testimonial page ${page + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
