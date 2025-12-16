import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('price')
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  itemName: string;
  @Column({ type: 'text' })
  timing: string;
  @Column({ type: 'real', nullable: true })
  T7: number;

  @Column({ type: 'real', nullable: true })
  T8: number;

  @Column({ type: 'real', nullable: true })
  BW_4_3: number;

  @Column({ type: 'real', nullable: true })
  BW_5_2: number;

  @Column({ type: 'real', nullable: true })
  BW_5_3: number;

  @Column({ type: 'real', nullable: true })
  BW_6_1: number;

  @Column({ type: 'real', nullable: true })
  BW_6_2: number;

  @Column({ type: 'text', nullable: true })
  BW_lastChecked: Date;

  @Column({ type: 'real', nullable: true })
  FS_4_3: number;

  @Column({ type: 'real', nullable: true })
  FS_5_2: number;

  @Column({ type: 'real', nullable: true })
  FS_5_3: number;

  @Column({ type: 'real', nullable: true })
  FS_6_1: number;

  @Column({ type: 'real', nullable: true })
  FS_6_2: number;

  @Column({ type: 'text', nullable: true })
  FS_lastChecked: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  alternativeTier: string;
}
