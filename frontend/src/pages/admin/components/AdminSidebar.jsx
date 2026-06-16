import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  User,
  LogOut,
  FileText,
  Mail,
  DollarSign,
} from 'lucide-react';

// Helper to retrieve stored user info from localStorage
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('userInfo')) || null;
  } catch {
    return null;
  }
};

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const userInfo = React.useState(getStoredUser)[0];

  const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard, link: '/admin-dashboard' },
    { name: 'Customers', icon: Users, link: '/admin/userlist' },
    { name: 'Products', icon: Package, link: '/admin/productlist' },
    { name: 'Orders', icon: ShoppingBag, link: '/admin/orderlist' },
    { name: 'Blogs', icon: FileText, link: '/admin/bloglist' },
    { name: 'Messages', icon: Mail, link: '/admin/messages' },
    { name: 'Sales', icon: DollarSign, link: '/admin/sales' },
  ];

  return (
    <aside className="border-gray-200 lg:border-r lg:pr-9">
      <h2 className="border-b border-gray-200 pb-5 text-2xl font-extrabold uppercase">
        Admin Panel
      </h2>

      <nav className="mt-5 space-y-1 text-lg font-bold">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.link || (item.link !== '/admin-dashboard' && currentPath.startsWith(item.link));
          return (
            <Link
              key={item.name}
              to={item.link}
              className={`flex items-center gap-3 px-5 py-3 transition hover:bg-[#f2f2f2] hover:text-pink-600 ${isActive ? 'bg-[#f2f2f2] text-pink-600' : ''}`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
        <Link
          to="/profile"
          className="flex items-center gap-3 px-5 py-3 transition hover:bg-[#f2f2f2] hover:text-pink-600"
        >
          <User className="h-5 w-5" />
          Profile
        </Link>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('userInfo');
            navigate('/login');
          }}
          className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-[#f2f2f2] hover:text-pink-600"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </nav>

      <div className="mt-8 border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center bg-[#2b2b2b] text-lg font-extrabold text-white">
            {userInfo?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-extrabold">{userInfo?.name || 'Admin'}</p>
            <p className="mt-1 truncate text-sm text-gray-500">{userInfo?.email || 'admin@beautybliss.com'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
