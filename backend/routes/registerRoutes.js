import express from "express";
import { register } from "../controllers/registerController.js";

// Create a new 'room' or route
const router = express.Router();

// When a get request is made, call the function register -> which is imported from registerController.js
router.post("/", register)

// Export the room so server.js can use it
export default router;