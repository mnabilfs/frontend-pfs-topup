import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { decryptPath } from "../utils/urlEncryptor";

// Loading component
const SecureRouteLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90">
    <div className="bat-loader-container">
      <div className="bat"></div>
    </div>
  </div>
);

// Main Secure Route Component
const SecureRoute = ({ children }) => {
  const { encryptedPath } = useParams();
  const [loading, setLoading] = useState(true);
  const [actualRouteId, setActualRouteId] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simulasi delay untuk security check
    const timer = setTimeout(() => {
      try {
        const decrypted = decryptPath(encryptedPath);

        if (!decrypted) {
          console.error("Decryption failed - invalid path");
          setError(true);
        } else {
          setActualRouteId(decrypted);
        }
      } catch (e) {
        console.error("Route decryption failed:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [encryptedPath]);

  if (loading) {
    return <SecureRouteLoader />;
  }

  if (error || !actualRouteId) {
    return <Navigate to="/" replace />;
  }

  // Clone children dengan actual route ID sebagai prop
  return React.cloneElement(children, { actualRouteId });
};

export default SecureRoute;