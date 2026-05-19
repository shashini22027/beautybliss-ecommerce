import React from 'react';

const ErrorPage = () => {
  return (
    <div className="text-center py-32 space-y-4">
      <h1 className="text-6xl font-serif font-bold text-primary-700">404</h1>
      <h2 className="text-2xl font-serif text-stone-850 font-semibold">Page Not Found</h2>
      <p className="text-stone-500 text-sm max-w-sm mx-auto">The beauty page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <a href="/" className="inline-block bg-stone-900 hover:bg-stone-950 text-white font-semibold px-8 py-2.5 rounded-full text-xs uppercase tracking-wider transition mt-4">Go to Homepage</a>
    </div>
  );
};

export default ErrorPage;
