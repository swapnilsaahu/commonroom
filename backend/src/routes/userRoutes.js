import { Router } from "express";
const router = Router();

import { getRooms, loginUser, registerUser, verifyUser } from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/userAuthenticationMiddleware.js";


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify").get(verifyJWT, verifyUser);
router.route("/rooms").get(verifyJWT, getRooms);
export default router;
