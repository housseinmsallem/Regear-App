'use client';

import { useState, useEffect } from 'react';
import { api, Member } from '../lib/api';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  // CRUD State
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<Member>>({
    username: '',
    payout: 0,
    lastPayoutDue: new Date().toISOString().split('T')[0],
    dateJoined: new Date().toISOString().split('T')[0],
  });

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

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && currentMember.username) {
        await api.members.update(currentMember.username, currentMember);
      } else {
        await api.members.create(currentMember);
      }
      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Failed to save member:', error);
      alert('Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (username: string) => {
    if (!confirm(`Are you sure you want to delete ${username}?`)) return;
    try {
      await api.members.delete(username);
      fetchMembers();
    } catch (error) {
      console.error('Failed to delete member:', error);
      alert('Failed to delete member');
    }
  };

  const startEdit = (member: Member) => {
    setIsEditing(true);
    setCurrentMember(member);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentMember({
      username: '',
      payout: 0,
      lastPayoutDue: new Date().toISOString().split('T')[0],
      dateJoined: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-8 text-black pb-12">
      <h1 className="text-3xl font-bold">Members Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Member' : 'Add New Member'}</h2>
          <form onSubmit={handleCreateOrUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={currentMember.username}
                onChange={(e) => setCurrentMember({ ...currentMember, username: e.target.value })}
                disabled={isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payout</label>
              <input
                type="number"
                value={currentMember.payout}
                onChange={(e) => setCurrentMember({ ...currentMember, payout: Number(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Payout Due</label>
              <input
                type="date"
                value={currentMember.lastPayoutDue?.split('T')[0]}
                onChange={(e) => setCurrentMember({ ...currentMember, lastPayoutDue: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date Joined</label>
              <input
                type="date"
                value={currentMember.dateJoined?.split('T')[0]}
                onChange={(e) => setCurrentMember({ ...currentMember, dateJoined: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : isEditing ? 'Update' : 'Add'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Upload Members CSV</h2>
          <div className="flex flex-col gap-4">
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
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-fit"
              >
                  {loading ? 'Uploading...' : 'Upload CSV'}
              </button>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Members List</h2>
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4">Username</th>
              <th className="py-2 px-4">Payout</th>
              <th className="py-2 px-4">Last Payout Due</th>
              <th className="py-2 px-4">Date Joined</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{member.username}</td>
                <td className="py-2 px-4">{member.payout.toLocaleString()}</td>
                <td className="py-2 px-4">{new Date(member.lastPayoutDue).toLocaleDateString()}</td>
                <td className="py-2 px-4">{new Date(member.dateJoined).toLocaleDateString()}</td>
                <td className="py-2 px-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(member)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(member.username)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
                <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">No members found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
