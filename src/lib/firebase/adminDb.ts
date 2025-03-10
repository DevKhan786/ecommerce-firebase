// lib/firebase/adminDb.ts
import { adminDb } from "./admin";
import { CartItemType } from "../types";

// Define a proper type for shipping address
interface ShippingAddress {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  [key: string]: string | undefined; // Allow for additional fields
}

export const createOrderAdmin = async (orderData: {
  userId: string;
  items: CartItemType[];
  totalAmount: number;
  status: string;
  shippingAddress: ShippingAddress;
  paymentIntentId?: string;
}) => {
  try {
    console.log("Creating order with data:", JSON.stringify(orderData));

    const ordersRef = adminDb.collection("orders");
    const result = await ordersRef.add({
      ...orderData,
      createdAt: new Date(),
    });

    console.log("Order created with ID:", result.id);
    return { id: result.id };
  } catch (error) {
    console.error("Error creating order with admin:", error);
    throw error;
  }
};
