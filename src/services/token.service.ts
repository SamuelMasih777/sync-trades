// TOken Service 
import constants from "../utils/constants.js";
import CustomError from "../utils/customError.js";
import config from "../utils/config.js";

type TokenRecord = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  broker: string;
};

const tokenStore = new Map<string, TokenRecord>();// storing in memory the tokens

class TokenService {
  // Save tokens for a user & broker
  saveToken( userId: string, broker: string, accessToken: string, refreshToken?: string, expiresInSeconds = 600) {
    const key = this.key(userId, broker);
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    tokenStore.set(key, { accessToken, refreshToken, expiresAt, broker });
  }
  async getAccessToken(userId: string, broker: string): Promise<string> {
    const key = this.key(userId, broker);
    const record = tokenStore.get(key);

    if (!record) {
      return await this.generateNewToken(userId, broker);
    }

    if (record.expiresAt > Date.now()) {
      return record.accessToken;
    }

    if (record.refreshToken) {
      const refreshed = await this.refresh(record.refreshToken, broker);
      this.saveToken(
        userId,
        broker,
        refreshed.accessToken,
        refreshed.refreshToken,
        refreshed.expiresIn
      );
      return refreshed.accessToken;
    }

    return await this.generateNewToken(userId, broker);
  }

  async generateNewToken(userId: string, broker: string): Promise<string> {
    switch (broker.toLowerCase()) {
      case config.zerodhaKite.name:
        // Zerodha token comes via callback
        throw new CustomError(
          "Zerodha tokens must be obtained via OAuth callback",
          constants.httpStatus.badRequest
        );
      default:
        // Simulate for others
        const accessToken = `access_${broker}_${Math.random()
          .toString(36)
          .slice(2, 10)}`;
        const refreshToken = `refresh_${broker}_${Math.random()
          .toString(36)
          .slice(2, 10)}`;
        this.saveToken(userId, broker, accessToken, refreshToken, 600);
        return accessToken;
    }
  }

  async refresh(
    refreshToken: string,
    broker: string
  ): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  }> {
    // just for Simulating network delay
    await new Promise((res) => setTimeout(res, 200));
    // for zerodha user have to re-authenticate via callback
    if (broker.toLowerCase() === config.zerodhaKite.name) {
      throw new CustomError('Zerodha tokens must be refreshed via OAuth callback', constants.httpStatus.badRequest);
    }
    return {
      accessToken: `access_${broker}_${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      refreshToken: `refresh_${broker}_${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      expiresIn: 600,
    };
  }

  key(userId: string, broker: string) {
    return `${userId}:${broker}`;
  }

  clear(userId: string, broker: string) {
    tokenStore.delete(this.key(userId, broker));
  }
}
export default new TokenService();
