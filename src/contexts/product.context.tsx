import {
  CreateCategoryInput,
  CreateProductInput,
} from "@/interfaces/product.interface";
import { createContext, useContext, useState } from "react";
import { axiosInstance } from "@/lib/axios";

interface IProduct {
  loading: boolean;
  createProduct: (formData: FormData, config: any) => Promise<void>;
  createCategory: (input: CreateCategoryInput) => Promise<void>;
}

export const ProductContext = createContext<IProduct>({} as IProduct);

export const useProduct = () => useContext(ProductContext);

const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  // create product
  const createProduct = async (formData: FormData, config: any) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        "/admin/add-product",
        formData,
        config
      );

      if (data) {
        alert(data.message);
      }
    } catch (error) {
      const errorMsg = error as any;
      alert(errorMsg?.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // create category
  const createCategory = async (input: CreateCategoryInput) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        "/admin/create-category",
        input
      );

      if (data) {
        alert(data.message);
      }
    } catch (error) {
      const errorMsg = error as any;
      alert(errorMsg?.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{ loading, createProduct, createCategory }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
