import { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../utils/auth";

export const authenticateUserToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });
  }

  const decoded = authenticateToken(token);

  if (decoded === null) {
    return res.status(403).json({ message: "Invalid token" });
  }

  req.userId = decoded;
  if (!decoded) return res.status(403).json({ message: "Invalid token" });
  next();
};
