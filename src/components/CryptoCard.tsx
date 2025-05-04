
import { Card, CardContent } from "@/components/ui/card";
import { Cryptocurrency, formatCurrency, formatNumber } from "@/services/cryptoApi";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";

interface CryptoCardProps {
  crypto: Cryptocurrency;
}

const CryptoCard = ({ crypto }: CryptoCardProps) => {
  const isPriceUp = crypto.price_change_percentage_24h > 0;

  return (
    <Link to={`/crypto/${crypto.id}`}>
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-bold">{crypto.name}</h3>
                <p className="text-muted-foreground text-sm uppercase">{crypto.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">{formatCurrency(crypto.current_price)}</p>
              <div className={`flex items-center text-sm ${isPriceUp ? 'text-positive' : 'text-negative'}`}>
                {isPriceUp ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                <span>
                  {crypto.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <p className="text-muted-foreground">Market Cap</p>
              <p className="font-medium">{formatCurrency(crypto.market_cap)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Volume (24h)</p>
              <p className="font-medium">{formatCurrency(crypto.total_volume)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CryptoCard;
