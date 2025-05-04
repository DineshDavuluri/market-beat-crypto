
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Cryptocurrency, searchCryptocurrencies } from "@/services/cryptoApi";
import CryptoTable from "@/components/CryptoTable";
import CryptoCard from "@/components/CryptoCard";
import { useIsMobile } from "@/hooks/use-mobile";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<Cryptocurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const data = await searchCryptocurrencies(query);
      setResults(data);
      setIsLoading(false);
    };

    fetchResults();
  }, [query]);

  const handleSearch = (newQuery: string) => {
    navigate(`/search?query=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />

      <main className="container max-w-7xl mx-auto p-4 flex-grow">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Search Results</h1>
          <p className="text-muted-foreground">
            {isLoading
              ? `Searching for "${query}"...`
              : results.length > 0
              ? `Found ${results.length} results for "${query}"`
              : `No results found for "${query}"`}
          </p>
        </div>

        {results.length > 0 ? (
          isMobile ? (
            <div className="grid grid-cols-1 gap-4">
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-36 animate-pulse bg-muted rounded-md"></div>
                  ))
                : results.map((crypto) => (
                    <CryptoCard key={crypto.id} crypto={crypto} />
                  ))}
            </div>
          ) : (
            <CryptoTable cryptocurrencies={results} isLoading={isLoading} />
          )
        ) : !isLoading && (
          <div className="text-center p-8 border border-dashed rounded-md">
            <p className="text-muted-foreground mb-4">No cryptocurrencies found matching your search.</p>
            <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
          </div>
        )}
      </main>

      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-muted">
        <p>Data provided by CoinGecko API</p>
      </footer>
    </div>
  );
};

export default SearchResults;
