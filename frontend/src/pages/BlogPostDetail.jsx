import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";

const BlogPostDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentPostsLoading, setRecentPostsLoading] = useState(true);
  const [recentPostsError, setRecentPostsError] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsLoadError, setCommentsLoadError] = useState("");
  const [commentSubmitError, setCommentSubmitError] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const commentsSectionRef = useRef(null);
  const commentTextareaRef = useRef(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  useEffect(() => {
    let isCurrent = true;

    const fetchRecentPosts = async () => {
      try {
        setRecentPostsLoading(true);
        setRecentPostsError("");
        const response = await fetch("/api/blogs");
        if (!response.ok) {
          throw new Error("Failed to load recent posts");
        }

        const posts = await response.json();
        if (!Array.isArray(posts)) {
          throw new Error("Recent posts response was invalid");
        }

        if (isCurrent) {
          setRecentPosts(
            posts
              .filter((recentPost) =>
                recentPost.slug !== slug && String(recentPost._id) !== slug
              )
              .slice(0, 5)
          );
        }
      } catch (err) {
        if (isCurrent) {
          setRecentPostsError(err.message || "Failed to load recent posts");
        }
      } finally {
        if (isCurrent) {
          setRecentPostsLoading(false);
        }
      }
    };

    fetchRecentPosts();
    return () => {
      isCurrent = false;
    };
  }, [slug]);

  useEffect(() => {
    if (loading || !post || location.hash !== "#comments") return undefined;

    const timeout = window.setTimeout(() => {
      commentsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      commentTextareaRef.current?.focus({ preventScroll: true });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loading, location.hash, post]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      setPost(null);
      setComments([]);
      setCommentCount(0);
      setCommentsLoading(true);
      setCommentsLoadError("");
      setCommentSubmitError("");
      const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Post not found");
        throw new Error("Failed to load blog post");
      }
      const data = await res.json();
      setPost(data);
      document.title = `${data.title} – BeautyBliss Blog`;
      try {
        const commentsResponse = await fetch(
          `/api/blogs/${encodeURIComponent(slug)}/comments`
        );
        const commentsData = await commentsResponse.json();
        if (!commentsResponse.ok) {
          throw new Error(commentsData.message || "Failed to load comments");
        }
        setComments(commentsData.comments);
        setCommentCount(commentsData.totalCount);
      } catch (commentsFetchError) {
        setCommentsLoadError(commentsFetchError.message || "Failed to load comments");
      } finally {
        setCommentsLoading(false);
      }
    } catch (err) {
      setError(err.message);
      document.title = "Blog Not Found – BeautyBliss";
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (event) => {
    event.preventDefault();
    setCommentSubmitError("");

    try {
      setSubmittingComment(true);
      const response = await fetch(
        `/api/blogs/${encodeURIComponent(slug)}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: commentName, comment: commentText }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to post comment");
      }

      setComments((current) => [...current, data.comment]);
      setCommentCount(data.commentCount);
      setCommentText("");
    } catch (err) {
      setCommentSubmitError(err.message || "Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const fallbackImage = "/images/banner.jpg";
  const getPostPath = (blog) =>
    `/blog/${encodeURIComponent(blog.slug || blog._id)}`;
  const blogContentSections = (post?.description || "Content coming soon...")
    .split(/(?=Step\s+\d+:|Tips for Maximum Results|Final Thoughts)/i)
    .map((section) => section.trim())
    .filter(Boolean);

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
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 lg:grid-cols-[minmax(0,1fr)_345px] lg:gap-16">
        <div className="min-w-0">
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
          <div className="mt-8 space-y-5 rounded-2xl border border-pink-100 bg-[#fff9fb] p-6 text-base leading-8 text-black shadow-sm sm:p-8">
            {blogContentSections.map((section, index) => {
              const headingMatch = section.match(
                /^(Step\s+\d+:|Tips for Maximum Results|Final Thoughts)\s*/i
              );

              return (
                <p key={`${index}-${section.slice(0, 24)}`} className="whitespace-pre-wrap">
                  {headingMatch && (
                    <span className="mr-2 inline-block rounded bg-pink-100 px-2 py-0.5 font-bold leading-6 text-black decoration-pink-300 underline decoration-2 underline-offset-4">
                      {headingMatch[1]}
                    </span>
                  )}
                  <span className="text-black">
                    {headingMatch
                      ? section.slice(headingMatch[0].length)
                      : section}
                  </span>
                </p>
              );
            })}
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

        <section
          id="comments"
          ref={commentsSectionRef}
          className="mt-16 scroll-mt-28 border-t border-gray-200 pt-10"
        >
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <MessageSquare size={22} />
            Comments ({commentCount})
          </h2>

          <div className="mt-6 space-y-5">
            {commentsLoading ? (
              <p className="text-sm text-gray-500">Loading comments...</p>
            ) : commentsLoadError ? (
              <p role="alert" className="text-sm text-red-600">
                {commentsLoadError}
              </p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-gray-500">Be the first to comment.</p>
            ) : (
              comments.map((comment) => (
                <article
                  key={comment._id}
                  className="border-b border-gray-100 pb-5 last:border-0"
                >
                  <p className="font-semibold text-gray-900">
                    {comment.name}
                    <span className="ml-3 text-xs font-normal text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-gray-600">
                    {comment.comment}
                  </p>
                </article>
              ))
            )}
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-900">Leave a Reply</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your email address will not be published.
            </p>
            <form onSubmit={submitComment} className="mt-5 space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
                <input
                  type="text"
                  value={commentName}
                  onChange={(event) => setCommentName(event.target.value)}
                  maxLength={60}
                  required
                  className="mt-2 w-full rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
                  placeholder="Your name"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Comment
                <textarea
                  ref={commentTextareaRef}
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  maxLength={1000}
                  required
                  rows={5}
                  className="mt-2 w-full resize-y rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
                  placeholder="Write your comment..."
                />
              </label>
              {commentSubmitError && (
                <p role="alert" className="text-sm text-red-600">
                  {commentSubmitError}
                </p>
              )}
              <button
                type="submit"
                disabled={submittingComment || commentsLoading}
                className="rounded-md bg-gray-900 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submittingComment ? "Posting..." : "Post Comment"}
              </button>
            </form>
          </div>
        </section>
        </div>

        <aside className="h-fit border-t border-gray-200 pt-8 lg:border-t-0 lg:pt-0">
          <h2 className="border-b border-gray-200 pb-4 text-xl font-semibold uppercase text-[#1c2c39]">
            Recent Posts
          </h2>
          {recentPostsLoading ? (
            <div className="mt-5 space-y-5" aria-label="Loading recent posts">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-5">
                  <div className="h-20 w-24 shrink-0 animate-pulse rounded-xl bg-gray-100" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentPostsError ? (
            <p role="alert" className="mt-5 text-sm text-red-600">
              {recentPostsError}
            </p>
          ) : recentPosts.length === 0 ? (
            <p className="mt-5 text-sm text-gray-500">No other posts yet.</p>
          ) : (
            <div className="mt-5">
              {recentPosts.map((recentPost) => {
                const commentLabel = recentPost.commentCount === 1
                  ? "1 Comment"
                  : `${recentPost.commentCount || 0} Comments`;

                return (
                  <article
                    key={recentPost._id}
                    className="border-b border-gray-200 py-5 first:pt-0 last:border-b-0"
                  >
                    <Link
                      to={getPostPath(recentPost)}
                      className="group flex items-start gap-5"
                    >
                      <img
                        src={recentPost.image || fallbackImage}
                        alt=""
                        onError={(event) => {
                          event.currentTarget.src = fallbackImage;
                        }}
                        className="h-20 w-24 shrink-0 rounded-xl object-cover"
                        loading="lazy"
                      />
                      <span className="min-w-0">
                        <span className="block text-base font-semibold leading-6 text-[#1c2c39] transition-colors group-hover:text-pink-600">
                          {recentPost.title}
                        </span>
                        <span className="mt-3 block text-sm text-gray-400">
                          {new Date(recentPost.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                          <span className="mx-2">·</span>
                          {commentLabel}
                        </span>
                      </span>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </aside>
      </section>
    </main>
  );
};

export default BlogPostDetail;
