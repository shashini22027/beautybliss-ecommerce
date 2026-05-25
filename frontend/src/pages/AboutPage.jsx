import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShieldCheck, Sparkles, Users } from 'lucide-react';

const values = [
  {
    icon: Sparkles,
    title: 'Curated for every glow',
    description: 'BeautyBliss brings makeup, skincare, and fragrance together in a shopping flow that feels simple and personal.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality-first catalog',
    description: 'Products are organized by category, searchable by need, and easy to compare before adding to cart.',
  },
  {
    icon: Heart,
    title: 'Wishlist-led discovery',
    description: 'Save favorites while browsing, then come back when you are ready to complete the look.',
  },
];

const AboutPage = () => {
  return (
    <main className="bg-white">
      <section className="border-b border-stone-200 bg-stone-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-pink-700">
              <Users size={16} />
              About BeautyBliss
            </div>
            <h1 className="text-4xl font-bold leading-tight text-stone-950 sm:text-5xl">
              A calmer way to shop beauty essentials.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">
              BeautyBliss is built around the way customers actually browse: discover by collection, search directly, save favorites, and move from cart to checkout without friction.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:bg-pink-800"
              >
                Start shopping
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/offers"
                className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-bold text-stone-700 transition hover:border-pink-200 hover:text-pink-700"
              >
                View offers
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-4xl font-bold text-pink-700">01</p>
              <h2 className="mt-4 text-xl font-bold text-stone-950">Browse</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Explore all products or open a category from collections.</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:mt-8">
              <p className="text-4xl font-bold text-pink-700">02</p>
              <h2 className="mt-4 text-xl font-bold text-stone-950">Save</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Use the wishlist to keep track of products you love.</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-4xl font-bold text-pink-700">03</p>
              <h2 className="mt-4 text-xl font-bold text-stone-950">Checkout</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Review the cart, place the order, and track it from your account.</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:mt-8">
              <p className="text-4xl font-bold text-pink-700">04</p>
              <h2 className="mt-4 text-xl font-bold text-stone-950">Return</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Come back through search, offers, and saved favorites anytime.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <Icon className="text-pink-700" size={26} />
              <h2 className="mt-4 text-lg font-bold text-stone-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
