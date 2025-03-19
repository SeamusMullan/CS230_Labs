import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Albums.css';

const Albums = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [albums, setAlbums] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    releaseYear: '',
    numListens: '',
    songs: []
  });
  const [songName, setSongName] = useState('');
  const [updateId, setUpdateId] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const apiUrl = 'http://localhost:1234/api/albums';

  useEffect(() => {
    if (activeTab === 'retrieve') {
      fetchAlbums();
    }
  }, [activeTab]);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(apiUrl);
      setAlbums(response.data);
      setResponseMessage(`${response.data.length} albums retrieved successfully`);
    } catch (error) {
      console.error('Error fetching albums:', error);
      setResponseMessage('Error fetching albums. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSongInputChange = (e) => {
    setSongName(e.target.value);
  };

  const addSong = () => {
    if (songName.trim()) {
      setFormData({
        ...formData,
        songs: [...formData.songs, { name: songName.trim() }]
      });
      setSongName('');
    }
  };

  const removeSong = (index) => {
    const updatedSongs = [...formData.songs];
    updatedSongs.splice(index, 1);
    setFormData({ ...formData, songs: updatedSongs });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl, formData);
      setResponseMessage('Album created successfully!');
      setFormData({ name: '', artist: '', releaseYear: '', numListens: '', songs: [] });
    } catch (error) {
      console.error('Error creating album:', error);
      setResponseMessage('Error creating album. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/${updateId}`, formData);
      setResponseMessage('Album updated successfully!');
      setFormData({ name: '', artist: '', releaseYear: '', numListens: '', songs: [] });
      setUpdateId(null);
    } catch (error) {
      console.error('Error updating album:', error);
      setResponseMessage('Error updating album. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setAlbums(albums.filter(album => album.id !== id));
      setResponseMessage('Album deleted successfully!');
    } catch (error) {
      console.error('Error deleting album:', error);
      setResponseMessage('Error deleting album. Please try again.');
    }
  };

  const prepareUpdate = (album) => {
    setFormData({
      name: album.name,
      artist: album.artist,
      releaseYear: album.release_year,
      numListens: album.num_listens,
      songs: typeof album.songs === 'string' ? JSON.parse(album.songs) : (album.songs || [])
    });
    setUpdateId(album.id);
    setActiveTab('update');
  };

  return (
    <div className="albums-container">
      <h1>Albums</h1>
      
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
          <h2>Create New Album</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="name">Album Name</label>
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
              <label htmlFor="artist">Artist</label>
              <input
                type="text"
                id="artist"
                name="artist"
                className="form-control"
                value={formData.artist}
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
              <label htmlFor="numListens">Number of Listens</label>
              <input
                type="number"
                id="numListens"
                name="numListens"
                className="form-control"
                value={formData.numListens}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Songs</label>
              <div className="song-input-container">
                <input
                  type="text"
                  id="songName"
                  className="form-control"
                  value={songName}
                  onChange={handleSongInputChange}
                  placeholder="Enter song name"
                />
                <button type="button" className="btn btn-secondary" onClick={addSong}>Add Song</button>
              </div>
              
              {formData.songs.length > 0 && (
                <div className="songs-list">
                  <h4>Album Songs:</h4>
                  <ul>
                    {formData.songs.map((song, index) => (
                      <li key={index}>
                        {song.name}
                        <button 
                          type="button" 
                          className="btn-remove" 
                          onClick={() => removeSong(index)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <button type="submit" className="btn btn-primary">Create Album</button>
          </form>
        </div>
      )}

      {activeTab === 'update' && (
        <div className="form-container">
          <h2>Update Album</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="name">Album Name</label>
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
              <label htmlFor="artist">Artist</label>
              <input
                type="text"
                id="artist"
                name="artist"
                className="form-control"
                value={formData.artist}
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
              <label htmlFor="numListens">Number of Listens</label>
              <input
                type="number"
                id="numListens"
                name="numListens"
                className="form-control"
                value={formData.numListens}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Songs</label>
              <div className="song-input-container">
                <input
                  type="text"
                  id="songName"
                  className="form-control"
                  value={songName}
                  onChange={handleSongInputChange}
                  placeholder="Enter song name"
                />
                <button type="button" className="btn btn-secondary" onClick={addSong}>Add Song</button>
              </div>
              
              {formData.songs.length > 0 && (
                <div className="songs-list">
                  <h4>Album Songs:</h4>
                  <ul>
                    {formData.songs.map((song, index) => (
                      <li key={index}>
                        {song.name}
                        <button 
                          type="button" 
                          className="btn-remove" 
                          onClick={() => removeSong(index)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <button type="submit" className="btn btn-primary">Update Album</button>
          </form>
        </div>
      )}

      {activeTab === 'retrieve' && (
        <div className="data-display">
          <h2 className="data-header">All Albums</h2>
          {albums.length > 0 ? (
            albums.map(album => {
              const albumSongs = typeof album.songs === 'string' 
                ? JSON.parse(album.songs) 
                : (album.songs || []);
                
              return (
                <div className="data-item" key={album.id}>
                  <h3>{album.name}</h3>
                  <p><strong>Artist:</strong> {album.artist}</p>
                  <p><strong>Release Year:</strong> {album.release_year}</p>
                  <p><strong>Number of Listens:</strong> {album.num_listens}</p>
                  
                  {albumSongs.length > 0 && (
                    <div className="album-songs">
                      <p><strong>Songs:</strong></p>
                      <ul>
                        {albumSongs.map((song, index) => (
                          <li key={index}>{song.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="action-buttons">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => prepareUpdate(album)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleDelete(album.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No albums found. Create some albums first!</p>
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

export default Albums;
