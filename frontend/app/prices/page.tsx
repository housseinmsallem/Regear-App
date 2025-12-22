'use client';

import { useState, useEffect } from 'react';
import { api, Price } from '../lib/api';

export default function PricesPage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // CRUD State
  const [isEditing, setIsEditing] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<Partial<Price>>({
    itemName: '',
    timing: 'Daily',
    T7: 0,
    T8: 0,
    BW_4_3: 0,
    BW_5_2: 0,
    BW_5_3: 0,
    BW_6_1: 0,
    BW_6_2: 0,
    BW_lastChecked: new Date().toISOString().split('T')[0],
    FS_4_3: 0,
    FS_5_2: 0,
    FS_5_3: 0,
    FS_6_1: 0,
    FS_6_2: 0,
    FS_last_Checked: new Date().toISOString().split('T')[0],
    alternativeTier: 'None',
  });

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

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && currentPrice.id) {
        await api.prices.update(currentPrice.id, currentPrice);
      } else {
        await api.prices.create(currentPrice);
      }
      resetForm();
      fetchPrices();
    } catch (error) {
      console.error('Failed to save price:', error);
      alert('Failed to save price');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this price?')) return;
    try {
      await api.prices.delete(id);
      fetchPrices();
    } catch (error) {
      console.error('Failed to delete price:', error);
      alert('Failed to delete price');
    }
  };

  const startEdit = (price: Price) => {
    setIsEditing(true);
    setCurrentPrice(price);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentPrice({
        itemName: '',
        timing: 'Daily',
        T7: 0,
        T8: 0,
        BW_4_3: 0,
        BW_5_2: 0,
        BW_5_3: 0,
        BW_6_1: 0,
        BW_6_2: 0,
        BW_lastChecked: new Date().toISOString().split('T')[0],
        FS_4_3: 0,
        FS_5_2: 0,
        FS_5_3: 0,
        FS_6_1: 0,
        FS_6_2: 0,
        FS_last_Checked: new Date().toISOString().split('T')[0],
        alternativeTier: 'None',
    });
  };

  return (
    <div className="space-y-8 text-black pb-12">
      <h1 className="text-3xl font-bold ">Prices Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Price' : 'Add New Price'}</h2>
          <form onSubmit={handleCreateOrUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item Name</label>
                  <input
                    type="text"
                    value={currentPrice.itemName}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, itemName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Timing</label>
                  <input
                    type="text"
                    value={currentPrice.timing}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, timing: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">T7</label>
                  <input
                    type="number"
                    value={currentPrice.T7}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, T7: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">T8</label>
                  <input
                    type="number"
                    value={currentPrice.T8}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, T8: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">BW 4.3</label>
                  <input
                    type="number"
                    value={currentPrice.BW_4_3}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, BW_4_3: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">BW 5.2</label>
                  <input
                    type="number"
                    value={currentPrice.BW_5_2}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, BW_5_2: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">BW 5.3</label>
                  <input
                    type="number"
                    value={currentPrice.BW_5_3}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, BW_5_3: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">BW 6.1</label>
                  <input
                    type="number"
                    value={currentPrice.BW_6_1}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, BW_6_1: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">BW 6.2</label>
                  <input
                    type="number"
                    value={currentPrice.BW_6_2}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, BW_6_2: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">BW Last Checked</label>
                  <input
                    type="date"
                    value={currentPrice.BW_lastChecked?.split('T')[0]}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, BW_lastChecked: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">FS 4.3</label>
                  <input
                    type="number"
                    value={currentPrice.FS_4_3}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, FS_4_3: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">FS 5.2</label>
                  <input
                    type="number"
                    value={currentPrice.FS_5_2}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, FS_5_2: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">FS 5.3</label>
                  <input
                    type="number"
                    value={currentPrice.FS_5_3}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, FS_5_3: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">FS 6.1</label>
                  <input
                    type="number"
                    value={currentPrice.FS_6_1}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, FS_6_1: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">FS 6.2</label>
                  <input
                    type="number"
                    value={currentPrice.FS_6_2}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, FS_6_2: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">FS Last Checked</label>
                  <input
                    type="date"
                    value={currentPrice.FS_last_Checked?.split('T')[0]}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, FS_last_Checked: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alternative Tier</label>
                  <input
                    type="text"
                    value={currentPrice.alternativeTier}
                    onChange={(e) => setCurrentPrice({ ...currentPrice, alternativeTier: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : isEditing ? 'Update Price' : 'Add Price'}
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
          <h2 className="text-xl font-semibold mb-4">Upload Prices CSV</h2>
           <div className="flex flex-col gap-4">
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
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 w-fit"
              >
                  {loading ? 'Uploading...' : 'Upload CSV'}
              </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Prices List</h2>
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4">Item Name</th>
              <th className="py-2 px-4">T7</th>
              <th className="py-2 px-4">T8</th>
              <th className="py-2 px-4">BW 4.3</th>
              <th className="py-2 px-4">BW 5.2</th>
              <th className="py-2 px-4">BW 6.1</th>
              <th className="py-2 px-4">FS 4.3</th>
              <th className="py-2 px-4">Last Checked</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price) => (
              <tr key={price.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 font-medium">{price.itemName}</td>
                <td className="py-2 px-4">{price.T7.toLocaleString()}</td>
                <td className="py-2 px-4">{price.T8.toLocaleString()}</td>
                <td className="py-2 px-4">{price.BW_4_3.toLocaleString()}</td>
                <td className="py-2 px-4">{price.BW_5_2.toLocaleString()}</td>
                <td className="py-2 px-4">{price.BW_6_1.toLocaleString()}</td>
                <td className="py-2 px-4">{price.FS_4_3.toLocaleString()}</td>
                <td className="py-2 px-4 text-xs">{price.BW_lastChecked}</td>
                <td className="py-2 px-4">
                    <div className="flex gap-2">
                        <button 
                        onClick={() => startEdit(price)}
                        className="text-blue-600 hover:text-blue-800"
                        >
                        Edit
                        </button>
                        <button 
                        onClick={() => handleDelete(price.id)}
                        className="text-red-600 hover:text-red-800"
                        >
                        Delete
                        </button>
                    </div>
                </td>
              </tr>
            ))}
             {prices.length === 0 && (
                <tr>
                    <td colSpan={9} className="py-4 text-center text-gray-500">No prices found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
