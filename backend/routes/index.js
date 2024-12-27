import express from "express";
export const router = express.Router();

// importing the controllers
import { homeController } from "../controllers/HomeController.js";
import { isUserSignedin } from "../middleware/Auth.js";
import {
  sendEmailController,
  sendSmsController,
  verifyOtpController,
} from "../controllers/OtpController.js";

// importing the routes
import { userRouter } from "./userRoutes.js";

router.get("/", isUserSignedin, homeController);
router.use("/users", userRouter);
router.post("/send-email", isUserSignedin, sendEmailController);
router.post("/send-sms", isUserSignedin, sendSmsController);
router.get("/verify-otp/:otp", isUserSignedin, verifyOtpController);
