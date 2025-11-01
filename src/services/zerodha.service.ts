import tokenService from "./token.service.js";
import CustomError from "../utils/customError.js";
import constants from "../utils/constants.js";
import config from "../utils/config.js";
import crypto from "crypto";
import axios from "axios";

class zerodhaService {
  // handles the OAuth callback from zerodha when user is logged in
  async zerodhaCallback(req: any): Promise<any> {
    const { request_token } = req.query;
    const userId = "user123"; // just for testing purpose i kept assumption
    if (!request_token) {
      throw new CustomError(
        "request_token is required",
        constants.httpStatus.badRequest
      );
    }
    const apiKey = config.zerodhaKite.apiKey;
    const apiSecret = config.zerodhaKite.apiSecret;

    const checksum = crypto
      .createHash("sha256")
      .update(apiKey + request_token + apiSecret)
      .digest("hex");

    const payload = new URLSearchParams({
      api_key: config.zerodhaKite.apiKey,
      request_token: request_token,
      checksum,
    });

    const response = await axios.post(
      `${config.zerodhaKite.sessionUrl}`,
      payload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data;

    if (data.status !== "success") {
      throw new CustomError(
        "Failed to exchange request_token for access_token",
        constants.httpStatus.serverError
      );
    }

    const { access_token, refresh_token } = data.data;
    tokenService.saveToken(
      userId,
      config.zerodhaKite.name,
      access_token,
      refresh_token,
      600
    );
    return { access_token, refresh_token };
  }
}

export default new zerodhaService();
