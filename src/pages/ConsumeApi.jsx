import { useState } from 'react';
import { login, register, logout } from '../services/authService';

const ConsumeApi = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async () => {
    try {
      const res = await register(name, email, password);
      alert('✅ Register berhasil: ' + JSON.stringify(res));
    } catch (err) {
      alert('❌ Register gagal: ' + err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      alert('✅ Login berhasil: ' + JSON.stringify(res));
    } catch (err) {
      alert('❌ Login gagal: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    alert('👋 Logout berhasil!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          🔐 React Vite + Laravel Auth
        </h1>

        {/* Register Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Register</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleRegister}
              className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Daftar
            </button>
          </div>
        </div>

        {/* Login Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Login</h2>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleLogin}
              className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Masuk
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Logout</h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsumeApi;
