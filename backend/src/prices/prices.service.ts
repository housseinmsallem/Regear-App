import { Injectable } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { Price } from './entities/price.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { formatDateToMMDDYYYY } from 'src/helper/formatDate';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    private dataSource: DataSource,
  ) {}
  async bulkCreate(prices: Partial<Price>[]): Promise<Price[]> {
    return this.priceRepository.save(prices);
  }
  create(createPriceDto: CreatePriceDto) {
    return this.priceRepository.create();
  }

  findAll() {
    return this.priceRepository.find();
  }

  findOne(id: number) {
    return this.priceRepository.findOneBy({ id });
  }

  async update(id: number, updatePriceDto: UpdatePriceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const prices = await queryRunner.manager.findOne(Price, {
        where: { id },
      });
      if (!prices) {
        throw new Error('Item not found');
      }
      const updateData = {
        ...updatePriceDto,
        BW_lastChecked:
          updatePriceDto.BW_lastChecked || formatDateToMMDDYYYY(new Date()),
        FS_lastChecked:
          updatePriceDto.FS_lastChecked || formatDateToMMDDYYYY(new Date()),
      };
      await queryRunner.manager.update(Price, { id }, updateData);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return this.priceRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.priceRepository.delete({ id });
  }
}
