import { createContext, useContext } from "react";

export const ProductContext = createContext({});

export const useProduct = () => useContext(ProductContext);

const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  return(
    <ProductContext.Provider value={{}}>
      {children}
    </ProductContext.Provider>
  )
};

export default ProductProvider