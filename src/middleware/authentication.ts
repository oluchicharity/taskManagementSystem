import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import User, { IUser } from '../models/userModel';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
      }
      const token = authorizationHeader.split(' ')[1];
  
      const secretKey = process.env.SECRET;
      if (!secretKey) {
        return res.status(500).json({ error: 'Secret key is not provided' });
      }
  
      const decodedToken = jwt.verify(token, secretKey) as { userId: string };
      console.log('Decoded token:', decodedToken); 
  
      if (!decodedToken || !decodedToken.userId) {
        return res.status(401).json({ error: 'Invalid token or missing user ID' });
      }
  
      const user = await User.findById(decodedToken.userId);
      console.log('User:', user); 
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Attach the user object to the request
      req.user = user;
  
      next();
    } catch (error: any) {
      console.error('Authentication error:', error.message);
  
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({ error: 'Token has expired' });
      }
  
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  