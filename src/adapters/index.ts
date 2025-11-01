// src/adapters/index.ts
import { genericBrokerAdapter } from './generricBroker.adapter.js';
import zerodhaKiteAdapter from './zerodhaKite.adapter.js';
import alpacaAdapter from './alpaca.adapter.js';
// Index where all adapters can be registered as new ones are created currently i have implemented two
export const adapters: Record<string, genericBrokerAdapter> = {
  zerodha: zerodhaKiteAdapter,
  alpaca: alpacaAdapter,
};

export function getAdapter(brokerName: string): genericBrokerAdapter | undefined {
  return adapters[brokerName.toLowerCase()];
}
