import React, { useState } from "react";
// Impor 'useLocation' untuk mendeteksi URL saat ini
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Home from "./pages/Home";
import TopupPage from "./pages/TopupPage";
import NotFound from "./pages/NotFound";
import Account_ml from "./pages/Account_ml";
import PaymentSuccess from "./pages/PaymentSuccess";
import ConsumeApi from "./pages/ConsumeApi";
import LoginRegisterModal from "./components/LoginRegisterModal"; 
import Dashboard from "./pages/Dashboard";

/**
 * Kita buat komponen internal baru 'AppLayout'.
 * Komponen ini dibutuhkan karena hook 'useLocation' hanya bisa
 * digunakan di dalam komponen yang dibungkus <BrowserRouter>.
 */
const AppLayout = () => {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation(); // Ini akan memberi kita info URL, cth: { pathname: "/dashboard" }

  // Cek apakah kita sedang berada di halaman dashboard
  // Kita gunakan .startsWith() untuk jaga-jaga jika ada sub-rute
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      {/* LOGIKA KONDISIONAL:
        Hanya tampilkan <Navbar /> jika 'isDashboardPage' bernilai 'false'.
      */}
      {!isDashboardPage && <Navbar openModal={openModal} />}

      {/* Sisa Rute Anda */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topup/:gameId" element={<TopupPage />} /> 
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="account_ml" element={<Account_ml />} />
        <Route path="consume_api" element={<ConsumeApi />} />
        <Route path="/payment/success/:orderId" element={<PaymentSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <LoginRegisterModal show={showModal} close={closeModal} />
    </>
  );
}


// Komponen App utama sekarang hanya membungkus BrowserRouter dan AppLayout
function App() {
  return (
    <>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </>
  );
}

export default App;