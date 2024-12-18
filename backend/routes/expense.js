
import express from "express";
import { createExpense, deleteExpense, getUserExpense } from "../controllers/expenseControllers.js";


const router = express.Router();

router.post('/',createExpense);
router.get('/:id',getUserExpense);
router.delete('/:id',deleteExpense);
export default router;