import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { PayoutHistory } from './entities/payout-history.entity';
import { formatDateToMMDDYYYY } from '../helper/formatDate';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(PayoutHistory)
    private payoutHistoryRepository: Repository<PayoutHistory>,
    private dataSource: DataSource,
  ) {}

  async processPayout(username: string): Promise<Member> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const member = await queryRunner.manager.findOne(Member, {
        where: { username },
      });

      if (!member) {
        throw new Error('Member not found');
      }

      if (member.payout > 0) {
        // Create history entry
        const historyEntry = new PayoutHistory();
        historyEntry.username = member.username;
        historyEntry.amount = member.payout;
        historyEntry.payoutDate = new Date();
        await queryRunner.manager.save(historyEntry);

        // Reset payout
        member.payout = 0;
        member.lastPayoutDue = new Date();
        await queryRunner.manager.save(member);
      }

      await queryRunner.commitTransaction();
      return member;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async bulkCreate(members: Partial<Member>[]): Promise<Member[]> {
    return this.membersRepository.save(members);
  }
  async create(createMemberDto: CreateMemberDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    createMemberDto = {
      ...createMemberDto,
      payout: 0,
      lastPayoutDue: formatDateToMMDDYYYY(new Date()),
      dateJoined: new Date(),
    };
    try {
      await queryRunner.manager.save(createMemberDto);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return this.membersRepository.save(createMemberDto);
  }

  findAll() {
    return this.membersRepository.find();
  }

  findOne(username: string) {
    return this.membersRepository.findOneBy({ username });
  }

  async update(username: string, updateMemberDto: UpdateMemberDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const member = await queryRunner.manager.findOne(Member, {
        where: { username },
      });
      if (!member) {
        throw new Error('Member not found');
      }

      const newPayout = member.payout + (updateMemberDto.payoutAddition || 0);
      const updateData = {
        ...updateMemberDto,
        payout: updateMemberDto.payout || newPayout,
        lastPayoutDue: formatDateToMMDDYYYY(new Date()),
        dateJoined: member.dateJoined,
      };
      await queryRunner.manager.update(Member, { username }, updateData);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return this.membersRepository.findOne({ where: { username } });
  }

  delete(username: string) {
    return this.membersRepository.delete({ username });
  }
}
