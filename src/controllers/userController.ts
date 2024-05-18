import dotenv from 'dotenv'
 dotenv.config()
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


import { getSocketIO } from '../socket'; 

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const io = await getSocketIO(); 

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { fullname, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    // Create a new user
    const newUser: IUser = new User({ fullname, email, password: hashedPassword });
    const savedUser = await newUser.save();

    io.emit('userRegistered', { message: 'New user registered', user: savedUser });

    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const io = await getSocketIO();
  
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
  
      const { email, password } = req.body;
  
      // Find the user by email
      const user: IUser | null = await User.findOne({ email });
  
      // Check if the user exists
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
  
      const secretKey = process.env.SECRET;

    if (!secretKey) {
    throw new Error('SECRET key is not provided');
     } 
    
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '5h' });
  
      // remove password field from user object 
      const userWithoutPassword = { ...user.toObject(), password: undefined };
  
      // Emit Socket.IO event to notify cusers about the logged-in user
      io.emit('loggedin', { message: 'This user has logged in', user: userWithoutPassword });
  
      res.status(200).json({ message: 'Login successful', user: userWithoutPassword, token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


export const logout = async (req: Request, res: Response): Promise<void> => {
    try {

         res.clearCookie('token');

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

  
