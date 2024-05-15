import React from "react";

const SearchResults = async ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {
  // const searchedProducts = await getSearchedProducts(params.query);

  const decodedQuery = decodeURIComponent(searchParams.q);

  return (
    <div className="px-10 py-5">
      <p className="text-heading3-bold my-10">
        Search results for {decodedQuery}
      </p>
      {/* {!searchedProducts ||
        (searchedProducts.length === 0 && (
          <p className="text-body-bold my-5">No result found</p>
        ))}
      <div className="flex flex-wrap justify-between gap-16">
        {searchedProducts?.map((product: ProductType) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div> */}
    </div>
  );
};

export default SearchResults;
