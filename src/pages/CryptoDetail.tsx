
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CoinDetail, HistoricalData, fetchCryptocurrencyById, fetchHistoricalData } from "@/services/cryptoApi";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import PriceChart from "@/components/PriceChart";
import CryptoStats from "@/components/CryptoStats";
import { format } from "date-fns";
import { toast } from "sonner";

type TimeFrame = '7d' | '30d' | '90d' | '1y';

const CryptoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [historicalData, setHistoricalData] = useState<{ date: string; price: number }[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('7d');

  useEffect(() => {
    const fetchCoin = async () => {
      if (!id) return;
      setIsLoading(true);
      const data = await fetchCryptocurrencyById(id);
      setCoin(data);
      setIsLoading(false);
    };

    fetchCoin();

    // Set up polling for live updates
    const interval = setInterval(() => {
      fetchCoin();
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const fetchChart = async () => {
      if (!id) return;
      setChartLoading(true);

      let days: number;
      switch (timeFrame) {
        case '30d':
          days = 30;
          break;
        case '90d':
          days = 90;
          break;
        case '1y':
          days = 365;
          break;
        default:
          days = 7;
      }

      const data = await fetchHistoricalData(id, days);
      if (data && data.prices) {
        // Format the data for the chart
        const formattedData = data.prices.map(([timestamp, price]) => ({
          date: format(new Date(timestamp), 'MMM d'),
          price,
        }));
        
        setHistoricalData(formattedData);
      } else {
        setHistoricalData(null);
      }
      
      setChartLoading(false);
    };

    fetchChart();
  }, [id, timeFrame]);

  const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container max-w-7xl mx-auto p-4 flex-grow">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        
        {isLoading ? (
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-24 mt-2" />
              </div>
            </div>
            <Skeleton className="h-40 w-full mb-8" />
          </div>
        ) : coin ? (
          <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={coin.image.large}
                  alt={coin.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h1 className="text-3xl font-bold">{coin.name}</h1>
                  <p className="text-xl text-muted-foreground uppercase">{coin.symbol}</p>
                </div>
              </div>
              
              {coin.market_data.price_change_percentage_24h !== undefined && (
                <div className={`flex items-center text-lg ${
                  coin.market_data.price_change_percentage_24h >= 0
                    ? 'text-positive'
                    : 'text-negative'
                }`}>
                  {coin.market_data.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="mr-1" />
                  ) : (
                    <TrendingDown className="mr-1" />
                  )}
                  {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                </div>
              )}
            </div>

            <CryptoStats data={coin} isLoading={isLoading} />

            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Price Chart</h2>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant={timeFrame === '7d' ? 'default' : 'outline'} 
                    onClick={() => handleTimeFrameChange('7d')}
                  >
                    7D
                  </Button>
                  <Button 
                    size="sm" 
                    variant={timeFrame === '30d' ? 'default' : 'outline'} 
                    onClick={() => handleTimeFrameChange('30d')}
                  >
                    30D
                  </Button>
                  <Button 
                    size="sm" 
                    variant={timeFrame === '90d' ? 'default' : 'outline'} 
                    onClick={() => handleTimeFrameChange('90d')}
                  >
                    90D
                  </Button>
                  <Button 
                    size="sm" 
                    variant={timeFrame === '1y' ? 'default' : 'outline'} 
                    onClick={() => handleTimeFrameChange('1y')}
                  >
                    1Y
                  </Button>
                </div>
              </div>
              
              <PriceChart 
                data={historicalData} 
                title={`${coin.name} Price (${timeFrame})`} 
                isLoading={chartLoading} 
              />
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">About {coin.name}</h2>
              <div 
                className="prose prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: coin.description.en }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Cryptocurrency not found</h2>
            <p className="text-muted-foreground">The cryptocurrency you are looking for does not exist or could not be loaded.</p>
          </div>
        )}
      </main>
      
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-muted">
        <p>Data provided by CoinGecko API - Updated every minute</p>
      </footer>
    </div>
  );
};

export default CryptoDetail;
