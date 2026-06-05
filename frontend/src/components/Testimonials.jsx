import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
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
      text: "Got my order super fast, and the delivery was smooth! The products are so cute, and I love them. Totally worth the price—can't wait to get more!",
    },
    {
      name: 'Isuri Sewwandi',
      handle: '@isu_desilva',
      rating: 5,
      text: 'The products are real, and the price is really good for the quality! Hard to find such a great deal. Highly recommend! 💯',
    },
  ];

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
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="border border-gray-200 bg-white p-8 shadow-[0_1px_10px_rgba(0,0,0,0.08)] transition hover:border-gray-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
          >
            {/* Rating Stars */}
            <div className="mb-4 flex gap-1">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="mb-6 text-sm italic leading-7 text-gray-600">
              "{testimonial.text}"
            </p>

            {/* User Info */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-extrabold text-gray-950">{testimonial.name}</h4>
              <p className="text-xs font-bold text-pink-600">{testimonial.handle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
