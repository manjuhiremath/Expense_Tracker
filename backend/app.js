import express, { json } from 'express';
import cors from 'cors';
const app = express();
import dotenv from "dotenv";
import { sequelize } from './config/database.js';

//Routes
import loginRouter from './routes/userLogin.js';
import expenseRouter from './routes/expense.js'
import orderRoutes from './routes/order.js';
import { Users } from './models/User.js';
import { Expense } from './models/expense.js';
import { Orders } from './models/orders.js';

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
dotenv.config();

app.use(json());
app.use("/api/premium", orderRoutes);
app.use("/api/expense", expenseRouter);
app.use("/api", loginRouter);
app.get("/", (req, res) => {
  res.json("Welcome to Expense Tracker!!!!");
});

const start = async () => {
  try {
    app.listen(3000, () => {
      console.log(3000 + " : connected");
    });
  } catch (error) {
    console.log(error);
  }
};
Users.hasMany(Expense, { onDelete: 'CASCADE' });
Expense.belongsTo(Users);

Users.hasMany(Orders);
Orders.belongsTo(Users);
// Sync models
sequelize
  .sync({ alter: true }) // use { force: true } only in development; it drops and recreates tables
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Error creating database:", error);
  });

start();