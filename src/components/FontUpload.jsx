import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Swal from 'sweetalert2';

const FontUpload = ({ onFontUploaded }) => {
  const [file, setFile] = useState(null);

  const handleUploadTtfFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a font file.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/createFont', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("response", response.data.data);
      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Font Uploaded',
          text: "Font uploaded successfully.",
        });

        onFontUploaded(response.data.data); // Update font list after successful upload
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Error uploading font.',
        });
      }
    } catch (error) {
      console.error('Error uploading font:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'There was an error uploading the font.',
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <input
          type="file"
          accept=".ttf"
          onChange={handleUploadTtfFile}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
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
