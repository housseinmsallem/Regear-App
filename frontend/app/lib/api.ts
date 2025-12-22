export interface Member {
  username: string;
  payout: number;
  lastPayoutDue: string;
  dateJoined: string;
  formattedPayout?: string;
}

export interface Price {
  id: number;
  itemName: string;
  timing: string;
  T7: number;
  T8: number;
  BW_4_3: number;
  BW_5_2: number;
  BW_5_3: number;
  BW_6_1: number;
  BW_6_2: number;
  BW_lastChecked: string;
  FS_4_3: number;
  FS_5_2: number;
  FS_5_3: number;
  FS_6_1: number;
  FS_6_2: number;
  FS_last_Checked: string;
  alternativeTier: string;
}

const API_BASE_URL = 'http://localhost:3000';

export const api = {
  members: {
    getAll: async (): Promise<Member[]> => {
      const res = await fetch(`${API_BASE_URL}/member`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch members');
      return res.json();
    },
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE_URL}/member/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload members');
      return res.json();
    },
    create: async (data: Partial<Member>) => {
      const res = await fetch(`${API_BASE_URL}/member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create member');
      return res.json();
    },
    update: async (username: string, data: Partial<Member>) => {
      const res = await fetch(`${API_BASE_URL}/member/${username}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update member');
      return res.json();
    },
    delete: async (username: string) => {
      const res = await fetch(`${API_BASE_URL}/member/${username}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete member');
      return res.json();
    },
    processPayout: async (username: string) => {
      const res = await fetch(`${API_BASE_URL}/member/${username}/payout`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to process payout');
      return res.json();
    }
  },
  prices: {
    getAll: async (): Promise<Price[]> => {
      const res = await fetch(`${API_BASE_URL}/prices`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch prices');
      return res.json();
    },
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE_URL}/prices/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload prices');
      return res.json();
    },
    create: async (data: Partial<Price>) => {
      const res = await fetch(`${API_BASE_URL}/prices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create price');
      return res.json();
    },
    update: async (id: number, data: Partial<Price>) => {
      const res = await fetch(`${API_BASE_URL}/prices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update price');
      return res.json();
    },
    delete: async (id: number) => {
      const res = await fetch(`${API_BASE_URL}/prices/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete price');
      return res.json();
    }
  },
};
