import express from "express";
import { login, signup, validateToken } from "../controllers/authController";
import { userMiddleware } from "../middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/validate", userMiddleware, validateToken)

export default router;
