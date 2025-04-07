// src/components/FontUpload.js
import React, { useState } from 'react';
// import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const FontUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a font file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axiosInstance.post('/createFont', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Font uploaded successfully.');
    } catch (error) {
      console.error('Error uploading font:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h3 className="text-2xl font-semibold mb-4">Upload Font (Only TTF allowed)</h3>
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-lg shadow-md">
        <input
          type="file"
          accept=".ttf"
          onChange={handleFileChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Upload Font
        </button>
      </form>
    </div>
  );
};

export default FontUpload;
