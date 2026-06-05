import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PenTool } from "lucide-react";
import { blogPosts } from "../data/blogPosts";

const Blog = () => {
  // Set page title
  useEffect(() => {
    document.title = "BeautyBliss Blog – Insights & Trends";
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section
        className="relative h-[300px] bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/banner.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl font-extrabold md:text-5xl">Blog</h1>
          <nav className="mt-2 flex items-center gap-2 text-sm">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <span>Blog</span>
          </nav>
        </div>
      </section>

      {/* Featured Posts Carousel */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Featured Stories</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-xl border border-pink-200 bg-pink-50/30 backdrop-blur-sm transition-shadow hover:shadow-xl"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-800 group-hover:text-pink-600">
                  {post.title}
                </h3>
                <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                  {post.excerpt || post.title}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-pink-600"
                >
                  Read more <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* All Posts List */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">All Articles</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col rounded-xl border border-pink-200 bg-white/80 backdrop-blur-sm shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover rounded-t-xl"
              />
              <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-800 group-hover:text-pink-600">
                  {post.title}
                </h3>
                <p className="mb-3 text-sm text-gray-600 line-clamp-3">
                  {post.excerpt || post.title}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-pink-600"
                  >
                    Read more <PenTool size={14} />
                  </Link>
                  <span className="text-xs text-gray-500">{post.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Blog;
