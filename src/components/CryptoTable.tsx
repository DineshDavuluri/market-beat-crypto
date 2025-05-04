
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cryptocurrency, formatCurrency, formatNumber } from "@/services/cryptoApi";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface CryptoTableProps {
  cryptocurrencies: Cryptocurrency[];
  isLoading: boolean;
}

const CryptoTable = ({ cryptocurrencies, isLoading }: CryptoTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h Change</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">Volume (24h)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-12 mt-1" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : (
            cryptocurrencies.map((crypto) => {
              const isPriceUp = crypto.price_change_percentage_24h > 0;
              return (
                <TableRow key={crypto.id}>
                  <TableCell>{crypto.market_cap_rank}</TableCell>
                  <TableCell>
                    <Link to={`/crypto/${crypto.id}`} className="flex items-center space-x-2 hover:text-accent">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-muted-foreground text-xs uppercase">
                          {crypto.symbol}
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(crypto.current_price)}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      isPriceUp ? "text-positive" : "text-negative"
                    }`}
                  >
                    <div className="flex items-center justify-end">
                      {isPriceUp ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {crypto.price_change_percentage_24h?.toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(crypto.market_cap)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(crypto.total_volume)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CryptoTable;
