import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ProfilePage = () => {

  const { user, logout } = useContext(AuthContext);

  // If user is NOT logged in
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-lg shadow-sm border border-pink-100 text-center">

        <h2 className="text-3xl font-serif text-primary-700 font-bold mb-4">
          Welcome
        </h2>

        <p className="text-stone-600 mb-8">
          Please log in if you already have an account or register to create a new account.
        </p>

        <div className="flex justify-center gap-4">

          {/* Login Button */}
          <Link
            to="/login"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded text-sm uppercase tracking-wider transition"
          >
            Login
          </Link>

          {/* Register Button */}
          <Link
            to="/register"
            className="bg-stone-800 hover:bg-stone-900 text-white px-6 py-2 rounded text-sm uppercase tracking-wider transition"
          >
            Register
          </Link>

        </div>
      </div>
    );
  }

  // If user IS logged in
  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-lg shadow-sm border border-pink-100">

      <h2 className="text-3xl font-serif text-primary-700 font-bold mb-6">
        My Profile
      </h2>

      <div className="space-y-4 mb-6">

        {/* Name */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Name
          </span>

          <p className="text-lg text-stone-800">
            {user.name}
          </p>
        </div>

        {/* Email */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Email
          </span>

          <p className="text-lg text-stone-800">
            {user.email}
          </p>
        </div>

        {/* Account Type */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Account Type
          </span>

          <p className="text-lg text-stone-800">
            {user.isAdmin ? 'Administrator' : 'Standard Customer'}
          </p>
        </div>

      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="bg-stone-800 hover:bg-stone-900 text-white px-6 py-2 rounded text-sm uppercase tracking-wider transition"
      >
        Log Out
      </button>

    </div>
  );
};

export default ProfilePage;