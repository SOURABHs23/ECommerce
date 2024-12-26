import express from "express";

import { sendEmailController } from "../controllers/EmailController.js";

export const emailRouter = express.Router();

emailRouter.post("/", sendEmailController);
