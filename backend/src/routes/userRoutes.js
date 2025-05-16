import { Router } from "express";
const router = Router();

import { loginUser, registerUser } from "../controlles/userController.js";


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
export default router;
