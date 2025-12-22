import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberSchema } from './entities/member.schema';
import { PayoutHistorySchema } from './entities/payout-history.schema';

@Module({
  imports: [TypeOrmModule.forFeature([MemberSchema, PayoutHistorySchema])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
