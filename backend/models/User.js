import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Expense } from "./expense.js";  // Import the Expense model to set up associations

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    underscored: true,
    tableName: "user",
  }
);

// Define the relationship: One User has many Expenses
User.hasMany(Expense, { foreignKey: "userId", as: "expenses" });
Expense.belongsTo(User, { foreignKey: "userId", as: "user" });
// Sync the model (only once, avoid in production without migration strategy)
sequelize.sync({ alter: true }).then(() => console.log("User table synced"));
