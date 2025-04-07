import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const FontList = () => {
  const [fonts, setFonts] = useState([]);

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await axiosInstance.get('/getFonts');
        
        // Check if response contains status "success" and data is an array
        if (response.data.status === "success" && Array.isArray(response.data.data)) {
          setFonts(response.data.data);  // Use only the 'data' array
        } else {
          console.error("API response is not in expected format:", response.data);
          setFonts([]);  // Set fonts to an empty array if response is not in expected format
        }
      } catch (error) {
        console.error('Error fetching fonts:', error);
      }
    };

    fetchFonts();
  }, []);

  // Check if fonts is an array before calling .map()
  if (!Array.isArray(fonts)) {
    return <div>Error: Fonts data is not available or not in the correct format</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h3 className="text-2xl font-semibold mb-4">Uploaded Fonts</h3>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Font Name</th>
            <th className="px-4 py-2">Preview</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {fonts.map((font) => (
            <tr key={font.id}>
              <td className="px-4 py-2">{font.name}</td>
              <td className="px-4 py-2">Example Style</td>
              <td className="px-4 py-2">
                <button className="text-red-500 hover:text-red-700">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FontList;
