import { EntitySchema } from 'typeorm';
import { Price } from './price.entity';
export const PriceSchema = new EntitySchema<Price>({
  name: 'Price',
  target: Price,
  columns: {
    id: { type: Number, primary: true },
    timing: { type: String },
    itemName: { type: String },
    T7: { type: Number },
    T8: { type: Number },
    BW_4_3: { type: Number },
    BW_5_2: { type: Number },
    BW_5_3: { type: Number },
    BW_6_1: { type: Number },
    BW_6_2: { type: Number },
    BW_lastChecked: { type: Date, nullable: true },
    FS_4_3: { type: Number },
    FS_5_2: { type: Number },
    FS_5_3: { type: Number },
    FS_6_1: { type: Number },
    FS_6_2: { type: Number },
    FS_lastChecked: { type: Date, nullable: true },
    alternativeTier: { type: String },
  },
});
