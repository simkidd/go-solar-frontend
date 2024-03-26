import { Metadata } from "next";
import React from "react";

const pageTitle = "Products";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const ProductsPage = () => {
  return <div>ProductsPage</div>;
};

export default ProductsPage;
