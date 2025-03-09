// store/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItemType } from "@/lib/types";

interface CartState {
  items: CartItemType[];
  addItem: (item: Omit<CartItemType, "id">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.productId === newItem.productId
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.productId === newItem.productId
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { id: `cart-item-${Date.now()}`, ...newItem }],
          });
        }
      },

      removeItem: (productId) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.productId !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        const { items } = get();
        if (quantity < 1) {
          return get().removeItem(productId);
        }

        set({
          items: items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
