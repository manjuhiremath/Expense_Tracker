import { Expense } from "../models/expense.js";
import { User } from "../models/User.js";
import bcrypt from 'bcrypt';

export const createExpense = async (req, res) => {
    const {userId} = req.params;
    const { amount, description, category } = req.body;

    try {
        const newExpense = await Expense.create({ amount, description, category, userId });
        res.status(201).json({
            message: "User created successfully",
            expense: {
                userId: newExpense.userId,
                amount: newExpense.amount,
                description: newExpense.description,
                category: newExpense.category
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

export const getUserExpense = async (req, res) => {
    try {
        const { userId } = req.params;
        const userExpense = await Expense.findAll({ where: { userId } });
        if (userExpense.length === 0) {
            return res.status(404).json({ message: "No expenses found for this user." });
        }


        return res.status(200).json({ userExpense });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }

}