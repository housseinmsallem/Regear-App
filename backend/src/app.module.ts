import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { Member } from './member/entities/member.entity';
import { PricesModule } from './prices/prices.module';
import { Price } from './prices/entities/price.entity';

@Module({
  imports: [
    MemberModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'regears.db',
      entities: [Price, Member],
      autoLoadEntities: true,
      synchronize: true,
      //synchronize:false in PROD VERY IMPORTANT!!!!!!!!!!!!!!!!!
    }),
    PricesModule,
    MemberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
