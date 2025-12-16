import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { formatDateToMMDDYYYY } from '../helper/formatDate';
@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    private dataSource: DataSource,
  ) {}
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
