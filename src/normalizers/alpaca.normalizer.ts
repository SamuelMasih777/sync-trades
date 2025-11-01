import { Trade } from "../types/trade.js";

export async function normalizeAlpacaTradeOrders(
  raw: unknown[],
  meta?: { broker?: string }
): Promise<Trade[]> {
  if (!Array.isArray(raw)) return [];

  const trades: Trade[] = [];

  raw.forEach((r) => {
    const o = r as Record<string, any>;
    const status = o.status ?? '';
    const filledQty = Number(o.filled_qty ?? o.filledQty ?? 0);
    const executedAt = o.filled_at ? new Date(o.filled_at).toISOString() : o.submitted_at ? new Date(o.submitted_at).toISOString() : new Date().toISOString();

    const trade: Trade = {
      id: String(o.id ?? o.order_id ?? `${o.client_order_id ?? 'alpaca'}-${Math.random()}`),
      broker: meta?.broker ?? 'alpaca',
      symbol: String(o.symbol ?? ''),
      quantity: filledQty,
      price: o.filled_avg_price ? Number(o.filled_avg_price) : null,
      side: (o.side ?? 'buy') as 'buy' | 'sell',
      executedAt,
      orderId: String(o.id ?? o.client_order_id ?? ''),
      exchange: undefined,
      product: undefined,
      averagePrice: o.filled_avg_price ? Number(o.filled_avg_price) : null,
      raw_data: o,
    };

    trades.push(trade);
  });

  return trades;
}
