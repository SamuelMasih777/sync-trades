export type Side = 'BUY' | 'SELL' | 'buy' | 'sell';

// Normal Trade Interface which will be common across brokers
export interface Trade {
  id: string;
  broker: string;
  symbol: string;          
  quantity: number;        
  price: number | null;
  side: Side;
  executedAt: string;
  orderId?: string;
  exchange?: string;
  product?: string;
  averagePrice?: number | null;
  raw_data?: Record<string, unknown>;
}
