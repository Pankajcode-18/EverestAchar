import { Request, Response, NextFunction } from 'express';
import { PricingService } from '../services/pricingService';
import { LocationZone } from '../models/LocationZone';

export class PricingController {
  public static async calculate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, productSlug, productName, quantity, quantityKg, state, city, pincode, zone } = req.body;
      const qty = parseFloat(quantityKg || quantity || 1);

      const result = await PricingService.calculatePrice({
        productId,
        productSlug,
        productName,
        quantityKg: qty,
        state,
        city,
        pincode,
        zone,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getZones(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const zones = await LocationZone.find().sort({ createdAt: 1 });
      res.json({ success: true, data: zones });
    } catch (error) {
      next(error);
    }
  }
}
