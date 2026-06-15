import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PenTool } from "lucide-react";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Beauty Blog | BeautyBliss";
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs");
      if (!res.ok) throw new Error("Failed to load blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fallbackImage = "/images/banner.jpg";

  return (
    <main className="min-h-screen bg-white">
      <section className="relative min-h-[420px] overflow-hidden">
        <img
          src="/images/banner.jpg"
          alt="Beauty Blog"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1540px] flex-col items-center justify-center px-6 py-16 text-white">
          <h1 className="text-6xl font-bold tracking-tight md:text-7xl uppercase">
            Blog
          </h1>
        </div>
      </section>

      {loading ? (
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[360px] animate-pulse rounded-xl bg-gray-100"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-red-600">
          <p>{error}</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800">No Articles Found</h2>
          <p className="mt-4 text-gray-500">Check back later for new beauty tips and stories!</p>
        </div>
      ) : (
        <>
          {/* All Posts */}
          <section className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Articles
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((post) => (
                <article
                  key={post._id}
                  className="group flex flex-col rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg overflow-hidden border border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={post.image || fallbackImage}
                      alt={post.title}
                      onError={(e) => { e.target.src = fallbackImage }}
                      className="h-64 w-full object-cover"
                    />
                    
                    {/* Date Badge */}
                    <div className="absolute left-4 top-4 flex flex-col items-center justify-center rounded-lg bg-white px-3 py-2 shadow-md">
                      <span className="text-xl font-bold leading-none text-gray-900">
                        {new Date(post.date).getDate()}
                      </span>
                      <span className="text-xs font-semibold uppercase text-gray-600 mt-1">
                        {new Date(post.date).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>

                    {/* Category Overlay */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-black px-4 py-1.5 shadow-lg">
                      <span className="text-xs font-bold tracking-widest text-white uppercase">
                        BEAUTY & SKINCARE
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col items-center p-8 pt-10 text-center">
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="mb-4 text-2xl font-medium text-[#1c2c39] hover:text-pink-600 transition-colors leading-tight">
                        {post.title}
                      </h3>
                    </Link>



                    <p className="mb-6 text-[15px] leading-relaxed text-gray-500 line-clamp-3">
                      {post.excerpt || post.title}
                    </p>

                    <div className="mt-auto">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-sm font-bold uppercase tracking-widest text-black hover:text-pink-600 transition-colors"
                      >
                        Continue Reading
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Blog;