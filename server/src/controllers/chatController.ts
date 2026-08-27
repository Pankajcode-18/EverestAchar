import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chatService';

export class ChatController {
  public static async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({ success: false, message: 'A non-empty message string is required.' });
        return;
      }

      if (message.length > 800) {
        res.status(400).json({ success: false, message: 'Message exceeds maximum length of 800 characters.' });
        return;
      }

      const response = await ChatService.processMessage(message, history || []);
      res.json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
