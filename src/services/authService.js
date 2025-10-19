import API from './api';

// REGISTER
export const register = async (name, email, password) => {
  try {
    const response = await API.post('/register', { name, email, password });
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

// LOGIN
export const login = async (email, password) => {
  try {
    const response = await API.post('/login', { email, password });
    // Simpan token di localStorage
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

// LOGOUT
export const logout = async () => {
  try {
    await API.post('/logout');
    localStorage.removeItem('token');
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
};
