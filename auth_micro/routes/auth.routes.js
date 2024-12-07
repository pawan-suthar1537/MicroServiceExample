import express from "express";
import {
  getUser,
  Login,
  Register,
  userDetailbyId,
} from "../controller/auth.controller.js";
import Auth from "../middleware/AuthMid.js";
const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/me", Auth, getUser);
router.post("/detail/:id", userDetailbyId);

export default router;
