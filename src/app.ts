import express from "express";
import cors from "cors";

import user from "./routes/user";
import fighter from "./routes/fighter";

import { FileLogger } from "./utils/logger";

const app = express();
const PORT = process.env.APP_PORT || 5000;

const logger = new FileLogger("../logs");

logger.log("Application started");

app.use(cors());
app.use(express.json());

app.use("/user", user);
app.use("/fighter", fighter);

app.listen(PORT, () => {
  logger.log(`Server is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});
