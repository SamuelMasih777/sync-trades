import { Trade } from "../types/trade.js";
import { normalizeAlpacaTradeOrders } from "../normalizers/alpaca.normalizer.js";
import config from "../utils/config.js";
import axios from "axios";
import { sampleAlpacaOrders } from "../mocks/alpaca.mock.js";
import constants from "../utils/constants.js";
import CustomError from "../utils/customError.js";
// Alpaca Adapter to fetch the trades here access token is not required the api key and secret is sufficient
class AlpacaAdapter {
  #name = config.alpaca.name;
  #apiUrl = config.alpaca.baseUrl;
  #apiKey = config.alpaca.apiKey;
  #apiSecret = config.alpaca.apiSecret;

  async fetchTrades(accessToken?: string): Promise<unknown[]> {
     try {

      const response = await axios.get(`${this.#apiUrl}`, {
        headers: {
          "APCA-API-KEY-ID": this.#apiKey,
          "APCA-API-SECRET-KEY": this.#apiSecret,
          accept: "application/json",
        },
      });

      if (!Array.isArray(response.data) || response.data.length === 0) {
        console.warn("No Alpaca trades found. Using mock data...");
        return sampleAlpacaOrders;
      }

      return response.data;
    } catch (error: any) {
      console.error("Error fetching Alpaca trades:", error.response?.data || error.message);
      throw new CustomError(
        `Failed to fetch Alpaca trades: ${error.response?.data?.message || error.message}`,
        constants.httpStatus.serverError
      );
    }
  }

  async normalizeTrades(raw: unknown[]): Promise<Trade[]> {
    return normalizeAlpacaTradeOrders(raw, { broker: this.#name });
  }
}

export default new AlpacaAdapter();
