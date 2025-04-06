import express from "express";
import { getTimeEntries } from "../controllers/timeController.js";

// Create a new 'room' or route
const router = express.Router();

// When a get request is made, call the function getTimeEntries -> which is imported from timeController.js
router.get("/", getTimeEntries);

// Export the room so server.js can use it
export default router;