import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";

// Create a new 'room' or route
const router = express.Router();

// When a get request is made, call the function getDashboardData -> which is imported from dashBoardController.js
router.get("/", getDashboardData)

// Export the room so server.js can use it
export default router;