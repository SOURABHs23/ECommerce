import express from "express";
import cookieParser from "cookie-parser";
const app = express();
const PORT = 3000;

// import the config files
import "./config/mongodb.js";

// importing the routes
import { router } from "./routes/index.js";

app.use(express.json());
app.use(cookieParser());
// Define a simple route
app.use("/", router);

// everything that starts with / means every possible API route

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
