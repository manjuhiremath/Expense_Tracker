import jwt from 'jsonwebtoken';
import { Users } from '../models/User.js';

export const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization; // Extract token from header
    if (!token) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.jwt);
      const user = await Users.findByPk(decoded.UserId); // Retrieve user by ID from JWT payload
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      req.user = user; // Set the user instance in req.user
      next(); // Proceed to the next middleware/controller
    } catch (err) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };