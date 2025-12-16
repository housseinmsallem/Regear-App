import { EntitySchema } from 'typeorm';
import { Member } from './member.entity';
export const MemberSchema = new EntitySchema<Member>({
  name: 'Member',
  target: Member,
  columns: {
    username: { type: String, primary: true },
    payout: { type: Number },
    lastPayoutDue: { type: Date },
    dateJoined: { type: Date },
  },
});
