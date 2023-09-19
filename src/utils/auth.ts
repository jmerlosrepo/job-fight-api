import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PasswordValidation } from "../types/auth";
import { User } from "../types/user";
import { RegisterResult } from "../types/registerResult";

const secretKey = process.env.SECRET_KEY || "default-secret-key";

const saltRounds = 10;

export const encryptPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const compareUserPassword = async (
  userPasswordFromForm: string,
  storedPasswordInDb: string
): Promise<PasswordValidation> => {
  const response: PasswordValidation = { isValid: false };
  try {
    const passwordMatch = await bcrypt.compare(
      userPasswordFromForm,
      storedPasswordInDb
    );
    if (passwordMatch) {
      response.isValid = true;
    }
  } catch (err) {
    response.err = "Invalid credentials";
  }
  return response;
};

export const authenticateToken = (token: string): number | null => {
  try {
    const decoded: jwt.JwtPayload = jwt.verify(
      token,
      secretKey
    ) as jwt.JwtPayload;
    return decoded.id as number;
  } catch (err) {
    return null;
  }
};

export const generateToken = async (
  userInput: User
): Promise<RegisterResult> => {
  const result: RegisterResult = { message: "" };

  const { username, id } = userInput;

  userInput.username = username;
  userInput.id = id;

  result.userId = id;
  result.username = username;
  result.token = jwt.sign(userInput, secretKey, { expiresIn: "1h" });

  return result;
};
