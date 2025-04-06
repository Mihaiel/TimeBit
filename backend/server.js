import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// ROUTES
import timeRoutes from "./routes/timeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"
import "./config/db.js"; // ✅ this triggers the test connection

const app = express();
const port = 3000;

// Tell the app where to execute the routes code
app.use("/api/time", timeRoutes);
app.use("/api/dashboard", dashboardRoutes)

// Needed to use __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/*
  Serve static files (HTML, CSS, JS) from frontend
  This means that the main domain starts at frontend
  -> if we access localhost, we get to /frontend
 */
app.use(express.static(path.join(__dirname, "../frontend")));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
