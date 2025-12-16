'use client';

import { useState, useEffect } from 'react';
import { api, Member } from '../lib/api';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await api.members.getAll();
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      await api.members.upload(file);
      setFile(null);
      fetchMembers();
    } catch (error) {
     console.error('Failed to upload', error);
     alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-black">
      <h1 className="text-3xl font-bold">Members Management</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Upload Members CSV</h2>
        <div className="flex gap-4 items-center">
            <input 
                type="file" 
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
            />
            <button 
                onClick={handleUpload} 
                disabled={!file || loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Members List</h2>
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Username</th>
              <th className="py-2">Payout</th>
              <th className="py-2">Last Payout Due</th>
              <th className="py-2">Date Joined</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-2">{member.username}</td>
                <td className="py-2">{member.payout}</td>
                <td className="py-2">{new Date(member.lastPayoutDue).toLocaleDateString()}</td>
                <td className="py-2">{new Date(member.dateJoined).toLocaleDateString()}</td>
              </tr>
            ))}
            {members.length === 0 && (
                <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">No members found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
