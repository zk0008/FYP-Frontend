export async function fetchWithAuth<T>(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} - ${response.statusText}`);
  }

  return await response.json();
}
