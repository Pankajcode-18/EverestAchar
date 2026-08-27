import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';

export class ProductController {
  public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, vegType, featured, search } = req.query;
      const filter: Record<string, any> = {};

      if (category && category !== 'all') {
        filter.category = category;
      }
      if (vegType && (vegType === 'veg' || vegType === 'non-veg')) {
        filter.vegType = vegType;
      }
      if (featured === 'true') {
        filter.isFeatured = true;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { name: regex },
          { nepaliName: regex },
          { description: regex },
          { ingredients: regex },
        ];
      }

      const products = await Product.find(filter).sort({ displayOrder: 1, createdAt: -1 });
      res.json({ success: true, count: products.length, data: products });
    } catch (error) {
      next(error);
    }
  }

  public static async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const slugStr = String(slug || '').toLowerCase();
      const product = await Product.findOne({ slug: slugStr });
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productData = req.body;
      if (!productData.slug && productData.name) {
        productData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      const newProduct = await Product.create(productData);
      res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!updated) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      res.json({ success: true, message: 'Product updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
