// 📄 Main JavaScript file for BACKEND behaviour

// 📦 Import required modules
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// 🔌 Import API routes
import timeRoutes from "./routes/timeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import registerRoutes from "./routes/registerRoutes.js"

// 🛠️ Import and run the DB connection (for initial connection test)
import "./config/db.js";

// 🧠 Convert ES module URL to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🚀 Initialize the Express app
const app = express();
const port = 3000;

// 🔀 Mount API routes
app.use("/time", timeRoutes);
app.use("/dashboard", dashboardRoutes);
app.use('/register', registerRoutes);

// 🌐 Serve frontend static files (HTML, CSS, JS)
// Any request to localhost will serve files from /frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// 🟢 Start the server
app.listen(port, () => {
  console.log(`✅ Server is running at: http://localhost:${port}`);
});
