// Secret key - PENTING: Ganti dengan key rahasia Anda sendiri
const SECRET_KEY = "PFS_STORE_2024_SECRET_KEY_ULTRA_SECURE";

// 🔐 ROUTE IDENTIFIERS - Ini yang akan di-encrypt
export const ROUTE_IDS = {
  ADMIN_DASHBOARD: "admin_dash_v1_secure",
  USER_PROFILE: "user_prof_v1_secure",
  // Tambahkan route lain di sini jika perlu
};

// Fungsi untuk encode string ke base64
const base64Encode = (str) => {
  return btoa(encodeURIComponent(str));
};

// Fungsi untuk decode base64 ke string
const base64Decode = (str) => {
  try {
    return decodeURIComponent(atob(str));
  } catch (e) {
    return null;
  }
};

// Simple XOR encryption
const xorEncrypt = (text, key) => {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
};

// Encrypt route identifier
export const encryptPath = (routeIdentifier) => {
  // XOR encryption dengan secret key
  const encrypted = xorEncrypt(routeIdentifier, SECRET_KEY);

  // Encode ke base64 untuk URL-safe
  const encoded = base64Encode(encrypted);

  // Tambahkan timestamp untuk uniqueness
  const timestamp = Date.now().toString(36);

  return `${encoded}-${timestamp}`;
};

// Decrypt URL path
export const decryptPath = (encryptedPath) => {
  try {
    // Pisahkan encrypted path dari timestamp
    const [encoded] = encryptedPath.split("-");

    // Decode dari base64
    const encrypted = base64Decode(encoded);

    if (!encrypted) return null;

    // Decrypt dengan XOR
    const decrypted = xorEncrypt(encrypted, SECRET_KEY);

    return decrypted;
  } catch (e) {
    console.error("Decrypt error:", e);
    return null;
  }
};

// Generate secure link - untuk digunakan di komponen
export const generateSecureLink = (routeIdentifier) => {
  return `/s/${encryptPath(routeIdentifier)}`;
};