import { Expense } from "../models/expense.js";


export const createExpense = async (req, res) => {
    const { amount, description, category, UserId} = req.body;

    try {
        const newExpense = await Expense.create({ amount, description, category, UserId });
        res.status(201).json({
            message: "User created successfully",
            expense: {
                UserId: newExpense.UserId,
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
        const { id } = req.params;
        const userExpense = await Expense.findAll({ where: { UserId:id } });
        if (userExpense.length === 0) {
            return res.status(404).json({ message: "No expenses found for this user." });
        }
        return res.status(200).json({ userExpense });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params; 
        const expenseToDelete = await Expense.findByPk(id);

        if (!expenseToDelete) {
            return res.status(404).json({ message: "Expense not found." });
        }

        await expenseToDelete.destroy();

      
        return res.status(200).json({ message: "Expense deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting expense", error: error.message });
    }
};