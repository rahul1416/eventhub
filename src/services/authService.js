import { getCurrentUser } from "./authService";

// ...existing code...

export const getCurrentUser = async () => {
  try {
    const response = await fetch("/api/auth/me");
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
};

// ...existing code...
