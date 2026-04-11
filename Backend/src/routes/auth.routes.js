import { Router } from "express";
import jwt from "jsonwebtoken";
import { register,login,verifyEmail,getMe } from "../controllers/auth.controller.js";
import { validate, registerValidator, loginValidator } from "../validator/auth.validator.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, register);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/login", loginValidator, login);
authRouter.get("/get-me", authUser, getMe);

export default authRouter;