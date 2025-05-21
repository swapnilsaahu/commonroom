import { Router } from "express";
const router = Router();

import { createRoomAPI } from "../controllers/roomController.js";

router.route('/createRoomAPI').post(createRoomAPI);
//router.route('/joinRoom').post(joinRoom);

export default router;
