import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const GroupList = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axiosInstance.get('/getGroups');
        
        // Check if the response data is an array and contains valid data
        if (Array.isArray(response.data.data)) {
          setGroups(response.data.data); // Set groups if it's an array
        } else {
          console.error('Error: Invalid data format for groups:', response.data);
        }
      } catch (error) {
        console.error('Error fetching font groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleEdit = (groupId) => {
    // Implement edit functionality
    console.log('Editing group with ID:', groupId);
  };

  const handleDelete = async (groupId) => {
    try {
      await axiosInstance.delete(`/deleteGroup/${groupId}`);
      alert('Font group deleted successfully.');
      // Optionally, re-fetch the groups after deletion
      fetchGroups();
    } catch (error) {
      console.error('Error deleting font group:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h3 className="text-2xl font-semibold mb-4">Font Groups</h3>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Fonts</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Ensure groups is an array before calling .map() */}
          {Array.isArray(groups) && groups.map((group) => (
            <tr key={group.id}>
              <td className="px-4 py-2">{group.title}</td>
              <td className="px-4 py-2">{group.fonts ? group.fonts.join(', ') : 'No Fonts'}</td>
              <td className="px-4 py-2">
                <button onClick={() => handleEdit(group.id)} className="text-yellow-500 hover:text-yellow-700 mr-4">
                  Edit
                </button>
                <button onClick={() => handleDelete(group.id)} className="text-red-500 hover:text-red-700">
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

export default GroupList;
