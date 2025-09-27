import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const saveCalculation = async (userId: string, type: "diesel" | "load", data: any) => {
  try {
    const docRef = await addDoc(collection(db, "users", userId, "calculations"), {
      type,
      data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    console.error("❌ Failed to save calculation:", err);
    throw err;
  }
};

