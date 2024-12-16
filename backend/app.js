import express,{json} from 'express';
import cors from 'cors';
const app = express();
import dotenv from "dotenv";
import { sequelize } from './config/database.js';
// Delete a user
import loginRouter from './routes/userLogin.js';
const PORT = process.env.PORT || 8080;

dotenv.config();
app.use(
    cors({
      origin: "http://localhost:5500", // Allow your React frontend
      methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
      credentials: true, // Enable cookies if needed
    })
  );

app.use(json());
app.use("/api", loginRouter);
app.get("/", (req, res) => {
    res.json("Welcome to LMS tool, Let's start learning!!!!");
  });
  
  const start = async () => {
    try {
      app.listen(PORT, () => {
        console.log(PORT + " : connected");
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  // Sync models
  sequelize
    .sync({alter: true}) // use { force: true } only in development; it drops and recreates tables
    .then(() => {
      console.log("Database & tables created!");
    })
    .catch((error) => {
      console.error("Error creating database:", error);
    });
  
  start();