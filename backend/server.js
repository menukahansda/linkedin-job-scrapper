import express from "express";
import { runAutomation } from "./automation.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/search-jobs", (req, res) => {
  runAutomation().catch(console.error);

  res.json({
    success: true,
    message: "Automation started in background",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Click http://localhost:" + PORT + " to access the server.");
  console.log("Press Ctrl+C to quit.");
});
