import { useState } from 'react';
import api from '../utils/api';

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/markets/bulk', formData);
      setMessage(res.data.message);
    } catch (e: any) {
      setMessage('Upload failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Bulk Upload Questions (Excel)</h1>
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => e.target.files && setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600"
      />
      <button
        onClick={handleUpload}
        className="mt-6 bg-emerald-500 hover:bg-emerald-600 px-10 py-4 rounded-2xl text-xl font-semibold"
      >
        Upload to Database
      </button>
      {message && <p className="mt-6 text-emerald-400 text-xl">{message}</p>}
    </div>
  );
}
