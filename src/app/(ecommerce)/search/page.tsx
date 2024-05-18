import React from "react";
import SearchResultList from "../components/SearchResultList";
import { getProducts } from "@/lib/data";
import { Product } from "@/interfaces/product.interface";

const SearchResults = async ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {
  const products: Product[] = await getProducts();
  // const searchedProducts = await getSearchedProducts(params.query);

  const decodedQuery = decodeURIComponent(searchParams.q);

  return (
    <div className="px-10 py-5">
      <p className="text-heading3-bold my-10">
        Search results for {decodedQuery}
      </p>
      <div>
        <SearchResultList query={decodedQuery} products={products} />
      </div>
    </div>
  );
};

export default SearchResults;
