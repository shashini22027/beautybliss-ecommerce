import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, CreditCard, Shield } from 'lucide-react';

const AboutPage = () => {
  return (
    <main className="bg-white">
      {/* Header Banner */}
      <section className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-r from-rose-200 to-pink-200">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85)',
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-lg">
            About us
          </h1>
        </div>
      </section>

      {/* About BeautyBliss Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="rounded-xl overflow-hidden shadow-lg h-96">
            <img
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=85"
              alt="BeautyBliss"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Content */}
          <div>
            <p className="text-rose-600 font-bold uppercase tracking-widest text-sm mb-4">
              Enhancing Beauty, Elevating Confidence
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
              About BeautyBliss
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Confidence begins with self-care, and we're here to help you shine.
            </p>
            <p className="text-stone-700 leading-relaxed mb-6">
              BeautyBliss is your ultimate destination for premium beauty and personal care products. As a trusted e-commerce platform, we believe in the power of cosmetics and health products to enhance your natural beauty and well-being, boosting your confidence. Our business, offering a variety of high-quality, innovative beauty and health products, was launched with the vision of making premium beauty accessible to everyone.
            </p>
            <p className="text-stone-700 leading-relaxed mb-6">
              We understand that beauty is not just about looking good but also feeling good about yourself. That's why we are dedicated to providing a comprehensive range of cosmetics and health products that cater to diverse needs and preferences. Whether you're looking for skincare essentials, makeup, fragrances, or wellness products, we have curated a selection specifically chosen for quality and efficacy.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 hover:bg-rose-700 px-8 py-3 text-white font-bold transition"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
            Our Commitment
          </h2>
          <p className="text-stone-600 text-lg">
            Mission and Vision for a Better Tomorrow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Vision Card */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-3xl font-bold text-rose-700 mb-4 tracking-wide">VISION</h3>
            <p className="text-xl font-bold text-stone-900 mb-4">
              A World Where Beauty and Well-Being Thrive Together
            </p>
            <p className="text-stone-600 leading-relaxed">
              At BeautyBliss, our vision is to emerge as the premier destination for beauty enthusiasts in South Asia and beyond. We aspire to be acknowledged as a trusted brand, renowned for offering cutting-edge beauty and health products, delivering exceptional customer service, and providing a seamless online shopping experience. Our goal is to encourage and empower individuals to embrace their uniqueness and express themselves.
            </p>
          </div>

          {/* Mission Card */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-3xl font-bold text-rose-700 mb-4 tracking-wide">MISSION</h3>
            <p className="text-xl font-bold text-stone-900 mb-4">
              Empowering Confidence Through Advanced Skincare Solutions
            </p>
            <p className="text-stone-600 leading-relaxed">
              Our mission is to consistently deliver top-notch cosmetics and health products that meet the highest quality standards. We work tirelessly to source and curate an extensive collection of beauty products from renowned brands worldwide. By staying up-to-date with the latest trends and innovations, we aim to offer our customers access to the most sought-after products in the beauty and health industry. We are committed to providing an exceptional shopping experience.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
