// src/adapters/zerodhaKite.adapter.ts
import axios from "axios";
import { Trade } from "../types/trade.js";
import { normalizeZerodhaTrades } from "../normalizers/zerodhaKite.normalizer.js";
import config from "../utils/config.js";
import CustomError from "../utils/customError.js";
import constants from "../utils/constants.js";
import { sampleZerodhaTrades } from "../mocks/zerodhaKite.mock.js";
//  Zerodha Adapter to fetch trades using the access token for a user 
class ZerodhaAdapter {
  #name = config.zerodhaKite.name;
  #apiUrl = config.zerodhaKite.baseUrl;
  #apiKey = config.zerodhaKite.apiKey;

  async fetchTrades(accessToken: string): Promise<unknown[]> {
    try {
      if (!accessToken) {
        throw new CustomError("Missing Zerodha access token", constants.httpStatus.badRequest);
      }

      const response = await axios.get(`${this.#apiUrl}`, {
        headers: {
          "X-Kite-Version": "3",
          Authorization: `token ${this.#apiKey}:${accessToken}`,
        },
      });

      if (response.data.status !== "success") {
        console.error("Zerodha API returned failure:", response.data);
        throw new CustomError(
          `Zerodha API error: ${response.data.message || "Unknown error"}`,
          constants.httpStatus.serverError
        );
      }

      const trades = response.data.data || [];
      console.log(`Retrieved ${trades.length} trades from Zerodha`);
      return trades.length ? trades : sampleZerodhaTrades.data;
    } catch (error: any) {
      console.error("Error fetching Zerodha trades:", error.response?.data || error.message);
      throw new CustomError(
        `Failed to fetch Zerodha trades: ${error.response?.data?.message || error.message}`,
        constants.httpStatus.serverError
      );
    }
  }

  async normalizeTrades(raw: unknown[]): Promise<Trade[]> {
    return normalizeZerodhaTrades(raw, { broker: this.#name });
  }
}

export default new ZerodhaAdapter();
