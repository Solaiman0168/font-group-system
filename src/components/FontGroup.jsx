import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Swal from 'sweetalert2'; // Import SweetAlert

const FontGroup = ({ onGroupCreated }) => {
  const [title, setTitle] = useState('');
  const [fontOptions, setFontOptions] = useState([]); // Store font options from API
  const [fontIds, setFontIds] = useState([{ fontId: '', fontName: '' }]); // Store font id and name

  // Fetch fonts on component mount
  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await axiosInstance.get('/getFonts');
        
        // Ensure that the response is in the correct format
        if (Array.isArray(response.data.data)) {
          setFontOptions(response.data.data); // Set font options
        } else {
          console.error('Error: Fonts data is not in the correct format', response.data);
        }
      } catch (error) {
        console.error('Error fetching fonts:', error);
      }
    };

    fetchFonts();
  }, []);

  // Handle font selection change
  const handleFontChange = async (e, index) => {
    const selectedFontId = e.target.value;
    const selectedFont = fontOptions.find(font => font.id === selectedFontId);

    // Update the fontId and fontName locally
    setFontIds((prevFontIds) => {
      const updatedFontIds = [...prevFontIds];
      updatedFontIds[index] = {
        fontId: selectedFontId,
        fontName: selectedFont ? selectedFont.name : '', // Set the font name from the selected font
      };

      return updatedFontIds;
    });

    // If fontId is selected, fetch additional font details (optional)
    if (selectedFontId) {
      try {
        const response = await axiosInstance.get(`/getFont?id=${selectedFontId}`);
        const fontName = response.data.data.name;
        // Update the fontName if font details are found
        setFontIds((prevFontIds) => {
          const updatedFontIds = [...prevFontIds];
          updatedFontIds[index].fontName = fontName;
          return updatedFontIds;
        });
      } catch (error) {
        console.error('Error fetching font details:', error);
      }
    }
  };

  // Add new row with font select input
  const handleAddRow = () => {
    setFontIds([...fontIds, { fontId: '', fontName: '' }]);
  };

  // Remove row functionality
  const handleRemoveRow = (index) => {
    const updatedFontIds = fontIds.filter((_, idx) => idx !== index);
    setFontIds(updatedFontIds);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fontIds.length < 2) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'You must select at least two fonts.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);

    // Append font_ids as an array
    fontIds.forEach((font) => {
      formData.append('font_ids[]', font.fontId); // Ensure it's an array
    });

    try {
      const response = await axiosInstance.post('/createGroup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Important to specify form-data
        },
      });

      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Font Group Created',
          text: 'Your font group has been successfully created!',
        });

        // Call onGroupCreated to update the group list in the parent component
        onGroupCreated(response.data.data);  // Assuming the response data contains the newly created group

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'There was an error creating the font group.',
        });
      }
    } catch (error) {
      console.error('Error creating font group:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an issue with the request. Please try again later.',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h3 className="text-2xl font-semibold mb-4">Create Font Group</h3>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Enter Group Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        />
        {fontIds.map((font, index) => (
          <div key={index} className="mb-4 flex items-center">
            {/* Input field for font name */}
            <input
              type="text"
              value={font.fontName}
              onChange={(e) => {
                const updatedFontIds = [...fontIds];
                updatedFontIds[index].fontName = e.target.value; // Update font name
                setFontIds(updatedFontIds);
              }}
              placeholder="Font Name"
              className="py-2 px-3 border border-gray-300 rounded mr-4 text-black"
            />

            {/* Font selection dropdown */}
            <select
              value={font.fontId}
              onChange={(e) => handleFontChange(e, index)}
              className="py-2 px-3 border border-gray-300 rounded mr-4 text-black"
              required
            >
              <option value="">Select a Font</option>
              {Array.isArray(fontOptions) && fontOptions.map((fontOption) => (
                <option key={fontOption.id} value={fontOption.id}>
                  {fontOption.name}
                </option>
              ))}
            </select>

            {/* Remove Row Button */}
            <button
              type="button"
              onClick={() => handleRemoveRow(index)}
              className="text-red-500 hover:text-red-700 ml-4"
              disabled={fontIds.length === 1}
            >
              Remove Row
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddRow}
          className="text-blue-500 hover:text-blue-700 mb-4"
        >
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
