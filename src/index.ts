//Basic Server Setup 
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import brokerRouter from "./routers/broker.router.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Guys!");
});

app.use("/api/v1/broker", brokerRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});