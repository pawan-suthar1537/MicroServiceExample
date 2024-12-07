import express from "express";
import { Create, Get } from "../controller/post.controller.js";
import Auth from "../middleware/AuthMid.js";

const router = express.Router();

router.post("/create", Auth, Create);
router.get("/get", Get);

export default router;
