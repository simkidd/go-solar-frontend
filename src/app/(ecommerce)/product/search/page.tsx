import SearchResultsComp from "../../components/SearchResultsComp";

const SearchResults = async ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {
  const query = searchParams.q;

  return (
    <div className="w-full font-dmsans">
      <section className="w-full">
        <SearchResultsComp query={query} />
      </section>
    </div>
  );
};

export default SearchResults;
