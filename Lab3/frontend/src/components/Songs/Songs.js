import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Songs.css';

const Songs = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [songs, setSongs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    releaseYear: '',
    album: ''
  });
  const [updateId, setUpdateId] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const apiUrl = 'http://localhost:1234/api/songs';

  useEffect(() => {
    if (activeTab === 'retrieve') {
      fetchSongs();
    }
  }, [activeTab]);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(apiUrl);
      setSongs(response.data);
      setResponseMessage(`${response.data.length} songs retrieved successfully`);
    } catch (error) {
      console.error('Error fetching songs:', error);
      setResponseMessage('Error fetching songs. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl, formData);
      setResponseMessage('Song created successfully!');
      setFormData({ name: '', releaseYear: '', album: '' });
    } catch (error) {
      console.error('Error creating song:', error);
      setResponseMessage('Error creating song. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/${updateId}`, formData);
      setResponseMessage('Song updated successfully!');
      setFormData({ name: '', releaseYear: '', album: '' });
      setUpdateId(null);
    } catch (error) {
      console.error('Error updating song:', error);
      setResponseMessage('Error updating song. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setSongs(songs.filter(song => song.id !== id));
      setResponseMessage('Song deleted successfully!');
    } catch (error) {
      console.error('Error deleting song:', error);
      setResponseMessage('Error deleting song. Please try again.');
    }
  };

  const prepareUpdate = (song) => {
    setFormData({
      name: song.name,
      releaseYear: song.releaseYear,
      album: song.album
    });
    setUpdateId(song.id);
    setActiveTab('update');
  };

  return (
    <div className="songs-container">
      <h1>Songs</h1>
      
      <div className="crud-tabs">
        <button 
          className={`crud-tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create
        </button>
        <button 
          className={`crud-tab ${activeTab === 'retrieve' ? 'active' : ''}`}
          onClick={() => setActiveTab('retrieve')}
        >
          Retrieve
        </button>
        <button 
          className={`crud-tab ${activeTab === 'update' ? 'active' : ''}`}
          onClick={() => setActiveTab('update')}
        >
          Update
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="form-container">
          <h2>Create New Song</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="name">Song Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="releaseYear">Release Year</label>
              <input
                type="number"
                id="releaseYear"
                name="releaseYear"
                className="form-control"
                value={formData.releaseYear}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="album">Album</label>
              <input
                type="text"
                id="album"
                name="album"
                className="form-control"
                value={formData.album}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">Create Song</button>
          </form>
        </div>
      )}

      {activeTab === 'update' && (
        <div className="form-container">
          <h2>Update Song</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="name">Song Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="releaseYear">Release Year</label>
              <input
                type="number"
                id="releaseYear"
                name="releaseYear"
                className="form-control"
                value={formData.releaseYear}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="album">Album</label>
              <input
                type="text"
                id="album"
                name="album"
                className="form-control"
                value={formData.album}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">Update Song</button>
          </form>
        </div>
      )}

      {activeTab === 'retrieve' && (
        <div className="data-container">
          <div className="data-display"></div>
          <h2 className="data-header">All Songs</h2>
          {songs.length > 0 ? (
            songs.map(song => (
              <div className="data-item" key={song.id}>
                <h3>{song.name}</h3>
                <p><strong>Release Year:</strong> {song.releaseYear}</p>
                <p><strong>Album:</strong> {song.album}</p>
                <div className="action-buttons">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => prepareUpdate(song)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleDelete(song.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No songs found. Create some songs first!</p>
          )}
        </div>
      )}
      
      {responseMessage && (
        <div className="response-message">
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default Songs;

