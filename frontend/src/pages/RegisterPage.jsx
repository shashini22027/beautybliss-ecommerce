import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users', { name, email, password });
      login(data);
      window.location.href = '/';
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-sm border border-pink-100">
      <h2 className="text-3xl font-serif text-center text-primary-700 font-bold mb-6">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Full Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary-400" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary-400" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary-400" required />
        </div>
        <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded text-sm uppercase tracking-wider transition">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
