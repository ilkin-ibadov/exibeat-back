import express from "express";
import { sendMessage, receiveMessage } from "../controllers/djMessage.controller.js";

const router = express.Router();

router.get("/send", sendMessage);
router.post("/receive", receiveMessage);

export default router;