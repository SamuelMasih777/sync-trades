// model to manage some configurations
import "dotenv/config";

class Config {
  zerodhaKite: {
    name: string;
    apiKey: string;
    apiSecret: string;
    baseUrl: string;
    loginUrl: string;
    sessionUrl: string;
  };
  alpaca: {
    name: string;
    apiKey: string;
    apiSecret: string;
    baseUrl: string;
  };
  interactive: {
    name: string;
    baseOrderUrl: string;
    baseTradesUrl: string;
    baseAccountInfoUrl: string;
  };
  messages:{
    internalServerError: string;
  }

  constructor() {
    this.zerodhaKite = {
      name: "zerodha",
      apiKey: process.env.ZERODHA_API_KEY || "",
      apiSecret: process.env.ZERODHA_API_SECRET || "",
      baseUrl: "https://api.kite.trade/trades",
      loginUrl: `https://kite.zerodha.com/connect/login`,
      sessionUrl: `https://api.kite.trade/session/token`,
    };
    this.alpaca = {
      name: "alpaca",
      apiKey: process.env.ALPACA_API_KEY || "",
      apiSecret: process.env.ALPACA_API_SECRET || "",
      baseUrl: "https://paper-api.alpaca.markets/v2/orders",
    };
    this.interactive = {
      name: "interactive",
      baseOrderUrl: "https://localhost:5000/v1/api/iserver/account/orders",
      baseTradesUrl: "https://localhost:5000/v1/api/iserver/account/trades",
      baseAccountInfoUrl: "https://localhost:5000/v1/api/portfolio/accounts",
    };
    this.messages={
      internalServerError: "Internal Server Error"
    }
  }
  getZerodhaLoginUrl(): string {
    return `${this.zerodhaKite.loginUrl}?v=3&api_key=${this.zerodhaKite.apiKey}`;
  }
}
export default new Config();
