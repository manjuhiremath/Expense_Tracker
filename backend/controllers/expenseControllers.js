import { Expense } from "../models/expense.js";
import { Users } from '../models/User.js';
import awsSdk from 'aws-sdk';


awsSdk.config.update({
    region: 'us-east-1', // e.g., 'us-west-2'
    accessKeyId: 'AKIATYDDLXDPGKAW5C3N',
    secretAccessKey: 'E8OZMFu3R7KFJJle0TNyq5Mnpb1vwNXS753xLWxj',
    
});

const s3 = new awsSdk.S3();

async function UploadToS3(data, name) {
    const params = {
        Key: name, // The name you want to save the file as
        Body: data, 
        ACL: 'public-read',
        Bucket: 'expensetracker1352',// The data to upload
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        return uploadResult.Location; // Returns the URL of the uploaded file
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw new Error("Upload failed");
    }
}
export const downloadUserExpense = async (req, res) => {
    try {
        const userExpenses = await Users.findByPk(req.user.id);
        // if (!userExpenses) {
        //     return res.status(404).json({ message: "No expenses found for this user." });
        // }

        console.log('User Expenses:', userExpenses);
        const stringifiedExpense = JSON.stringify(userExpenses);
        const filename = 'expense.txt';
        const fileUrl = await UploadToS3(stringifiedExpense, filename);

        return res.status(200).json({ fileUrl, success: true });
    } catch (error) {
        console.error('Error downloading user expenses:', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createExpense = async (req, res) => {
    const UserId = req.user.id;
    // console.log(UserId.id)
    const { amount, description, category} = req.body;

    try {
        const newExpense = await Expense.create({ amount, description, category, UserId });
        await calculateTotalExpenses();
        res.status(201).json({
            message: "Expense created successfully",
            expense: {
                UserId: newExpense.UserId,
                amount: newExpense.amount,
                description: newExpense.description,
                category: newExpense.category
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating Expense", error: error.message });
    }
};



export const getUserExpense = async (req, res) => {
    try {
        const user  = req.user.id;
        // console.log(user)
        const userExpense = await Expense.findAll({ where: { UserId:user } });
        if (userExpense.length === 0) {
            return res.status(404).json({ message: "No expenses found for this user." });
        }
        res.status(200).json({ userExpense });
        return userExpense;
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

export const deleteExpense = async (req, res) => {
    try {
        const {id} = req.params; 
        const expenseToDelete = await Expense.findByPk(id);
        if (!expenseToDelete) {
            return res.status(404).json({ message: "Expense not found." });
        }
        await expenseToDelete.destroy();
        await calculateTotalExpenses();
      
        return res.status(200).json({ message: "Expense deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting expense", error: error.message });
    }
};

async function calculateTotalExpenses() {
  try {
    const users = await Users.findAll();

    for (let user of users) {
      const totalExpenses = await Expense.sum('amount', {
        where: {
          userId: user.id, 
        },
      });

      await user.update({ totalamount: totalExpenses });
    }

    console.log('Total expenses updated for all users!');
  } catch (error) {
    console.error('Error calculating total expenses:', error);
  }
}