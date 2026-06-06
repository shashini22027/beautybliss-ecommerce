import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PenTool } from "lucide-react";
import { blogPosts } from "../data/blogPosts";

const Blog = () => {
  useEffect(() => {
    document.title = "Beauty Blog | BeautyBliss";
  }, []);

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

      {/* Featured Posts */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Featured Articles
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-xl border border-pink-200 bg-pink-50/30 backdrop-blur-sm transition-shadow hover:shadow-xl"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                  Read more
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* All Posts */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          All Articles
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col rounded-xl border border-pink-200 bg-white/80 backdrop-blur-sm shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full rounded-t-xl object-cover"
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
                    Read more
                    <PenTool size={14} />
                  </Link>

                  <span className="text-xs text-gray-500">
                    {post.date || "No date"}
                  </span>
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