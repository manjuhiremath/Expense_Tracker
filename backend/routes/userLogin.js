
import express from "express";
import {
  createUser,
  getUsers,
  // getUsers,
  // getUserById,
  // updateUser,
  // deleteUser,
  loginUser,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/auth.js";
import { mailing } from "../controllers/mailing.js";

const router = express.Router();

router.post("/signup", createUser);

router.post("/login", loginUser);
router.get('/users',authenticateUser,getUsers);
router.post('/forgotpassword',mailing);
// router.get("/users/:id", getUserById);

// router.put("/users/:id", updateUser);

// router.delete("/users/:id", deleteUser);

export default router;
