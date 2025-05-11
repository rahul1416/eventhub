import { db } from "../firebase/config";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Save user data to Firestore after signup
 * @param {string} userId - The Firebase Auth user ID
 * @param {Object} userData - The user data to save
 * @returns {Promise} - A promise that resolves when data is saved
 */
export const saveUserData = async (userId, userData) => {
  console.log("saveUserData called with userId:", userId);

  if (!userId) {
    console.error("Cannot save user data: User ID is missing");
    return { success: false, error: "User ID is required" };
  }

  try {
    // Minimal test write to check Firestore connectivity
    await setDoc(doc(db, "firestore_debug", "test"), {
      alive: true,
      ts: serverTimestamp(),
    });

    // Add server timestamps
    const userDataToSave = {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log(`Attempting to save data to users/${userId}`);

    // Try approach #1: Using setDoc with doc path
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, userDataToSave);
      console.log("User data saved with setDoc!");
      return { success: true };
    } catch (err) {
      console.error("setDoc failed, trying alternative approach:", err);

      // Try approach #2: Using collection and addDoc if setDoc fails
      const usersCollectionRef = collection(db, "users");
      const newUserDoc = await addDoc(usersCollectionRef, {
        ...userDataToSave,
        authUserId: userId, // Include the auth ID as a field
      });

      console.log("User data saved with addDoc!", newUserDoc.id);
      return { success: true };
    }
  } catch (error) {
    console.error("Firestore saveUserData error:", error.code, error.message);
    return { success: false, error: error.message };
  }
};
