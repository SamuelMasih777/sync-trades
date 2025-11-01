// fetching and normalizing trades from different brokers
import { Trade } from "../types/trade.js";

export interface genericBrokerAdapter {
  fetchTrades(accessToken: string, params?: Record<string, unknown>): Promise<unknown[]>; 
  normalizeTrades(raw: unknown[], meta?: Record<string, unknown>): Promise<Trade[]>;
}
