import { Request, Response, NextFunction } from 'express';
import { Gallery } from '../models/Gallery';

export class GalleryController {
  public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category } = req.query;
      const filter: Record<string, any> = {};

      if (category && category !== 'all') {
        filter.category = category;
      }

      const items = await Gallery.find(filter).sort({ displayOrder: 1, createdAt: -1 });
      res.json({ success: true, count: items.length, data: items });
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await Gallery.create(req.body);
      res.status(201).json({ success: true, message: 'Gallery item created', data: item });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await Gallery.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Gallery item not found' });
        return;
      }
      res.json({ success: true, message: 'Gallery item deleted' });
    } catch (error) {
      next(error);
    }
  }
}
