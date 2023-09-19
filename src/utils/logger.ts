import fs from "fs";
import path from "path";
import { format } from "date-fns";

export class FileLogger {
  private filePath: string = "";

  constructor(folder: string) {
    const logsFolderPath = path.join(__dirname, folder);
    const loggerFilePath = path.join(logsFolderPath, "app.log");

    if (!fs.existsSync(logsFolderPath)) {
      fs.mkdirSync(logsFolderPath, { recursive: true });
    }

    this.filePath = loggerFilePath;
  }

  log(message: string) {
    const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const logMessage = `[${timestamp}] ${message}\n`;

    fs.appendFile(this.filePath, logMessage, (err) => {
      if (err) console.error("Error  writing the log file: ", err);
    });
  }
}
