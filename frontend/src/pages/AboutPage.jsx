import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, CreditCard, Shield } from 'lucide-react';

const AboutPage = () => {
  return (
    <main className="bg-white">
      {/* Header Banner */}
      <section className="relative min-h-[420px] overflow-hidden">
        <img
          src="/images/banner.jpg"
          alt="About Us"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1540px] flex-col items-center justify-center px-6 py-16 text-white">
          <h1 className="text-6xl font-bold tracking-tight md:text-7xl">
            About us
          </h1>
        </div>
      </section>

      {/* About BeautyBliss Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="overflow-hidden h-96 border border-gray-200">
            <img
              src="/images/banner.jpg"
              alt="BeautyBliss beauty collection"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Content */}
          <div>
            <p className="text-rose-600 font-bold uppercase tracking-widest text-sm mb-4">
              Enhancing Beauty, Elevating Confidence
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6">
              About BeautyBliss
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Confidence begins with self-care, and we're here to help you shine.
            </p>
            <p className="text-stone-700 leading-relaxed mb-6">
              BeautyBliss beauty care brings skincare, lip care, nourishing oils, makeup, and personal care essentials together in one clean shopping experience. Our store is built around quality, accessibility, and everyday confidence.
            </p>
            <p className="text-stone-700 leading-relaxed mb-6">
              We understand that beauty is not just about looking good but also feeling good about yourself. Whether you're shopping for skincare essentials, makeup, fragrances, or wellness products, every collection is curated for practical routines and visible care.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-[#2b2b2b] hover:bg-pink-600 px-8 py-3 text-white font-bold uppercase tracking-[0.14em] transition"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-4">
            Our Commitment
          </h2>
          <p className="text-stone-600 text-lg">
            Mission and Vision for a Better Tomorrow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Vision Card */}
          <div className="flex flex-col items-center border border-gray-200 px-8 py-10 text-center">
            <h3 className="text-3xl font-bold text-pink-600 mb-4 tracking-wide">VISION</h3>
            <p className="text-xl font-bold text-stone-900 mb-4">
              A World Where Beauty and Well-Being Thrive Together
            </p>
            <p className="text-stone-600 leading-relaxed">
              At BeautyBliss, our vision is to emerge as the premier destination for beauty enthusiasts in South Asia and beyond. We aspire to be acknowledged as a trusted brand, renowned for offering cutting-edge beauty and health products, delivering exceptional customer service, and providing a seamless online shopping experience. Our goal is to encourage and empower individuals to embrace their uniqueness and express themselves.
            </p>
          </div>

          {/* Mission Card */}
          <div className="flex flex-col items-center border border-gray-200 px-8 py-10 text-center">
            <h3 className="text-3xl font-bold text-pink-600 mb-4 tracking-wide">MISSION</h3>
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
