// 📄 Main JavaScript file for BACKEND behaviour

// 📦 Import required modules
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import setupSwagger from './utils/swagger.js';

// 🔌 Import API routes
import timeRoutes from "./routes/timeRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import legalRoutes from './routes/legal.js';

// 🛠️ Import and run the DB connection (for initial connection test)
import "./config/database.js";

// 🧠 Convert ES module URL to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🚀 Initialize the Express app
const app = express();
const port = 3000;

// 🔀 Mount API routes
app.use(express.json());
app.use("/time", timeRoutes);
app.use('/auth', authRoutes);
app.use('/legal', legalRoutes);

// 📝 Setup Swagger
setupSwagger(app);

// 🌐 Serve frontend static files (HTML, CSS, JS)
// Any request to localhost will serve files from /frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));


// 🟢 Start the server
app.listen(port, () => {
  console.log(`✅ Server is running at: http://localhost:${port}`);
});
