import React, { useState, useEffect } from 'react';
import FontUpload from './components/FontUpload';
import FontList from './components/FontList';
import FontGroup from './components/FontGroup';
import GroupList from './components/GroupList';
import axiosInstance from './utils/axiosInstance'; // Ensure this path is correct

function App() {
  const [fonts, setFonts] = useState([]);
  const [groups, setGroups] = useState([]);

  // Fetch fonts from the server
  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await axiosInstance.get('/getFonts');
        if (response.data.status === 'success') {
          setFonts(response.data.data); // Set fonts in the state
        }
      } catch (error) {
        console.error('Error fetching fonts:', error);
      }
    };

    fetchFonts();
  }, []);

  // Fetch groups from the server
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axiosInstance.get('/getGroups');
        if (response.data.status === 'success') {
          setGroups(response.data.data); // Set groups in the state
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  // Function to add a new font to the list (called after successful upload)
  const handleFontUploaded = (newFont) => {
    setFonts((prevFonts) => [...prevFonts, newFont]);
  };

  // Function to add a new group to the list (called after successful group creation)
  const handleGroupCreated = (newGroup) => {
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  };


  // Function to delete a font from the list (called after successful delete)
  const handleFontDeleted = (fontId) => {
    setFonts((prevFonts) => prevFonts.filter((font) => font.id !== fontId));
  };

  // Function to delete a group from the list (called after successful delete)
  const handleGroupDeleted = (groupId) => {
    setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
  };

  // Function to update a group in the list (called after successful update)
  const handleGroupUpdated = (updatedGroup) => {
    setGroups((prevGroups) => prevGroups.map((group) => group.id === updatedGroup.id ? updatedGroup : group));
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Font Group System</h1>
        
        {/* Pass functions to child components to update their data */}
        <FontUpload onFontUploaded={handleFontUploaded} />
        <FontList fonts={fonts} onFontDeleted={handleFontDeleted} />
        <FontGroup onGroupCreated={handleGroupCreated} />
        <GroupList 
          groups={groups} 
          onGroupDeleted={handleGroupDeleted} 
          onGroupUpdated={handleGroupUpdated} 
          fontOptions={fonts}  // Passing font options here
        />
      </div>
    </div>
  );
}

export default App;
