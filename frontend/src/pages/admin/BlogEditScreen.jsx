import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { apiFetch } from "../../utils/api";

const BlogEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = id && id !== "create";

  useEffect(() => {
    if (isEdit) {
      fetchBlogDetails();
    }
  }, [id, isEdit]);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/blogs/id/${id}`);
      if (!res.ok) throw new Error("Blog not found");
      const data = await res.json();
      setTitle(data.title);
      setExcerpt(data.excerpt);
      setImage(data.image);
      setDescription(data.description);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await apiFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Image upload failed");
      }

      const data = await res.json();
      setImage(data.url);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
      setError("Image upload failed. Please try again.");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/blogs/id/${id}` : "/api/blogs";

      const res = await apiFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          excerpt,
          image,
          description,
          author: user?._id,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save blog");
      }

      navigate("/admin/bloglist");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link
          to="/admin/bloglist"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          Back to Blog List
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {isEdit ? "Edit Blog Post" : "Create Blog Post"}
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={submitHandler} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            required
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="text"
            id="image"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter image url or upload an image below"
          />
          <input
            type="file"
            id="image-file"
            accept="image/*"
            className="mt-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
            onChange={uploadFileHandler}
          />
          {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
          {image && (
            <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
              <img src={image} alt="Preview" className="h-48 w-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="description"
            required
            rows={10}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-pink-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <Save size={20} />
            )}
            {isEdit ? "Update Blog Post" : "Publish Blog Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditScreen;
