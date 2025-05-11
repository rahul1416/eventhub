// ...existing code...
export const fetchUserProfile = async () => {
  try {
    const response = await fetch("/api/user/profile");

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    // Ensure the accountType is included in the response
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
// ...existing code...
