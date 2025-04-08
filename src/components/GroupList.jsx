import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Swal from 'sweetalert2'; // For success/error messages
import Select from 'react-select'; // Import React Select

const GroupList = ({ groups, onGroupDeleted, onGroupUpdated, fontOptions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedFontIds, setUpdatedFontIds] = useState([]);

  // console.log("groups::::::::", groups);

  const handleDelete = async (groupId) => {
    try {
      const response = await axiosInstance.delete(`/deleteGroup?id=${groupId}`);
      console.log("response", response);
      if (response.data.status === 'success') {
        onGroupDeleted(groupId); // Call the function passed down from App.js
        Swal.fire({
          icon: 'success',
          title: response.data.data,
        });
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'There was an error deleting the font group.',
      });
    }
  };

  const handleEditClick = (group) => {
    setGroupToEdit(group);
    setUpdatedTitle(group.title);
    setUpdatedFontIds(group.fonts.map(font => font.id)); // Assuming 'fonts' are part of the group
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
        const response = await axiosInstance.put(`/updateGroup?id=${groupToEdit.id}`, {
            title: updatedTitle,
            font_ids: updatedFontIds
        }, {
            headers: {
                'Content-Type': 'application/json',  // Make sure to set Content-Type to 'application/json'
            }
        });

        if (response.data.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Font Group Updated',
                text: 'Your font group has been successfully updated!',
            });

            // Update the font groups list without page reload
            onGroupUpdated(response.data.data);

            setIsModalOpen(false);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.data.message || 'There was an error updating the font group.',
            });
        }
    } catch (error) {
        console.error('Error updating font group:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an issue with the request. Please try again later.',
        });
    }
};


  const handleSelectChange = (selectedOptions) => {
    const selectedFontIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setUpdatedFontIds(selectedFontIds);
  };

  // Prepare font options for react-select
  const fontSelectOptions = fontOptions.map(font => ({
    value: font.id,
    label: font.name
  }));

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h3 className="text-2xl font-semibold mb-4">Font Groups</h3>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 text-black">No</th>
            <th className="px-4 py-2 text-black">Name</th>
            <th className="px-4 py-2 text-black">Fonts</th>
            <th className="px-4 py-2 text-black">COUNT</th>
            <th className="px-4 py-2 text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, index) => (
            <tr key={group.id}>
              <td className="px-4 py-2 text-black">{index + 1}</td>
              <td className="px-4 py-2 text-black">{group.title}</td>
              <td className="px-4 py-2 text-black">
                {group.fonts && group.fonts.length > 0
                  ? group.fonts.map(font => font.name).join(', ') // Extract and join font names
                  : 'No Fonts'}
              </td>
              <td className="px-4 py-2 text-black">{group?.fonts?.length || 0}</td>
              <td className="px-4 py-2 flex">
                <button onClick={() => handleEditClick(group)} className="text-blue-500 hover:text-blue-700">
                  Edit
                </button>
                <button onClick={() => handleDelete(group.id)} className="text-red-500 hover:text-red-700 ml-4">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing the group */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h3 className="text-xl font-semibold mb-4 text-black">Edit Font Group</h3>
            <input
              type="text"
              placeholder="Group Title"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
            />

            <div className="mb-4">
              <Select
                isMulti
                value={fontSelectOptions.filter(option => updatedFontIds.includes(option.value))}
                options={fontSelectOptions}
                onChange={handleSelectChange}
                className="w-full"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Update
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 active:bg-red-800"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupList;
