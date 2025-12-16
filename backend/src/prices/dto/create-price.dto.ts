export class CreatePriceDto {
  id: number;
  timing: string;
  itemName: string;
  T7: number;
  T8: number;
  BW_4_3: number;
  BW_5_2: number;
  BW_5_3: number;
  BW_6_1: number;
  BW_6_2: number;
  BW_lastChecked: Date;
  FS_4_3: number;
  FS_5_2: number;
  FS_5_3: number;
  FS_6_1: number;
  FS_6_2: number;
  FS_lastChecked: Date;
  alternativeTier: string;
}
