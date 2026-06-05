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
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-2">
          Customer Testimonials
        </h2>
        <p className="text-stone-600 text-sm">
          What our happy customers are saying about us
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="p-8 rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50 hover:shadow-lg transition-shadow"
          >
            {/* Rating Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-stone-700 mb-6 text-sm leading-relaxed italic">
              "{testimonial.text}"
            </p>

            {/* User Info */}
            <div className="border-t border-rose-100 pt-4">
              <h4 className="font-bold text-stone-900">{testimonial.name}</h4>
              <p className="text-xs text-rose-600">{testimonial.handle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
