
import express from "express";
import { createExpense, getUserExpense } from "../controllers/expenseControllers";


const router = express.Router();

router.post('/expense/:userId',createExpense);
router.get('/expense/:userId',getUserExpense)