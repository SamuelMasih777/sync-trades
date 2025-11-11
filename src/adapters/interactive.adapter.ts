import { Trade } from "../types/trade.js";
import { normalizeInteractiveTradeOrders } from "../normalizers/interactive.normalizer.js";
import config from "../utils/config.js";
import axios from "axios";
import { interactiveOrder } from "../mocks/interactive.mock.js";
import constants from "../utils/constants.js";
import CustomError from "../utils/customError.js";
import https from "https";
// Interactive Adapter to fetch the Orders/trades here access token is not required because of login is done manually
class InteractiveAdapter {
  #name = config.interactive.name;
  #orderUrl = config.interactive.baseOrderUrl;
  #tradeUrl = config.interactive.baseTradesUrl; // for trades on my Account there is not any trades due to paper account I was getting empty array so i used the orders response and normalized it.

  async fetchTrades(accessToken?: string): Promise<unknown[]> {
    try {
      const response = await axios.get(`${this.#orderUrl}`, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        withCredentials: true,
      });

      const orders = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.orders)
        ? response.data.orders
        : [];

      if (!orders.length) {
        console.log("No Interactive orders found. Using mock data...");
        return interactiveOrder;
      }

      return orders;
    } catch (error: any) {
      console.error(
        "Error fetching Interactive trades:",
        error.response?.data || error.message
      );
      throw new CustomError(
        `Failed to fetch Interactive trades: ${
          error.response?.data?.message || error.message
        }`,
        constants.httpStatus.serverError
      );
    }
  }

  async normalizeTrades(raw: unknown[]): Promise<Trade[]> {
    return normalizeInteractiveTradeOrders(raw, { broker: this.#name });
  }
}

export default new InteractiveAdapter();
