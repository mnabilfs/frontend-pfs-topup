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
      console.log("LOGIN DIKLIK");
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
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h1 className="mb-6 text-3xl font-bold text-center text-indigo-600">
          🔐 React Vite + Laravel Auth
        </h1>

        {/* Register Section */}
        <div className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-gray-700">Register</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleRegister}
              className="py-2 text-white transition duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Daftar
            </button>
          </div>
        </div>

        {/* Login Section */}
        <div className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-gray-700">Login</h2>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleLogin}
              className="py-2 text-white transition duration-300 bg-green-600 rounded-lg hover:bg-green-700"
            >
              Masuk
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="text-center">
          <h2 className="mb-3 text-xl font-semibold text-gray-700">Logout</h2>
          <button
            onClick={handleLogout}
            className="px-6 py-2 text-white transition duration-300 bg-red-600 rounded-lg hover:bg-red-700"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsumeApi;
