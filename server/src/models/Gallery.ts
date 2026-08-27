import mongoose, { Schema, Document } from 'mongoose';

export type GalleryCategory =
  | 'all'
  | 'veg'
  | 'non-veg'
  | 'packaging'
  | 'culture'
  | 'behind_the_scenes';

export interface IGalleryItem extends Document {
  title: string;
  nepaliTitle?: string;
  image: string;
  category: GalleryCategory;
  description: string;
  displayOrder: number;
  featured: boolean;
}

const GallerySchema = new Schema<IGalleryItem>(
  {
    title: { type: String, required: true },
    nepaliTitle: { type: String },
    image: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['all', 'veg', 'non-veg', 'packaging', 'culture', 'behind_the_scenes'],
      default: 'all',
    },
    description: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Gallery = mongoose.model<IGalleryItem>('Gallery', GallerySchema);
