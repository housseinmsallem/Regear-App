import { EntitySchema } from 'typeorm';
import { PayoutHistory } from './payout-history.entity';

export const PayoutHistorySchema = new EntitySchema<PayoutHistory>({
  name: 'PayoutHistory',
  target: PayoutHistory,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    username: {
      type: String,
    },
    amount: {
      type: Number,
    },
    payoutDate: {
      type: Date,
    },
  },
});
