import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceSchema } from './entities/price.schema';

@Module({
  imports: [TypeOrmModule.forFeature([PriceSchema])],
  controllers: [PricesController],
  providers: [PricesService],
})
export class PricesModule {}
