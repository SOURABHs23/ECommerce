import express from "express";
export const router = express.Router();

// importing the controllers
import { homeController } from "../controllers/HomeController.js";
import { isUserSignedin } from "../middleware/Auth.js";

// importing the routes
import { smsRouter } from "./sms.js";
import { emailRouter } from "./email.js";
import { userRouter } from "./userRoutes.js";

router.get("/", isUserSignedin, homeController);
router.use("/users", userRouter);
router.use("/send-email", isUserSignedin, emailRouter);
router.use("/send-sms", isUserSignedin, smsRouter);
