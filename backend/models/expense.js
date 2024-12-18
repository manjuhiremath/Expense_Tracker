import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./User.js";

export const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "User",  // This references the User table
            key: "id",  // The column in the User table
        },
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

// Define the relationship: Each Expense belongs to one User


// Sync the model (only once, avoid in production without migration strategy)
sequelize.sync({ alter: true }).then(() => console.log("Expense table synced"));
