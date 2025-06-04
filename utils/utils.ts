export function getInitials(name: string): string {
  const initials = name
    .split(" ")
    .map(word => word[0].toUpperCase())
    .join("");

  return initials.length > 2 ? initials.slice(0, 2) : initials;
}

function getAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") {
    console.warn("document object is not available. getAccessTokenFromCookie() should only be called in the browser.");
    return null;
  }

  const cookies = document.cookie.split("; ");
  let authTokenStr = null;

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith(`sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}-auth-token=`)) {
      authTokenStr = cookie.split("=")[1];
      break;
    }
  }

  if (authTokenStr) {
    try {
      const authTokenJson = JSON.parse(decodeURIComponent(authTokenStr));
      return authTokenJson?.access_token || null;
    } catch (error) {
      console.error("Failed to parse auth token from cookie:", error);
      return null;
    }
  }

  return null;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const accessToken = getAccessTokenFromCookie();
  
  if (!accessToken) {
    throw new Error("No access token found in cookies")
  }

  const headers = {
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} - ${response.statusText}`);
  }

  return response;
}
