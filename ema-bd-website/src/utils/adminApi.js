const API = import.meta.env.VITE_API_URL;

export const adminAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required.");
  }

  return { Authorization: `Bearer ${token}` };
};

export const adminRequest = async (path, options = {}) => {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
      ...adminAuthHeaders(),
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "The request could not be completed.");
  }

  return data;
};
