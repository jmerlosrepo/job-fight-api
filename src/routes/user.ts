import { Router, Request, Response } from "express";
import pool from "../utils/db";
import { FileLogger } from "../utils/logger";
import { encryptPassword, generateToken } from "../utils/auth";
import { check, validationResult } from "express-validator";

const validateRegistration = [
  check("username").notEmpty().isLength({ min: 5 }).trim().escape(),
  check("password").notEmpty().isLength({ min: 8 }).trim(),
];

const router = Router();

const fileLogger = new FileLogger("../logs");

router.get("/", (req: Request, res: Response) => {
  fileLogger.log("User endpoint reached");
  res.status(200).send("user end point");
});

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const encryptedPassword = await encryptPassword(password);

    pool.query(
      `CALL find_job_fight_user(?, ?)`,
      [username, encryptedPassword],
      (error, results) => {
        if (error) {
          fileLogger.log(
            `Something went wrong when calling find_job_fight_user(?, ?)`
          );
          console.error(error);
          res.status(500).json({ error: "Something went wrong!" });
          return;
        }
        fileLogger.log("called find_job_fight_user(?, ?)");

        generateToken(req.body)
          .then((token) => {
            console.log("TOKEN", token);
            res.json(token);
          })
          .catch((error) => res.status(500).send(error));
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/register-new-user", async (req: Request, res: Response) => {
  const {
    categoryId,
    firstName,
    lastName,
    email,
    phone,
    username,
    profilePic,
    password,
  } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const encryptedPassword = await encryptPassword(password);
    let userExists = false;

    // Find the user by username
    pool.query(
      `CALL find_job_fight_user_by_username_or_email(?, ?)`,
      [username, email],
      (error, results) => {
        if (error) {
          fileLogger.log(
            `Something went wrong when calling find_job_fight_user_by_username_or_email(?, ?)`
          );
          console.error(error);
          res.status(500).json({ error: "Something went wrong!" });
          return;
        }
        fileLogger.log("called find_job_fight_user_by_username_or_email(?, ?)");
        results[0].length > 0 ? (userExists = true) : (userExists = false);
      }
    );

    if (userExists) {
      fileLogger.log(`Username ${username} or email ${email} already exists`);
      return res.status(409).json({ error: "Username already exists" });
    }

    pool.query(
      `CALL add_job_fight_user(?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        categoryId,
        firstName,
        lastName,
        email,
        phone,
        username,
        profilePic,
        encryptedPassword,
      ],
      (error, results) => {
        if (error) {
          fileLogger.log(
            `Something went wrong when calling add_job_fight_user(?, ?, ?, ?, ?, ?, ?, ?)`
          );
          console.error(error);
          res.status(500).json({ error: "Something went wrong!" });
          return;
        }

        fileLogger.log("called add_job_fight_user(?, ?, ?, ?, ?, ?, ?, ?)");
        res.json(results);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/delete-user", (req: Request, res: Response) => {
  const { id } = req.body;

  pool.query(`CALL delete_job_fight_user(?)`, [id], (error, results) => {
    if (error) {
      fileLogger.log(
        `Something went wrong when calling delete_job_fight_user(?)`
      );
      console.error(error);
      res.status(500).json({ error: "Something went wrong!" });
      return;
    }

    fileLogger.log("called delete_job_fight_user(?)");
    res.json(results);
  });
});

router.post("/update-user_data", (req: Request, res: Response) => {
  const {
    id,
    categoryId,
    firstName,
    lastName,
    email,
    phone,
    username,
    profilePic,
  } = req.body;

  pool.query(
    `CALL update_job_fight_user(?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, categoryId, firstName, lastName, email, phone, username, profilePic],
    (error, results) => {
      if (error) {
        fileLogger.log(
          `Something went wrong when calling update_job_fight_user(?, ?, ?, ?, ?, ?, ?, ?)`
        );
        console.error(error);
        res.status(500).json({ error: "Something went wrong!" });
        return;
      }
      fileLogger.log("called update_job_fight_user(?, ?, ?, ?, ?, ?, ?, ?)");
      res.json(results);
    }
  );
});

export default router;
