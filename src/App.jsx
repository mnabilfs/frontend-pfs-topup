import { useState } from 'react';
import { login, register, logout } from './services/authService';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async () => {
    try {
      const res = await register(name, email, password);
      alert('Register berhasil: ' + JSON.stringify(res));
    } catch (err) {
      alert('Register gagal: ' + err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      alert('Login berhasil: ' + JSON.stringify(res));
    } catch (err) {
      alert('Login gagal: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    alert('Logout berhasil!');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>React Vite + Laravel Auth</h1>

      <div>
        <h2>Register</h2>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
      </div>

      <div>
        <h2>Login</h2>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>

      <div>
        <h2>Logout</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default App;
