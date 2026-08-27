import mongoose, { Schema, Document } from 'mongoose';

export type ZoneType = 'himachal' | 'delhiChandigarh' | 'outside';

export interface ILocationZone extends Document {
  zoneKey: ZoneType;
  displayName: string;
  nepaliDisplayName: string;
  states: string[];
  cities: string[];
  pincodePrefixes: string[];
  description: string;
  deliveryHighlights: string;
}

const LocationZoneSchema = new Schema<ILocationZone>(
  {
    zoneKey: {
      type: String,
      required: true,
      unique: true,
      enum: ['himachal', 'delhiChandigarh', 'outside'],
    },
    displayName: { type: String, required: true },
    nepaliDisplayName: { type: String, required: true },
    states: [{ type: String }],
    cities: [{ type: String }],
    pincodePrefixes: [{ type: String }],
    description: { type: String, required: true },
    deliveryHighlights: { type: String, required: true },
  },
  { timestamps: true }
);

export const LocationZone = mongoose.model<ILocationZone>('LocationZone', LocationZoneSchema);
