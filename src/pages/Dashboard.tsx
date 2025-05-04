
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cryptocurrency, fetchCryptocurrencies } from "@/services/cryptoApi";
import Header from "@/components/Header";
import CryptoTable from "@/components/CryptoTable";
import CryptoCard from "@/components/CryptoCard";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchCryptocurrencies(page);
      setCryptocurrencies(data);
      setIsLoading(false);
    };
    
    fetchData();
    
    // Set up polling for live updates
    const interval = setInterval(() => {
      fetchData();
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [page]);
  
  const handleSearch = (query: string) => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      
      <main className="container max-w-7xl mx-auto p-4 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Cryptocurrency Market</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Top Cryptocurrencies</h2>
          {isMobile ? (
            <div className="grid grid-cols-1 gap-4">
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-36 animate-pulse bg-muted rounded-md"></div>
                  ))
                : cryptocurrencies.slice(0, 10).map((crypto) => (
                    <CryptoCard key={crypto.id} crypto={crypto} />
                  ))}
            </div>
          ) : (
            <CryptoTable cryptocurrencies={cryptocurrencies} isLoading={isLoading} />
          )}
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span>Page {page}</span>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </main>
      
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-muted">
        <p>Data provided by CoinGecko API - Updated every minute</p>
      </footer>
    </div>
  );
};

export default Dashboard;
