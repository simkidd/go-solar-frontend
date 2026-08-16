import { DeliveryDetails, Product } from "@/interfaces/product.interface";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartItem {
  product: Product;
  qty: number;
  deliveryFee: number;
}

interface CartStore {
  loading: boolean;
  cartItems: CartItem[];
  addItem: (data: CartItem) => void;
  addItems: (items: CartItem[]) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: (data: DeliveryDetails) => void;
  totalPricePaid: number;
  setTotalPricePaid: (value: number) => void;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  paymentData: string;
  setPaymentData: (data: string) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const useCartStore = create(
  persist<CartStore>(
    (set, get) => ({
      loading: false,
      cartItems: [],
      deliveryDetails: {
        suiteNumber: "",
        streetAddress: "",
        city: "",
        zipCode: "",
      },
      setDeliveryDetails: (deliveryDetails: DeliveryDetails) =>
        set({ deliveryDetails }),
      totalPricePaid: 0,
      setTotalPricePaid: (totalPricePaid: number) => set({ totalPricePaid }),
      paymentMethod: "",
      setPaymentMethod: (paymentMethod: string) => set({ paymentMethod }),
      paymentData: "",
      setPaymentData: (data: string) => set({ paymentData: data }),
      currentStep: 1,
      setCurrentStep: (step: number) => set({ currentStep: step }),

      // add an item to cart
      addItem: (data: CartItem) => {
        const { product, qty, deliveryFee } = data;
        const currentItems = get().cartItems; //all items already in cart
        const existingIndex = currentItems.findIndex(
          (cartItem) => cartItem.product._id === product._id
        );

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const currentQty = updatedItems[existingIndex].qty;
          const maxStock = product.quantityInStock || 10;
          const newQty = Math.min(currentQty + qty, maxStock);

          if (newQty === currentQty) {
            toast.info(`${product.name} is already in cart at maximum available stock.`);
            return;
          }

          updatedItems[existingIndex].qty = newQty;
          set({ cartItems: updatedItems });
          toast.success(`Updated ${product.name} quantity in cart 🛒`);
          return;
        }
        set({ cartItems: [...currentItems, { product, qty, deliveryFee }] });
        toast.success("Added to cart 🛒");
      },

      // add multiple items to cart (batch operation for packages)
      addItems: (items: CartItem[]) => {
        const currentItems = [...get().cartItems];
        let changed = false;

        items.forEach((item) => {
          const { product, qty, deliveryFee } = item;
          const existingIndex = currentItems.findIndex(
            (cartItem) => cartItem.product._id === product._id
          );

          if (existingIndex > -1) {
            const currentQty = currentItems[existingIndex].qty;
            const maxStock = product.quantityInStock || 10;
            const newQty = Math.min(currentQty + qty, maxStock);
            if (newQty !== currentQty) {
              currentItems[existingIndex].qty = newQty;
              changed = true;
            }
          } else {
            currentItems.push({ product, qty, deliveryFee });
            changed = true;
          }
        });

        if (changed) {
          set({ cartItems: currentItems });
          toast.success("Cart successfully updated 🛒");
        } else {
          toast.info("All items are already in your cart at maximum available stock.");
        }
      },
      // remove item from cart
      removeItem: (id: string) => {
        const newCartItems = get().cartItems.filter(
          (cartItem) => cartItem.product._id !== id
        );
        set({ cartItems: newCartItems });
        toast.success("Product was removed from cart");
      },
      // increase item quantity in cart
      increaseQuantity: (id: string) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.product._id === id
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
        set({ cartItems: newCartItems });
        toast.success("Cart successfully updated 🛒");
      },
      // decrease item quantity in cart
      decreaseQuantity: (id: string) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.product._id === id
            ? { ...cartItem, qty: cartItem.qty - 1 }
            : cartItem
        );
        set({ cartItems: newCartItems });
        toast.success("Cart successfully updated 🛒");
      },

      clearCart: () => set({ cartItems: [] }),
    }),
    { name: "_goSolar-cart", storage: createJSONStorage(() => localStorage) }
  )
);

export default useCartStore;
