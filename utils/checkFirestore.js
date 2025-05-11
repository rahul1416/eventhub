import { db } from "../firebase/config";

/**
 * Checks if Firestore is properly initialized
 */
export function checkFirestoreInitialization() {
  console.log("Checking Firestore initialization...");

  // Check if db is defined
  if (!db) {
    console.error("Firestore db instance is undefined!");
    return false;
  }

  // Check db properties
  console.log("Firestore db instance:", db);
  console.log("Firestore type:", db.type);
  console.log("Firestore app:", db.app);

  // Check if required methods exist
  const hasDoc = typeof db.doc === "function" || typeof doc !== "undefined";
  const hasCollection =
    typeof db.collection === "function" || typeof collection !== "undefined";

  console.log("Firestore functionality check:", {
    hasDocFunction: hasDoc,
    hasCollectionFunction: hasCollection,
  });

  return true;
}

// Run check when imported
if (typeof window !== "undefined") {
  // Wait for DOM to be ready
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(checkFirestoreInitialization, 1000);
    console.log("Firestore check scheduled");
  });
}
