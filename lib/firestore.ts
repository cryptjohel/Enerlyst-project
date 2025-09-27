import { db } from "./firebase"; // make sure you already initialized firebase
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

// Save calculation result (appliance or diesel)
export async function saveCalculation(
  uid: string,
  type: "appliance" | "diesel",
  data: any
) {
  try {
    const ref = collection(db, "calculations");
    await addDoc(ref, {
      uid,
      type,
      data,
      createdAt: Date.now(),
    });
  } catch (err) {
    console.error("Firestore save error:", err);
    throw err;
  }
}

// Fetch history for a user
export async function getUserHistory(uid: string) {
  try {
    const ref = collection(db, "calculations");
    const q = query(ref, where("uid", "==", uid), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));
  } catch (err) {
    console.error("Firestore fetch error:", err);
    throw err;
  }
}
