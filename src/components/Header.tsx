
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bitcoin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-crypto-bg border-b border-muted p-4">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="p-0 mr-2" 
              onClick={() => navigate("/")}
            >
              <Bitcoin className="h-6 w-6 text-accent mr-2" />
              <h1 className="font-bold text-xl">CryptoTracker</h1>
            </Button>
          </div>

          <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
