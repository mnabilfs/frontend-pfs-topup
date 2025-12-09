// frontend-pfs-topup\src\App.jsx
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import TopupPage from "./pages/TopupPage";
import NotFound from "./pages/NotFound";
import Account_ml from "./pages/Account_ml";
import PaymentSuccess from "./pages/PaymentSuccess";
import ConsumeApi from "./pages/ConsumeApi";
import LoginRegisterModal from "./components/LoginRegisterModal";
import Dashboard from "./pages/Dashboard";
import AdminRoute from "./routes/AdminRoute";
import Profile from "./pages/Profile";
import SecureRoute from "./components/SecureRoute";
import { encryptPath, ROUTE_IDS } from "./utils/urlEncryptor";
import GlobalAudioPlayer from "./components/GlobalAudioPlayer";

/**
 * 🔐 SECURE ROUTE HANDLER
 * Component untuk resolve encrypted path ke component yang tepat
 */
const SecureRouteHandler = ({ actualRouteId }) => {
  // Route mapping berdasarkan ROUTE_IDS
  const routeMap = {
    [ROUTE_IDS.ADMIN_DASHBOARD]: (
      <AdminRoute>
        <Dashboard />
      </AdminRoute>
    ),
    [ROUTE_IDS.USER_PROFILE]: <Profile />,
    // Tambahkan route lain yang ingin di-encrypt di sini
  };

  const Component = routeMap[actualRouteId];

  // Jika route tidak ditemukan, redirect ke home
  if (!Component) {
    console.warn("Invalid route identifier:", actualRouteId);
    return <Navigate to="/" replace />;
  }

  return Component;
};

/**
 * 🚫 REDIRECT TO SECURE
 * Component untuk auto-redirect dari URL normal ke encrypted URL
 */
const RedirectToSecure = ({ routeIdentifier }) => {
  const secureUrl = `/s/${encryptPath(routeIdentifier)}`;

  React.useEffect(() => {
    window.location.replace(secureUrl);
  }, [secureUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90">
      <div className="bat-loader-container">
        <div className="bat"></div>
      </div>
    </div>
  );
};

/**
 * 📱 APP LAYOUT
 * Layout utama dengan conditional navbar
 */
const AppLayout = () => {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  // Cek apakah sedang di halaman secure route
  const isSecureRoute = location.pathname.startsWith("/s/");

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      {/* Navbar disembunyikan di secure routes */}
      {!isSecureRoute && <Navbar openModal={openModal} />}

      <Routes>
        {/* ✅ PUBLIC ROUTES - URL Normal */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Home openLoginModal />} />
        <Route path="/register" element={<Home openRegisterModal />} />
        <Route path="/topup/:gameId" element={<TopupPage />} />
        <Route path="/account_ml" element={<Account_ml />} />
        <Route path="consume_api" element={<ConsumeApi />} />
        <Route path="/payment/success/:orderId" element={<PaymentSuccess />} />

        {/* 🔐 SECURE ROUTE - Encrypted URL Handler */}
        <Route
          path="/s/:encryptedPath"
          element={
            <SecureRoute>
              <SecureRouteHandler />
            </SecureRoute>
          }
        />

        {/* 🚫 BLOCKED ROUTES - Direct Access Protection */}
        <Route
          path="/admin/*"
          element={
            <RedirectToSecure routeIdentifier={ROUTE_IDS.ADMIN_DASHBOARD} />
          }
        />

        <Route
          path="/profile"
          element={
            <RedirectToSecure routeIdentifier={ROUTE_IDS.USER_PROFILE} />
          }
        />

        <Route
          path="/dashboard"
          element={
            <RedirectToSecure routeIdentifier={ROUTE_IDS.ADMIN_DASHBOARD} />
          }
        />

        {/* ❌ 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Login/Register Modal */}
      <LoginRegisterModal show={showModal} close={closeModal} />

      <GlobalAudioPlayer />
    </>
  );
};

/**
 * 🎯 MAIN APP COMPONENT
 */
function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
