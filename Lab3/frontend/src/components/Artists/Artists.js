import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Artists.css';

const Artists = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [artists, setArtists] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    monthlyListeners: '',
    genre: ''
  });
  const [updateId, setUpdateId] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const apiUrl = 'http://localhost:1234/api/artists';

  useEffect(() => {
    if (activeTab === 'retrieve') {
      fetchArtists();
    }
  }, [activeTab]);

  const fetchArtists = async () => {
    try {
      const response = await axios.get(apiUrl);
      setArtists(response.data);
      setResponseMessage(`${response.data.length} artists retrieved successfully`);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setResponseMessage('Error fetching artists. Please try again.');
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
      setResponseMessage('Artist created successfully!');
      setFormData({ name: '', monthlyListeners: '', genre: '' });
    } catch (error) {
      console.error('Error creating artist:', error);
      setResponseMessage('Error creating artist. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/${updateId}`, formData);
      setResponseMessage('Artist updated successfully!');
      setFormData({ name: '', monthlyListeners: '', genre: '' });
      setUpdateId(null);
    } catch (error) {
      console.error('Error updating artist:', error);
      setResponseMessage('Error updating artist. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setArtists(artists.filter(artist => artist.id !== id));
      setResponseMessage('Artist deleted successfully!');
    } catch (error) {
      console.error('Error deleting artist:', error);
      setResponseMessage('Error deleting artist. Please try again.');
    }
  };

  const prepareUpdate = (artist) => {
    setFormData({
      name: artist.name,
      monthlyListeners: artist.monthlyListeners,
      genre: artist.genre
    });
    setUpdateId(artist.id);
    setActiveTab('update');
  };

  return (
    <div className="artists-container">
      <h1>Artists</h1>
      
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
          <h2>Create New Artist</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="name">Artist Name</label>
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
              <label htmlFor="monthlyListeners">Monthly Listeners</label>
              <input
                type="number"
                id="monthlyListeners"
                name="monthlyListeners"
                className="form-control"
                value={formData.monthlyListeners}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <input
                type="text"
                id="genre"
                name="genre"
                className="form-control"
                value={formData.genre}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">Create Artist</button>
          </form>
        </div>
      )}

      {activeTab === 'update' && (
        <div className="form-container">
          <h2>Update Artist</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="name">Artist Name</label>
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
              <label htmlFor="monthlyListeners">Monthly Listeners</label>
              <input
                type="number"
                id="monthlyListeners"
                name="monthlyListeners"
                className="form-control"
                value={formData.monthlyListeners}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <input
                type="text"
                id="genre"
                name="genre"
                className="form-control"
                value={formData.genre}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">Update Artist</button>
          </form>
        </div>
      )}

      {activeTab === 'retrieve' && (
        <div className="data-display">
          <h2 className="data-header">All Artists</h2>
          {artists.length > 0 ? (
            artists.map(artist => (
              <div className="data-item" key={artist.id}>
                <h3>{artist.name}</h3>
                <p><strong>Monthly Listeners:</strong> {artist.monthlyListeners}</p>
                <p><strong>Genre:</strong> {artist.genre}</p>
                <div className="action-buttons">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => prepareUpdate(artist)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleDelete(artist.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No artists found. Create some artists first!</p>
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

export default Artists;
