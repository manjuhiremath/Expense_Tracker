
import express from "express";
import {
  createUser,
  // getUsers,
  // getUserById,
  // updateUser,
  // deleteUser,
  loginUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", createUser);

router.post("/login", loginUser);

// router.get("/users/:id", getUserById);

// router.put("/users/:id", updateUser);

// router.delete("/users/:id", deleteUser);

export default router;
