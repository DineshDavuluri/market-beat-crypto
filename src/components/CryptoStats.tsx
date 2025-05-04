
import { Card, CardContent } from "@/components/ui/card";
import { CoinDetail, formatCurrency, formatNumber } from "@/services/cryptoApi";
import { ArrowDown, ArrowUp, Bitcoin, ChartBar, ChartLine, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CryptoStatsProps {
  data: CoinDetail | null;
  isLoading: boolean;
}

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

const SkeletonStatCard = () => (
  <Card>
    <CardContent className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-32 mt-2" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </CardContent>
  </Card>
);

const CryptoStats = ({ data, isLoading }: CryptoStatsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const currentPrice = data.market_data.current_price.usd;
  const marketCap = data.market_data.market_cap.usd;
  const priceChange24h = data.market_data.price_change_percentage_24h;
  const priceChange7d = data.market_data.price_change_percentage_7d;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Current Price"
        value={formatCurrency(currentPrice)}
        icon={<DollarSign />}
      />
      <StatCard
        title="Market Cap"
        value={formatCurrency(marketCap)}
        icon={<ChartBar />}
      />
      <StatCard
        title="24h Change"
        value={`${priceChange24h?.toFixed(2)}%`}
        icon={
          priceChange24h >= 0 ? (
            <TrendingUp className="text-positive" />
          ) : (
            <TrendingDown className="text-negative" />
          )
        }
      />
      <StatCard
        title="7d Change"
        value={`${priceChange7d?.toFixed(2)}%`}
        icon={
          priceChange7d >= 0 ? (
            <TrendingUp className="text-positive" />
          ) : (
            <TrendingDown className="text-negative" />
          )
        }
      />
    </div>
  );
};

export default CryptoStats;
