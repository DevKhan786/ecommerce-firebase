// lib/types.ts

export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  featured?: boolean;
  inventory: number;
  createdAt: string;
};

export type CartItemType = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type OrderType = {
  id: string;
  userId: string;
  items: CartItemType[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentIntentId?: string;
  createdAt: Date;
};
