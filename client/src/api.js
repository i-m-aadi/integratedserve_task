const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body
      ? { "Content-Type": "application/json" }
      : {}),
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers
  });

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong."
    );
  }

  return data;
}

export const get = (path) =>
  api(path);

export const post = (path, body) =>
  api(path, {
    method: "POST",
    body: JSON.stringify(body)
  });

export const put = (path, body) =>
  api(path, {
    method: "PUT",
    body: JSON.stringify(body)
  });

export const patch = (path, body) =>
  api(path, {
    method: "PATCH",
    body: JSON.stringify(body)
  });

export const del = (path) =>
  api(path, {
    method: "DELETE"
  });