import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Users,
  Package,
  FileText,
  DollarSign,
  Mail,
  Trash2,
  CheckCircle,
} from "lucide-react";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  } catch {
    return null;
  }
};

const MessageListScreen = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(getStoredUser);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sidebarItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      link: "/admin-dashboard",
    },
    {
      name: "Customers",
      icon: Users,
      link: "/admin/userlist",
    },
    {
      name: "Products",
      icon: Package,
      link: "/admin/productlist",
    },
    {
      name: "Orders",
      icon: ShoppingBag,
      link: "/admin/orderlist",
    },
    {
      name: "Blogs",
      icon: FileText,
      link: "/admin/bloglist",
    },
    {
      name: "Messages",
      icon: Mail,
      link: "/admin/messages",
      active: true,
    },
  ];

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    } else {
      fetchMessages();
    }
  }, [navigate, userInfo]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/messages", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const res = await fetch(`/api/messages/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to delete message");
        fetchMessages();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const markAsReadHandler = async (id) => {
    try {
      const res = await fetch(`/api/messages/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to mark as read");
      fetchMessages();
    } catch (err) {
      alert(err.message);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
        <img
          src="/images/banner.jpg"
          alt="Admin dashboard banner"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1460px] flex-col items-center justify-center px-6 text-center text-white sm:min-h-[320px]">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Messages
          </h1>
          <div className="mt-6 flex items-center gap-3 text-lg font-medium">
            <Link to="/" className="text-white/85 transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link to="/admin-dashboard" className="text-white/85 transition hover:text-white">
              Admin dashboard
            </Link>
            <span>/</span>
            <span className="font-bold">Messages</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1460px] px-6 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[315px_1fr]">
          <aside className="border-gray-200 lg:border-r lg:pr-9">
            <h2 className="border-b border-gray-200 pb-5 text-2xl font-extrabold uppercase">
              Admin Panel
            </h2>

            <nav className="mt-5 space-y-1 text-lg font-bold">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.link}
                    className={`flex items-center gap-3 px-5 py-3 transition hover:bg-[#f2f2f2] hover:text-pink-600 ${
                      item.active ? "bg-[#f2f2f2]" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}

              <Link
                to="/admin/sales"
                className="flex items-center gap-3 px-5 py-3 transition hover:bg-[#f2f2f2] hover:text-pink-600"
              >
                <DollarSign className="h-5 w-5" />
                Sales
              </Link>

              <button
                type="button"
                onClick={logoutHandler}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-[#f2f2f2] hover:text-pink-600"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </nav>

            <div className="mt-8 border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-[#2b2b2b] text-lg font-extrabold text-white">
                  {userInfo?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-base font-extrabold">
                    {userInfo?.name || "Admin"}
                  </p>

                  <p className="mt-1 truncate text-sm text-gray-500">
                    {userInfo?.email || "admin@beautybliss.com"}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:pl-1">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-extrabold uppercase">
                  Customer Messages
                </h2>
                <p className="mt-3 text-lg leading-8 text-gray-600">
                  View and manage messages submitted via the Contact Us form.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="border border-gray-200 bg-white py-20 text-center text-sm font-bold uppercase tracking-widest text-gray-400 shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                Loading messages...
              </div>
            ) : error ? (
              <div className="border border-red-100 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : messages.length === 0 ? (
              <div className="border border-gray-200 bg-white py-20 text-center text-sm font-bold uppercase tracking-widest text-gray-400 shadow-[0_1px_10px_rgba(0,0,0,0.08)]">
                No messages found
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message._id} className={`border p-6 rounded-lg shadow-sm ${message.isRead ? 'bg-white border-gray-200' : 'bg-pink-50 border-pink-200'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{message.name}</h3>
                        <p className="text-sm text-gray-500 flex gap-4 mt-1">
                          <a href={`mailto:${message.email}`} className="text-pink-600 hover:underline">{message.email}</a>
                          {message.phone && <span>{message.phone}</span>}
                          {message.company && <span>{message.company}</span>}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-gray-400 block mb-2">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                        <div className="flex gap-2 justify-end">
                          {!message.isRead && (
                            <button
                              onClick={() => markAsReadHandler(message._id)}
                              className="text-green-600 hover:text-green-800 transition"
                              title="Mark as Read"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteHandler(message._id)}
                            className="text-red-500 hover:text-red-700 transition"
                            title="Delete Message"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap text-sm border-t border-gray-100 pt-4 mt-4">
                      {message.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default MessageListScreen;
