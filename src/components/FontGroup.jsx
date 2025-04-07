import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const FontGroup = () => {
  const [title, setTitle] = useState('');
  const [fontOptions, setFontOptions] = useState([]); // Ensure it's initialized as an empty array
  const [fontIds, setFontIds] = useState([{ fontId: '' }]);

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await axiosInstance.get('/getFonts');
        
        // Ensure that response.data.data is an array
        if (Array.isArray(response.data.data)) {
          setFontOptions(response.data.data); // Set font options to the data array from API response
        } else {
          console.error('Error: Fonts data is not in the correct format', response.data);
        }
      } catch (error) {
        console.error('Error fetching fonts:', error);
      }
    };

    fetchFonts();
  }, []);

  const handleFontChange = (e, index) => {
    const newFontIds = [...fontIds];
    newFontIds[index].fontId = e.target.value;
    setFontIds(newFontIds);
  };

  const handleAddRow = () => {
    setFontIds([...fontIds, { fontId: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fontIds.length < 2) {
      alert('You must select at least two fonts.');
      return;
    }

    const groupData = {
      title,
      font_ids: fontIds.map(f => f.fontId),
    };

    try {
      await axiosInstance.post('/createGroup', groupData);
      alert('Font group created successfully.');
    } catch (error) {
      console.error('Error creating font group:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h3 className="text-2xl font-semibold mb-4">Create Font Group</h3>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Group Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        {fontIds.map((font, index) => (
          <div key={index} className="mb-4 flex items-center">
            {/* Ensure that fontOptions is an array before mapping */}
            <select
              value={font.fontId}
              onChange={(e) => handleFontChange(e, index)}
              className="py-2 px-3 border border-gray-300 rounded mr-4"
              required
            >
              <option value="">Select a Font</option>
              {Array.isArray(fontOptions) && fontOptions.map((fontOption) => (
                <option key={fontOption.id} value={fontOption.id}>
                  {fontOption.name}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button type="button" onClick={handleAddRow} className="text-blue-500 hover:text-blue-700 mb-4">
          Add Row
        </button>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Create Font Group
        </button>
      </form>
    </div>
  );
};

export default FontGroup;
