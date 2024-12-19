
import express from "express";
import { createExpense, deleteExpense, getUserExpense } from "../controllers/expenseControllers.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.post('/',authenticateUser ,createExpense);
router.get('/',authenticateUser,getUserExpense);
router.delete('/:id',authenticateUser,deleteExpense);
export default router;