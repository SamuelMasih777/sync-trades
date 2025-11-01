import { adapters } from "../adapters/index.js";
import tokenService from "./token.service.js";
import { Trade } from "../types/trade.js";
import CustomError from "../utils/customError.js";
import constants from "../utils/constants.js";
//Service for Broker Related Syncing
class BrokerService {
  getAdapter(brokerName: string) {
    const adapter = adapters[brokerName.toLowerCase()];
    if (!adapter)
      throw new CustomError(`Adapter not found for broker ${brokerName}`, constants.httpStatus.notFound);
    return adapter;
  }

  async syncTrades(userId: string, brokerName: string): Promise<Trade[]> {
    if (!userId) throw new CustomError("userId is required", constants.httpStatus.badRequest);
    if (!brokerName) throw new CustomError("brokerName is required", constants.httpStatus.badRequest);

    const adapter = this.getAdapter(brokerName);
    console.log(`Using adapter for broker: ${brokerName}`);

    // get access token (throws if not available or cannot refresh)
    const accessToken = await tokenService.getAccessToken(userId, brokerName);
    // const accessToken = 'yRxVirML509BiCEWxS0qPSNyCDz52TQc' // actual access token used for testing zerodha api

    // fetch raw trades from adapter
    const raw = await adapter.fetchTrades(accessToken);

    if (!raw || (Array.isArray(raw) && raw.length === 0)) {
      return [];
    }

    const normalized = await adapter.normalizeTrades(raw);
    return normalized;
  }
}

export default new BrokerService();
