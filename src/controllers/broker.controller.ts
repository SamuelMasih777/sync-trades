import Result from "../utils/result.js";
import brokerService from "../services/broker.service.js";
import constants from "../utils/constants.js";
import zerodhaService from "../services/zerodha.service.js";
import config from "../utils/config.js";
// Controller for better error handling and response formatting
class brokerController {
  async syncTrades(userId: string, brokerName: string) {
    const res = new Result();
    try {
      const data = await brokerService.syncTrades(userId, brokerName);
      res.status = constants.httpStatus.success;
      res.data = data;
    } catch (error: any) {
      console.error(`Error in syncTrades: ${error}`);
      res.status = error.status || constants.httpStatus.serverError;
      res.message = error.message || config.messages.internalServerError;
    }
    return res;
  }
  async zerodhaCallback(req: any) {
    const res = new Result();
    try {
      const data = await zerodhaService.zerodhaCallback(req);
      res.status = constants.httpStatus.success;
      res.data = data;
    } catch (error: any) {
      console.error(`Error in zerodhaCallback: ${error}`);
      res.status = error.status || constants.httpStatus.serverError;
      res.message = error.message || config.messages.internalServerError;
    }
    return res;
  }
}
export default new brokerController();
