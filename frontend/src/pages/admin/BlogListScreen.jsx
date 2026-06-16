import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus, AlertCircle } from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";

const BlogListScreen = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs");
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const token = JSON.parse(localStorage.getItem("userInfo")).token;
        const res = await fetch(`/api/blogs/id/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to delete blog post");
        fetchBlogs();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
        <img
          src="/images/admin_banner.png"
          alt="Beauty products arranged for blog management"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1460px] flex-col items-center justify-center px-6 text-center text-white sm:min-h-[320px]">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Blogs
          </h1>
          <div className="mt-6 flex items-center gap-3 text-lg font-medium">
            <Link to="/" className="text-white/85 transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/admin-dashboard"
              className="text-white/85 transition hover:text-white"
            >
              Admin dashboard
            </Link>
            <span>/</span>
            <span className="font-bold">Blogs</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1460px] px-6 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[315px_1fr]">
          <AdminSidebar />

          <section className="lg:pl-1">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-lg leading-8 text-gray-600">
                  Create, edit, and manage blog posts on the platform.
                </p>
              </div>
              <Link
                to="/admin/blog/create"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-[#2b2b2b] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-black focus:outline-none sm:w-auto"
              >
                <Plus size={16} />
                Create Blog Post
              </Link>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2b2b2b]"></div>
              </div>
            ) : error ? (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error loading blogs</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#f2f2f2]">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">
                          Image
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-900">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {blogs.map((blog) => (
                        <tr key={blog._id} className="transition hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {blog._id.substring(0, 8)}...
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="h-12 w-20 overflow-hidden bg-gray-100">
                              <img src={blog.image} alt={blog.title} className="h-full w-full object-cover" />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            <p className="line-clamp-2 max-w-xs">{blog.title}</p>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {new Date(blog.date).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-3">
                              <Link
                                to={`/admin/blog/${blog._id}/edit`}
                                className="flex h-8 w-8 items-center justify-center border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                              >
                                <Edit size={16} />
                              </Link>
                              <button
                                onClick={() => deleteHandler(blog._id)}
                                className="flex h-8 w-8 items-center justify-center border border-gray-200 bg-white text-red-600 transition hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {blogs.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-gray-500">No blog posts found. Create one to get started!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default BlogListScreen;
