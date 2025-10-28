import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Pastikan path ke Navbar benar
import Home from "./pages/Home";
import Topup_ml from "./pages/Topup_ml";
import NotFound from "./pages/NotFound";
import Account_ml from "./pages/Account_ml";
import PaymentSuccess from "./pages/PaymentSuccess";
import ConsumeApi from "./pages/ConsumeApi";
import LoginRegisterModal from "./components/LoginRegisterModal"; // Modal

function App() {
  const [showModal, setShowModal] = useState(false); // State untuk modal login/register

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <BrowserRouter>
        {/* Navbar dengan tombol untuk membuka modal login/register */}
        <Navbar openModal={openModal} /> {/* Pass fungsi openModal ke Navbar */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="topup_ml" element={<Topup_ml />} />
          <Route path="account_ml" element={<Account_ml />} />
          <Route path="consume_api" element={<ConsumeApi />} />
          <Route path="/payment/success/:orderId" element={<PaymentSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Modal Login/Register */}
        <LoginRegisterModal show={showModal} close={closeModal} />
      </BrowserRouter>
    </>
  );
}

export default App;
