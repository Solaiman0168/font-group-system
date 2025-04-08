import React from 'react';
import axiosInstance from '../utils/axiosInstance';

const FontList = ({ fonts, onFontDeleted }) => {
  const handleDelete = async (fontId) => {
    try {
      const response = await axiosInstance.delete(`/deleteFont?id=${fontId}`);
      console.log("response", response);
      if (response.data.status === 'success') {
        onFontDeleted(fontId);
        Swal.fire({
          icon: 'success',
          title: response.data.data,
        })
      }
    } catch (error) {
      console.error('Error deleting font:', error);
    }
  };

  console.log("fonts", fonts);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h3 className="text-2xl font-semibold mb-4">Uploaded Fonts</h3>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 text-black">No</th>
            <th className="px-4 py-2 text-black">Font Name</th>
            <th className="px-4 py-2 text-black">Preview</th>
            <th className="px-4 py-2 text-black">Action</th>
          </tr>
        </thead>
        <tbody>
          {fonts.map((font, index) => (
            <tr key={font.id}>
              <td className="px-4 py-2 text-black">{index + 1}</td>
              <td className="px-4 py-2 text-black">{font.name}</td>
              <td className="px-4 py-2 text-black">
              <style>
                  {`
                    @font-face {
                      font-family: '${font.name}';
                      src: url('${import.meta.env.VITE_API_BASE_URL}/uploads/fonts/${font.file_path}') format('truetype');
                    }
                    .font-preview-${index} {
                      font-family: '${font.name}';
                    }
                  `}
                </style>
                {/* <style>
                  {`
                    @font-face {
                      font-family: '${font.name}';
                      src: url('${font.file_path}') format('truetype');
                    }
                    .font-preview-${index} {
                      font-family: '${font.name}';
                    }
                  `}
                </style> */}
                <div className={`font-preview-${index}`}>
                  Example style in {font.name}
                </div>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDelete(font.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FontList;
