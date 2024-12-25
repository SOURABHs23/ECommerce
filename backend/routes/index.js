import express from "express";
import { userRouter } from "./userRoutes.js";
import { isUserSignedin } from "../middleware/Auth.js";

export const router = express.Router();

// importing the controllers
import { homeController } from "../controllers/HomeController.js";

router.get("/", isUserSignedin, homeController);
router.use("/users", userRouter);
