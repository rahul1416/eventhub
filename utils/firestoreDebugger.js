import { db } from "../firebase/config";
import { collection, addDoc, doc, setDoc, getDocs } from "firebase/firestore";

/**
 * Tests basic Firestore write functionality
 */
export const testFirestoreWrite = async () => {
  try {
    console.log("Testing Firestore write operation...");
    const testCollectionRef = collection(db, "test_collection");
    const docRef = await addDoc(testCollectionRef, {
      test: true,
      timestamp: new Date().toString(),
      message: "Test document",
    });
    console.log("Document successfully written with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error testing Firestore write:", error);
    return { success: false, error };
  }
};

/**
 * Tests if we can write to the users collection specifically
 */
export const testUserCollectionWrite = async () => {
  try {
    console.log("Testing write to users collection...");
    const testUserId = `test_user_${Date.now()}`;
    const userDocRef = doc(db, "users", testUserId);
    await setDoc(userDocRef, {
      name: "Test User",
      email: "test@example.com",
      createdAt: new Date().toString(),
    });
    console.log("Test user document successfully written with ID:", testUserId);
    return { success: true, id: testUserId };
  } catch (error) {
    console.error("Error writing to users collection:", error);
    return { success: false, error };
  }
};

// Make accessible in browser console
if (typeof window !== "undefined") {
  window.testFirestore = {
    write: testFirestoreWrite,
    writeUser: testUserCollectionWrite,
  };
}
