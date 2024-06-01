import { DeliveryDetails, Product } from "@/interfaces/product.interface";
import { toast } from "react-toastify";
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
        const isExisting = currentItems.find(
          (cartItem) => cartItem.product._id === product._id
        );

        if (isExisting) {
          return toast.info("Item already in cart");
        }
        set({ cartItems: [...currentItems, { product, qty, deliveryFee }] });
        toast.success("Cart successfully updated 🛒");
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
