const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const login = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }

    const data = await res.json();

    // ✅ Save token to localStorage
    localStorage.setItem('svaAuth', data.token);

    return data.user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
  });
};
