// src/normalizers/interactiveBrokers.normalizer.ts
import { Trade } from "../types/trade.js";

export async function normalizeInteractiveTradeOrders(
  raw: unknown,
  meta?: { broker?: string }
): Promise<Trade[]> {

  const orders = Array.isArray((raw as any)?.orders)
    ? (raw as any).orders
    : Array.isArray(raw)
    ? (raw as any)
    : [];

  if (!orders.length) return [];

  const trades: Trade[] = [];

  orders.forEach((r: Record<string, any>) => {
    const orderId = String(r.orderId ?? r.id ?? `${r.account ?? "ibkr"}-${Math.random()}`);
    const symbol = String(r.ticker ?? r.description1 ?? r.companyName ?? "");
    const sideRaw = String(r.side ?? "").toUpperCase();
    const side = sideRaw === "SELL" ? "SELL" : "BUY";
    const qty = Number(r.filledQuantity ?? r.totalSize ?? 0);
    const price = Number(r.price ?? r.limitPrice ?? null);
    const exchange = String(r.exchange ?? r.listingExchange ?? "");
    const product = String(r.secType ?? "");
    const status = String(r.status ?? "").toUpperCase();

    let executedAt: string;
    if (r.lastExecutionTime_r) {
      executedAt = new Date(Number(r.lastExecutionTime_r)).toISOString();
    } else if (r.lastExecutionTime && /^\d{12}$/.test(r.lastExecutionTime)) {
      const ts = r.lastExecutionTime;
      const yy = 2000 + Number(ts.substring(0, 2));
      const MM = Number(ts.substring(2, 4)) - 1;
      const dd = Number(ts.substring(4, 6));
      const hh = Number(ts.substring(6, 8));
      const mm = Number(ts.substring(8, 10));
      const ss = Number(ts.substring(10, 12));
      executedAt = new Date(yy, MM, dd, hh, mm, ss).toISOString();
    } else {
      executedAt = new Date().toISOString();
    }

    const trade: Trade = {
      id: orderId,
      broker: meta?.broker ?? "interactivebrokers",
      symbol,
      quantity: qty,
      price: isNaN(price) ? null : price,
      side: side as "BUY" | "SELL",
      executedAt,
      orderId,
      exchange,
      product,
      averagePrice: isNaN(price) ? null : price,
      raw_data: r,
    };

    trades.push(trade);
  });

  return trades;
}
