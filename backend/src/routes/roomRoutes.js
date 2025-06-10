import { Router } from "express";
const router = Router();

import { usersList } from "../controllers/roomController.js";
import { verifyJWT } from "../middlewares/userAuthenticationMiddleware.js";


router.route("/users").get(verifyJWT, usersList);
export default router;
