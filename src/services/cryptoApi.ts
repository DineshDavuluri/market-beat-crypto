
import { toast } from 'sonner';

export type Cryptocurrency = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string;
};

export type CoinDetail = {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string;
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
  };
}

export type HistoricalData = {
  prices: [number, number][];
};

// Base API URL
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Fetch top cryptocurrencies
export const fetchCryptocurrencies = async (page: number = 1, perPage: number = 25): Promise<Cryptocurrency[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
    toast.error('Failed to fetch cryptocurrency data. Please try again later.');
    return [];
  }
};

// Search cryptocurrencies by query
export const searchCryptocurrencies = async (query: string): Promise<Cryptocurrency[]> => {
  try {
    // First, get a list of all coins
    const response = await fetch(`${BASE_URL}/coins/list`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const allCoins = await response.json();
    
    // Filter coins by query (case insensitive)
    const filteredCoins = allCoins.filter(
      (coin: { id: string; name: string; symbol: string }) =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase()) ||
        coin.id.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 25); // Limit results
    
    if (filteredCoins.length === 0) {
      return [];
    }
    
    // Get detailed data for filtered coins
    const ids = filteredCoins.map((coin: { id: string }) => coin.id).join(',');
    const detailedResponse = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`
    );
    
    if (!detailedResponse.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await detailedResponse.json();
  } catch (error) {
    console.error('Error searching cryptocurrencies:', error);
    toast.error('Failed to search cryptocurrencies. Please try again later.');
    return [];
  }
};

// Fetch single cryptocurrency by ID
export const fetchCryptocurrencyById = async (id: string): Promise<CoinDetail | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching cryptocurrency ${id}:`, error);
    toast.error(`Failed to fetch details for ${id}. Please try again later.`);
    return null;
  }
};

// Fetch historical price data
export const fetchHistoricalData = async (id: string, days: number = 7): Promise<HistoricalData | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching historical data for ${id}:`, error);
    toast.error(`Failed to fetch chart data for ${id}. Please try again later.`);
    return null;
  }
};

// Format currency (USD)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
};

// Format large numbers with abbreviations
export const formatNumber = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toString();
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};
