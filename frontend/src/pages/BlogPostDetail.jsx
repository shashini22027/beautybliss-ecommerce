import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BlogPostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blogs/${slug}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Post not found");
        throw new Error("Failed to load blog post");
      }
      const data = await res.json();
      setPost(data);
      document.title = `${data.title} – BeautyBliss Blog`;
    } catch (err) {
      setError(err.message);
      document.title = "Blog Not Found – BeautyBliss";
    } finally {
      setLoading(false);
    }
  };

  const fallbackImage = "/images/banner.jpg";

  if (loading) {
    return (
      <main className="min-h-screen bg-white p-8">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="mb-8 h-[300px] rounded-xl bg-gray-100"></div>
          <div className="mb-4 h-8 w-3/4 rounded bg-gray-100"></div>
          <div className="mb-8 h-4 w-1/4 rounded bg-gray-100"></div>
          <div className="space-y-3">
            <div className="h-4 rounded bg-gray-100"></div>
            <div className="h-4 rounded bg-gray-100"></div>
            <div className="h-4 w-5/6 rounded bg-gray-100"></div>
            <div className="h-4 w-4/6 rounded bg-gray-100"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-white p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">{error || "Post not found"}</h2>
        <Link to="/blog" className="mt-4 inline-block text-pink-600 hover:underline">
          ← Back to Blog
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center"
      >
        <img 
          src={post.image || fallbackImage} 
          alt={post.title}
          onError={(e) => { e.target.src = fallbackImage }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl font-extrabold md:text-5xl max-w-4xl">{post.title}</h1>
          <nav className="mt-4 flex items-center gap-2 text-sm font-medium">
            <Link to="/" className="hover:text-pink-300 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-pink-300 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-pink-200">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <article className="prose prose-lg prose-pink max-w-none">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h2>
          {post.excerpt && (
            <h3 className="mb-8 text-xl font-medium text-gray-600 leading-relaxed">
              {post.excerpt}
            </h3>
          )}
          <p className="text-sm font-medium text-gray-400 mb-8 pb-4 border-b border-gray-100 flex items-center gap-4">
            <span>By BeautyBliss</span>
            <span>•</span>
            <span>{new Date(post.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mt-8">
            {post.description || "Content coming soon..."}
          </div>
        </article>
        
        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors"
          >
            <ArrowLeft size={18} /> Back to all articles
          </Link>
        </div>
      </section>
    </main>
  );
};

export default BlogPostDetail;
