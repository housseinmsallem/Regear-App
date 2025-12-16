'use client';

import { useState, useEffect } from 'react';
import { api, Price } from '../lib/api';

export default function PricesPage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const data = await api.prices.getAll();
      setPrices(data);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      await api.prices.upload(file);
      setFile(null);
      fetchPrices();
    } catch (error) {
     console.error('Failed to upload', error);
     alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Prices Management</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Upload Prices CSV</h2>
         <div className="flex gap-4 items-center">
            <input 
                type="file" 
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
            />
            <button 
                onClick={handleUpload} 
                disabled={!file || loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Prices List</h2>
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Item Name</th>
              <th className="py-2">T7</th>
              <th className="py-2">T8</th>
              <th className="py-2">BW 4.3</th>
              <th className="py-2">BW 5.2</th>
              <th className="py-2">BW 6.1</th>
              <th className="py-2">FS 4.3</th>
              <th className="py-2">Last Checked (BW)</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price) => (
              <tr key={price.id} className="border-b hover:bg-gray-50">
                <td className="py-2 font-medium">{price.itemName}</td>
                <td className="py-2">{price.T7}</td>
                <td className="py-2">{price.T8}</td>
                <td className="py-2">{price.BW_4_3}</td>
                <td className="py-2">{price.BW_5_2}</td>
                <td className="py-2">{price.BW_6_1}</td>
                <td className="py-2">{price.FS_4_3}</td>
                <td className="py-2">{price.BW_lastChecked}</td>
              </tr>
            ))}
             {prices.length === 0 && (
                <tr>
                    <td colSpan={8} className="py-4 text-center text-gray-500">No prices found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
