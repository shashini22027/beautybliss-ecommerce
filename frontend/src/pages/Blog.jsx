import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Share2, User } from "lucide-react";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";

const categoryFor = (post) => {
  if (post.category && post.category !== 'Beauty') return post.category;
  const text = `${post.title || ''} ${post.excerpt || ''}`.toLowerCase();
  if (/ingredient|retinol|niacinamide|vitamin c/.test(text)) return 'Ingredients';
  if (/tutorial|step.by.step|how to|guide/.test(text)) return 'Tutorials';
  if (/makeup|foundation|lipstick|shade|mascara/.test(text)) return 'Makeup';
  if (/skin|skincare|cleanser|moistur|spf|acne/.test(text)) return 'Skincare';
  return 'Beauty';
};

const readingMinutes = (post) => Math.max(1, Math.ceil(`${post.title || ''} ${post.excerpt || ''} ${post.description || ''}`.trim().split(/\s+/).length / 200));

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
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

  const getBlogUrl = (post) =>
    `${window.location.origin}/blog/${encodeURIComponent(post.slug || post._id)}`;
  const getBlogPath = (post) => `/blog/${encodeURIComponent(post.slug || post._id)}`;

  const fallbackImage = "/images/banner.jpg";
  const categories = useMemo(() => ['All', ...new Set(blogs.map(categoryFor))], [blogs]);
  const visibleBlogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return blogs.filter((post) => {
      const searchable = `${post.title || ''} ${post.excerpt || ''} ${post.description || ''} ${post.author || ''} ${categoryFor(post)}`.toLowerCase();
      return (activeCategory === 'All' || categoryFor(post) === activeCategory) && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [activeCategory, blogs, query]);

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
          <h1 className="text-6xl font-bold uppercase tracking-tight md:text-7xl">
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

            <div className="mb-8 space-y-4">
              <label className="block max-w-xl text-sm font-medium text-gray-700">Search articles
                <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skincare, ingredients, makeup…" className="mt-2 w-full rounded border border-gray-300 px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100" />
              </label>
              <div className="flex flex-wrap gap-2" aria-label="Filter articles by category">
                {categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`rounded-full border px-4 py-2 text-sm transition ${activeCategory === category ? 'border-[#9f234f] bg-[#9f234f] text-white' : 'border-gray-300 text-gray-700 hover:border-[#9f234f]'}`}>{category}</button>)}
              </div>
            </div>

            {visibleBlogs.length === 0 ? <p className="rounded-lg border border-gray-200 p-8 text-center text-gray-600">No articles match your search. Try another term or category.</p> :

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {visibleBlogs.map((post) => (
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
                      loading="lazy"
                      decoding="async"
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
                        {categoryFor(post)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col items-center p-8 pt-10 text-center">
                    <Link to={getBlogPath(post)}>
                      <h3 className="mb-4 text-2xl font-medium text-[#1c2c39] hover:text-pink-600 transition-colors leading-tight">
                        {post.title}
                      </h3>
                    </Link>

                    <div className="relative mb-5 flex items-center justify-center gap-4 text-sm text-gray-400">
                      <span className="inline-flex items-center gap-2">
                        By <User size={18} className="fill-gray-300 text-gray-300" />
                        <span className="text-gray-500">{post.author || 'BeautyBliss Editorial'}</span>
                      </span>
                      <span className="whitespace-nowrap">{readingMinutes(post)} min read</span>
                      <Link
                        to={`${getBlogPath(post)}#comments`}
                        className="relative inline-flex items-center gap-1.5 text-gray-500 transition hover:text-pink-600"
                        aria-label={`${post.commentCount || 0} comments on ${post.title}`}
                      >
                        <MessageSquare size={19} />
                        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-300 px-1 text-[10px] font-bold leading-none text-white">
                          {post.commentCount || 0}
                        </span>
                      </Link>
                      <div className="blog-share-control relative flex items-center gap-2">
                        <Share2 size={19} aria-hidden="true" className="text-gray-400" />
                        <span className="sr-only">Share {post.title}</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getBlogUrl(post))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Share ${post.title} on Facebook`}
                            className="blog-share-link inline-flex h-7 w-7 items-center justify-center rounded-full text-[#1877F2] transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                          >
                            <FaFacebookF aria-hidden="true" size={16} />
                          </a>
                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} ${getBlogUrl(post)}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Share ${post.title} on WhatsApp`}
                            className="blog-share-link inline-flex h-7 w-7 items-center justify-center rounded-full text-[#25D366] transition hover:bg-green-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                          >
                            <FaWhatsapp aria-hidden="true" size={18} />
                          </a>
                        </div>
                      </div>
                    </div>

                    <p className="mb-6 text-[15px] leading-relaxed text-gray-500 line-clamp-3">
                      {post.excerpt || post.title}
                    </p>

                    <div className="mt-auto">
                      <Link
                        to={getBlogPath(post)}
                        className="text-sm font-bold uppercase tracking-widest text-black hover:text-pink-600 transition-colors"
                      >
                        Continue Reading
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            }
          </section>
        </>
      )}
    </main>
  );
};

export default Blog;
