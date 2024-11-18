import express from 'express';

export const router = express.Router();

// importing the controllers
import {homeController} from '../controllers/HomeController.js';

router.get('/', homeController);