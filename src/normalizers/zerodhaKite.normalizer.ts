import { Trade } from "../types/trade.js";

export async function normalizeZerodhaTrades(
  raw: unknown[],
  meta?: { broker?: string }
): Promise<Trade[]> {
  if (!Array.isArray(raw)) return [];

  return raw.map((r) => {
    const o = r as Record<string, any>;

    // some brokers use different field names
    const id = String(o.trade_id ?? o.tradeId ?? o.id ?? `${o.order_id ?? 'unknown'}-${Math.random()}`);
    const side = (o.transaction_type ?? o.side ?? 'BUY') as 'BUY' | 'SELL';
    const quantity = Number(o.quantity ?? o.qty ?? 0);
    const average_price = o.average_price ?? o.price ?? null;
    const tsRaw = o.fill_timestamp ?? o.exchange_timestamp ?? o.order_timestamp;
    const executedAt = tsRaw ? new Date(tsRaw).toISOString() : new Date().toISOString();

    const trade: Trade = {
      id,
      broker: meta?.broker ?? 'zerodha',
      symbol: String(o.tradingsymbol ?? o.symbol ?? ''),
      quantity,
      price: average_price !== undefined ? Number(average_price) : null,
      side: side as 'BUY' | 'SELL',
      executedAt,
      orderId: String(o.order_id ?? o.exchange_order_id ?? ''),
      exchange: o.exchange,
      product: o.product,
      averagePrice: average_price !== undefined ? Number(average_price) : null,
      raw_data: o,
    };

    return trade;
  });
}
