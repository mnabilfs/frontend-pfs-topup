import React, { useState } from "react";
import Swal from "sweetalert2";

const emailRe =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Regex email dengan validasi @
const usernameRe = /^[A-Za-z0-9]+$/; // huruf/angka saja
const minPw = 7;

export default function LoginRegisterModal({ show, close }) {
  const [isLogin, setIsLogin] = useState(true);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  if (!show) return null;

  const setField = (name, val) => {
    setValues((v) => ({ ...v, [name]: val }));
  };

  // Validasi per-field
  const validateField = (name, val) => {
    let msg = "";
    if (name === "email") {
      if (!val.trim()) msg = "Email wajib diisi.";
      else if (!emailRe.test(val)) msg = "Format email tidak valid. Pastikan menggunakan '@'.";
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
    // Bersihkan key yang kosong
    Object.keys(e).forEach((k) => e[k] === "" && delete e[k]);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (!validateAll()) return; // TIDAK ada SweetAlert saat error

    // success -> SweetAlert2
    Swal.fire({
      icon: "success",
      title: isLogin ? "Login berhasil" : "Pendaftaran berhasil",
      text: isLogin
        ? "Selamat datang kembali!"
        : "Akun kamu sudah terdaftar.",
      confirmButtonColor: "#6366f1",
    }).then(() => {
      // Pastikan modal ditutup hanya setelah SweetAlert selesai
      close?.(); // Tutup modal setelah SweetAlert selesai
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#1f2637] text-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header close */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLogin(true)} // Pindahkan ke login tanpa membutuhkan klik ganda
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                isLogin
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setIsLogin(false)} // Pindahkan ke daftar tanpa membutuhkan klik ganda
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
            className="h-9 w-9 rounded-full grid place-items-center hover:bg-white/10 transition"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Body: 2 kolom */}
        <div className="flex flex-col md:flex-row">
          {/* Kiri: Iklan / Banner */}
          <div className="md:w-[46%] w-full p-5 md:p-6">
            <div className="relative rounded-xl overflow-hidden ring-1 ring-white/10 bg-gradient-to-b from-[#3b2567] to-[#241a5b] min-h-[320px]">
              <img
                src="/assets/login-banner.png"
                alt="Banner Iklan"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="relative p-5 md:p-7">
                <div className="inline-flex items-center gap-2 bg-amber-400/90 text-black font-semibold px-3 py-1 rounded-full text-xs">
                  Banner
                </div>
                <h3 className="mt-4 text-2xl md:text-3xl font-extrabold leading-tight drop-shadow">
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

          {/* Kanan: Form */}
          <div className="md:w-[54%] w-full p-5 md:p-8 border-t md:border-t-0 md:border-l border-white/10">
            <h2 className="text-xl md:text-2xl font-semibold mb-5">
              {isLogin ? "Masuk ke Akun" : "Daftar Akun Baru"}
            </h2>

            <form onSubmit={onSubmit} noValidate className="space-y-4">
              {/* Register: Username */}
              {!isLogin && (
                <div>
                  <label className="block text-sm mb-1">
                    Username <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={values.username}
                    onChange={(e) => setField("username", e.target.value)}
                    onBlur={(e) => validateField("username", e.target.value)}
                    className={`w-full rounded-lg bg-white text-black px-3 py-3 outline-none ring-1 focus:ring-2 transition ${
                      errors.username
                        ? "ring-red-400 focus:ring-red-400"
                        : "ring-black/10 focus:ring-indigo-400"
                    }`}
                    placeholder="mis. nabil123"
                    autoComplete="username"
                  />
                  {errors.username && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.username}
                    </p>
                  )}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm mb-1">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={values.email}
                  onChange={(e) => setField("email", e.target.value)}
                  onBlur={(e) => validateField("email", e.target.value)}
                  className={`w-full rounded-lg bg-white text-black px-3 py-3 outline-none ring-1 focus:ring-2 transition ${
                    errors.email
                      ? "ring-red-400 focus:ring-red-400"
                      : "ring-black/10 focus:ring-indigo-400"
                  }`}
                  placeholder="nama@email.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm mb-1">
                  Kata Sandi <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  value={values.password}
                  onChange={(e) => setField("password", e.target.value)}
                  onBlur={(e) => validateField("password", e.target.value)}
                  className={`w-full rounded-lg bg-white text-black px-3 py-3 outline-none ring-1 focus:ring-2 transition ${
                    errors.password
                      ? "ring-red-400 focus:ring-red-400"
                      : "ring-black/10 focus:ring-indigo-400"
                  }`}
                  placeholder={`Minimal ${minPw} karakter`}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg py-3 transition"
              >
                {isLogin ? "Masuk" : "Daftar"}
              </button>

              <p className="text-sm text-white/80 text-center mt-2">
                {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)} // Toggle login/register
                  className="text-amber-300 hover:text-amber-200 underline underline-offset-4"
                >
                  {isLogin ? "Daftar sekarang" : "Masuk di sini"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
