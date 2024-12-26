import express from "express";

import { sendSmsController } from "../controllers/SMSController.js";

export const smsRouter = express.Router();

smsRouter.get("/", sendSmsController);
