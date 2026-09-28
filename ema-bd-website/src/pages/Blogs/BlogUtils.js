export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5001";

export const imageUrl = (file) => `${API_URL}/uploads/${file}`;

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });