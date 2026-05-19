import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <div className="text-center py-20">Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-lg shadow-sm border border-pink-100">
      <h2 className="text-3xl font-serif text-primary-700 font-bold mb-6">My Profile</h2>
      <div className="space-y-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Name</span>
          <p className="text-lg text-stone-800">{user.name}</p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Email</span>
          <p className="text-lg text-stone-800">{user.email}</p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Account Type</span>
          <p className="text-lg text-stone-800">{user.isAdmin ? 'Administrator' : 'Standard Customer'}</p>
        </div>
      </div>
      <button onClick={logout} className="bg-stone-800 hover:bg-stone-900 text-white px-6 py-2 rounded text-sm uppercase tracking-wider transition">Log Out</button>
    </div>
  );
};

export default ProfilePage;
