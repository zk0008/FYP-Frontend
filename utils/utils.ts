import { MAX_FILE_SIZE_MB } from "@/utils/constants";

export function validateFile(file: File): { isValid: boolean; errorMessage?: string } {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png"
  ];

  if (file.size / 1_000_000 > MAX_FILE_SIZE_MB) {
    return { isValid: false, errorMessage: `File size exceeds ${MAX_FILE_SIZE_MB} MB limit. Please upload a smaller file.` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, errorMessage: "Unsupported file type. Please upload a PDF, JPEG, or PNG file." };
  }

  return { isValid: true };
}

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

  return response;
}
