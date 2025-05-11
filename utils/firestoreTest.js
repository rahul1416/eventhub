import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

/**
 * Test function to verify if Firestore is accessible
 * Run this from the browser console with: testFirestore()
 */
export const testFirestore = async () => {
  try {
    console.log("Testing Firestore connection...");
    const testCollection = collection(db, "test_collection");
    const testDoc = await addDoc(testCollection, {
      test: true,
      timestamp: new Date().toISOString(),
      message: "This is a test document",
    });

    console.log("Test document successfully added with ID:", testDoc.id);
    return { success: true, docId: testDoc.id };
  } catch (error) {
    console.error("Firestore test failed:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    return { success: false, error: error.message };
  }
};

// Make accessible in browser console
if (typeof window !== "undefined") {
  window.testFirestore = testFirestore;
}
