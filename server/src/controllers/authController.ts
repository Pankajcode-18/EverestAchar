import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { ENV } from '../config/env';

export class AuthController {
  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required.' });
        return;
      }

      const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
      if (!admin) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role, name: admin.name },
        ENV.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async me(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const admin = await Admin.findById(req.user.id).select('-passwordHash');
      if (!admin) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.json({ success: true, data: admin });
    } catch (error) {
      next(error);
    }
  }
}
