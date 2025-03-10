// lib/firebase/db.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { ProductType, OrderType } from "../types";

// Products
export const getProducts = async (): Promise<ProductType[]> => {
  const productsRef = collection(db, "products");
  const snapshot = await getDocs(productsRef);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      createdAt:
        data.createdAt?.toDate().toISOString() || new Date().toISOString(),
    } as ProductType;
  });
};

export const getProduct = async (id: string): Promise<ProductType | null> => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    // Convert Firestore timestamp to ISO string
    return {
      id: docSnap.id,
      ...data,
      createdAt:
        data.createdAt?.toDate().toISOString() || new Date().toISOString(),
    } as ProductType;
  } else {
    return null;
  }
};

// Orders
export const createOrder = async (
  order: Omit<OrderType, "id" | "createdAt">
) => {
  const ordersRef = collection(db, "orders");
  return addDoc(ordersRef, {
    ...order,
    createdAt: serverTimestamp(),
  });
};

export const getUserOrders = async (userId: string) => {
  const ordersRef = collection(db, "orders");
  const q = query(
    ordersRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
  }));
};
