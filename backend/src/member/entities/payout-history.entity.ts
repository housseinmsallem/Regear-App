import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class PayoutHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  amount: number;

  @Column()
  payoutDate: Date;
}
