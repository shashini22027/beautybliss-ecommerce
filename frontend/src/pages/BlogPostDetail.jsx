import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { blogPosts } from "../data/blogPosts";

const BlogPostDetail = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  // Set page title dynamically based on post
  useEffect(() => {
    if (post) {
      document.title = `${post.title} – BeautyBliss Blog`;
    } else {
      document.title = "Blog – BeautyBliss";
    }
  }, [post]);

  if (!post) {
    return (
      <main className="min-h-screen bg-white p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Post not found</h2>
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
        className="relative h-[300px] bg-cover bg-center"
        style={{ backgroundImage: `url(${post.image})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl font-extrabold md:text-5xl">{post.title}</h1>
          <nav className="mt-2 flex items-center gap-2 text-sm">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:underline">Blog</Link>
            <span>/</span>
            <span>{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <article className="prose prose-lg max-w-none">
          <p className="text-sm text-gray-500 mb-4">{post.date}</p>
          {/* Render full description if available, otherwise fallback to excerpt */}
          <div
            dangerouslySetInnerHTML={{
              __html: post.description || post.excerpt || "Content coming soon...",
            }}
          />
        </article>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-1 text-pink-600 hover:underline"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </section>
    </main>
  );
};

export default BlogPostDetail;
