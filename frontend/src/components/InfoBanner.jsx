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
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-4 p-6 rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50 hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                  <Icon className="h-6 w-6 text-rose-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">{feature.title}</h3>
                <p className="text-sm text-stone-600 mt-1">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default InfoBanner;


