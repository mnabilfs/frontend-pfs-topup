import API from "./api";

// REGISTER
export const register = async (username, email, password) => {
  try {
    const response = await API.post("api/register", {
      name: username,
      email,
      password,
    });

    // Jika API memberikan token setelah register
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }

    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", response.data.user.role);
    }

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

// LOGIN
export const login = async (email, password) => {
  console.log("LOGIN() DIJALANKAN");
  try {
    const response = await API.post("api/login", { email, password });
    console.log("LOGIN RESPONSE:", response.data);

    // Pastikan gunakan access_token
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", response.data.user.role);
    }

    // Simpan access token
    // if (response.data.access_token) {
    //   localStorage.setItem("token", response.data.access_token);
    // }

    // // Simpan user
    // if (response.data.user) {
    //   localStorage.setItem("user", JSON.stringify(response.data.user));

    //   localStorage.setItem("role", response.data.user.role);
    // }

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

// Ambil user yang sedang login
export const getCurrentUser = async () => {
  try {
    const response = await API.get("api/user");
    return response.data;
  } catch (error) {
    console.error(
      "Gagal mengambil user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// LOGOUT
export const logout = async () => {
  try {
    await API.post("api/logout");
  } catch (error) {
    console.error(error.response?.data || error.message);
  } finally {
    localStorage.removeItem("token");
  }
};
