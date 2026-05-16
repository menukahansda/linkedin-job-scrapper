import express from "express";
import { runAutomation } from "./automation.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/search-jobs", async (req, res) => {
  console.log("Request received");

  try {
    console.log("Starting automation");

    const result = await runAutomation();

    console.log("Automation finished");
    console.log("Result:", result);

    res.json({
      success: true,
      data: result,
    });

    console.log("Response sent");
  } catch (err) {
    console.log("Error occurred");
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Click http://localhost:" + PORT + " to access the server.");
  console.log("Press Ctrl+C to quit.");
});
