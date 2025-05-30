import { Router } from "express";
const router = Router();

import { loginUser, registerUser, verifyUser } from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/userAuthenticationMiddleware.js";


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify").get(verifyJWT, verifyUser);
export default router;
