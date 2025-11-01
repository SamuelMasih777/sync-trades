import express from "express";
import { Request, Response } from "express";
import brokerController from "../controllers/broker.controller.js";
const router = express();

router.post("/sync/:brokerName", async function (req: Request, res: Response) {
  const userId = req.body.userId;
  const brokerName = req.params.brokerName;
  const data = await brokerController.syncTrades(userId as string, brokerName as string);
  res.status(data.status).send(data);
});

router.get("/zerodha/callback", async function (req: Request, res: Response) {
  const data = await brokerController.zerodhaCallback(req);
  res.status(data.status).send(data);
});

export default router;
