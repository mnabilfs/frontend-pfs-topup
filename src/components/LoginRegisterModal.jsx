import React, { useState } from "react";
import Swal from "sweetalert2";
import { login, register } from "../services/authService";
import { generateSecureLink, ROUTE_IDS } from "../utils/urlEncryptor";

const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRe = /^[A-Za-z0-9]+$/;
const minPw = 7;

export default function LoginRegisterModal({ show, close }) {
  const [isLogin, setIsLogin] = useState(true);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const setField = (name, val) => {
    setValues((v) => ({ ...v, [name]: val }));
  };

  const validateField = (name, val) => {
    let msg = "";
    if (name === "email") {
      if (!val.trim()) msg = "Email wajib diisi.";
      else if (!emailRe.test(val))
        msg = "Format email tidak valid. Pastikan menggunakan '@'.";
    } else if (name === "password") {
      if (!val) msg = "Kata sandi wajib diisi.";
      else if (val.length < minPw)
        msg = `Kata sandi minimal ${minPw} karakter.`;
    } else if (name === "username") {
      if (!val.trim()) msg = "Username wajib diisi.";
      else if (!usernameRe.test(val))
        msg = "Username hanya boleh huruf atau angka.";
    }
    setErrors((e) => ({ ...e, [name]: msg }));
    return msg;
  };

  const validateAll = () => {
    const e = {};
    if (!isLogin) {
      e.username = validateField("username", values.username);
    }
    e.email = validateField("email", values.email);
    e.password = validateField("password", values.password);
    Object.keys(e).forEach((k) => e[k] === "" && delete e[k]);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const response = await login(values.email, values.password);

        localStorage.setItem("token", response.access_token);
        localStorage.setItem("role", response.user.role);
        localStorage.setItem("user", JSON.stringify(response.user));

        close();

        Swal.fire({
          icon: "success",
          title: "Login berhasil",
          text: `Selamat datang, ${response.user?.name || "User"}!`,
          confirmButtonColor: "#6366f1",
        }).then(() => {
          // 🔐 REDIRECT KE SECURE URL
          if (response.user?.role === "admin") {
            const secureUrl = generateSecureLink(ROUTE_IDS.ADMIN_DASHBOARD);
            window.location.href = secureUrl;
          } else {
            window.location.href = "/";
          }
        });
      } else {
        // 🔥 REGISTER USER
        await register(values.username, values.email, values.password);

        // 🔥 AUTO LOGIN SETELAH REGISTER
        const response = await login(values.email, values.password);

        // SIMPAN DATA USER
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("role", response.user.role);
        localStorage.setItem("user", JSON.stringify(response.user));

        // 🔥 TUTUP MODAL dulu sebelum swal muncul
        close();

        Swal.fire({
          icon: "success",
          title: "Akun berhasil dibuat",
          text: `Selamat datang, ${response.user?.name}!`,
          confirmButtonColor: "#6366f1",
        }).then(() => {
          // Redirect sesuai role
          if (response.user.role === "admin") {
            const secureUrl = generateSecureLink(ROUTE_IDS.ADMIN_DASHBOARD);
            window.location.href = secureUrl;
          } else {
            window.location.href = "/";
          }
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "Terjadi kesalahan";

      Swal.fire({
        icon: "error",
        title: isLogin ? "Login gagal" : "Pendaftaran gagal",
        text: errorMsg,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setValues({ username: "", email: "", password: "" });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#1f2637] text-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                isLogin
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                !isLogin
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Daftar
            </button>
          </div>

          <button
            onClick={close}
            className="grid transition rounded-full h-9 w-9 place-items-center hover:bg-white/10"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-[46%] w-full p-5 md:p-6">
            <div className="relative rounded-xl overflow-hidden ring-1 ring-white/10 bg-gradient-to-b from-[#3b2567] to-[#241a5b] min-h-[320px]">
              <div className="relative p-5 md:p-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-black rounded-full bg-amber-400/90">
                  Promo Spesial
                </div>
                <h3 className="mt-4 text-2xl font-extrabold leading-tight md:text-3xl">
                  Dapatkan bonus spesial saat mendaftar!
                </h3>

                <ul className="mt-4 space-y-2 text-sm text-white/90">
                  <li className="flex items-start gap-2">
                    <span className="mt-1">✨</span>
                    Klaim hadiah selamat datang eksklusif.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">🎁</span>
                    Promo & penawaran khusus member baru.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">💎</span>
                    Tukar poin dengan hadiah menarik.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="md:w-[54%] w-full p-5 md:p-8 border-t md:border-t-0 md:border-l border-white/10">
            <h2 className="mb-5 text-xl font-semibold md:text-2xl">
              {isLogin ? "Masuk ke Akun" : "Daftar Akun Baru"}
            </h2>

            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block mb-1 text-sm">
                    Username <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={values.username}
                    onChange={(e) => setField("username", e.target.value)}
                    onBlur={(e) => validateField("username", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full rounded-lg bg-white text-black placeholder-gray-400 px-3 py-3 outline-none ring-1 focus:ring-2 transition ${
                      errors.username
                        ? "ring-red-400 focus:ring-red-400"
                        : "ring-black/10 focus:ring-indigo-400"
                    }`}
                    placeholder="mis. nabil123"
                    autoComplete="username"
                    disabled={loading}
                  />
                  {errors.username && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.username}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block mb-1 text-sm">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={values.email}
                  onChange={(e) => setField("email", e.target.value)}
                  onBlur={(e) => validateField("email", e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full rounded-lg bg-white text-black placeholder-gray-400 px-3 py-3 outline-none ring-1 focus:ring-2 transition ${
                    errors.email
                      ? "ring-red-400 focus:ring-red-400"
                      : "ring-black/10 focus:ring-indigo-400"
                  }`}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm">
                  Kata Sandi <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  value={values.password}
                  onChange={(e) => setField("password", e.target.value)}
                  onBlur={(e) => validateField("password", e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full rounded-lg bg-white text-black placeholder-gray-400 px-3 py-3 outline-none ring-1 focus:ring-2 transition ${
                    errors.password
                      ? "ring-red-400 focus:ring-red-400"
                      : "ring-black/10 focus:ring-indigo-400"
                  }`}
                  placeholder={`Minimal ${minPw} karakter`}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  disabled={loading}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 mt-2 font-semibold text-black transition rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
              </button>

              <p className="mt-2 text-sm text-center text-white/80">
                {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                <button
                  onClick={switchMode}
                  disabled={loading}
                  className="underline text-amber-300 hover:text-amber-200 underline-offset-4 disabled:opacity-50"
                >
                  {isLogin ? "Daftar sekarang" : "Masuk di sini"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
