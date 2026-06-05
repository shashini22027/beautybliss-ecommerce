import React from 'react';
import { Truck, CreditCard, Shield } from 'lucide-react';

const InfoBanner = () => {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free delivery for orders above Rs. 1,800.00',
    },
    {
      icon: CreditCard,
      title: 'COD & Secure Payments',
      description: 'Pay with Cash on Delivery or secure online payments',
    },
    {
      icon: Shield,
      title: '100% Genuine Products',
      description: 'Authentic, high-quality products you can trust',
    },
  ];

  return (
    <section className="mx-auto max-w-[1540px] px-6 py-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-4 border border-gray-200 bg-white p-6 shadow-[0_1px_10px_rgba(0,0,0,0.08)] transition hover:border-gray-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
            >
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center bg-[#f2f2f2]">
                  <Icon className="h-6 w-6 text-gray-950" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-950">{feature.title}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-500">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default InfoBanner;


