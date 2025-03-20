import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Artists.css';

const Artists = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [artists, setArtists] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    monthlyListeners: '',
    genre: '',
    albums: [],
    songs: []
  });
  const [albumName, setAlbumName] = useState('');
  const [songName, setSongName] = useState('');
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
      setResponseMessage(`✅ ${response.data.length} artists retrieved successfully`);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setResponseMessage('❌ Error fetching artists. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAlbumInputChange = (e) => {
    setAlbumName(e.target.value);
  };

  const handleSongInputChange = (e) => {
    setSongName(e.target.value);
  };

  const addAlbum = () => {
    if (albumName.trim()) {
      setFormData({
        ...formData,
        albums: [...formData.albums, { name: albumName.trim() }]
      });
      setAlbumName('');
    }
  };

  const removeAlbum = (index) => {
    const updatedAlbums = [...formData.albums];
    updatedAlbums.splice(index, 1);
    setFormData({ ...formData, albums: updatedAlbums });
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
      setResponseMessage('✅ Artist created successfully!');
      setFormData({ name: '', monthlyListeners: '', genre: '', albums: [], songs: [] });
    } catch (error) {
      console.error('Error creating artist:', error);
      setResponseMessage('❌ Error creating artist. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/${updateId}`, formData);
      setResponseMessage('✅ Artist updated successfully!');
      setFormData({ name: '', monthlyListeners: '', genre: '', albums: [], songs: [] });
      setUpdateId(null);
    } catch (error) {
      console.error('Error updating artist:', error);
      setResponseMessage('❌ Error updating artist. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setArtists(artists.filter(artist => artist.id !== id));
      setResponseMessage('✅ Artist deleted successfully!');
    } catch (error) {
      console.error('Error deleting artist:', error);
      setResponseMessage('❌ Error deleting artist. Please try again.');
    }
  };

  const prepareUpdate = (artist) => {
    setFormData({
      name: artist.name,
      monthlyListeners: artist.monthly_listeners,
      genre: artist.genre,
      albums: typeof artist.albums === 'string' ? JSON.parse(artist.albums) : (artist.albums || []),
      songs: typeof artist.songs === 'string' ? JSON.parse(artist.songs) : (artist.songs || [])
    });
    setUpdateId(artist.id);
    setActiveTab('update');
  };

  return (
    <div className="artists-container">
      <div className="artists-header">
        <h1 className="artists-title">👩‍🎤 Artists</h1>
      </div>
      
      <div className="crud-tabs">
        <button 
          className={`crud-tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          ✨ Create
        </button>
        <button 
          className={`crud-tab ${activeTab === 'retrieve' ? 'active' : ''}`}
          onClick={() => setActiveTab('retrieve')}
        >
          🔍 Browse
        </button>
        <button 
          className={`crud-tab ${activeTab === 'update' ? 'active' : ''}`}
          onClick={() => setActiveTab('update')}
        >
          ✏️ Edit
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="form-container">
          <h2>✨ Create New Artist</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="name">👤 Artist Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter artist name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="monthlyListeners">👂 Monthly Listeners</label>
              <input
                type="number"
                id="monthlyListeners"
                name="monthlyListeners"
                className="form-control"
                value={formData.monthlyListeners}
                onChange={handleInputChange}
                placeholder="Enter number of monthly listeners"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="genre">🎭 Genre</label>
              <input
                type="text"
                id="genre"
                name="genre"
                className="form-control"
                value={formData.genre}
                onChange={handleInputChange}
                placeholder="Enter music genre"
                required
              />
            </div>
            
            <div className="form-group">
              <label>💿 Albums</label>
              <div className="album-input-container">
                <input
                  type="text"
                  id="albumName"
                  className="form-control"
                  value={albumName}
                  onChange={handleAlbumInputChange}
                  placeholder="Enter album name"
                />
                <button type="button" className="btn btn-secondary" onClick={addAlbum}>Add</button>
              </div>
              
              {formData.albums.length > 0 && (
                <div className="albums-list">
                  <h4>💿 Artist Albums</h4>
                  <ul>
                    {formData.albums.map((album, index) => (
                      <li key={index}>
                        {album.name}
                        <button 
                          type="button" 
                          className="btn-remove" 
                          onClick={() => removeAlbum(index)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>🎵 Songs</label>
              <div className="song-input-container">
                <input
                  type="text"
                  id="songName"
                  className="form-control"
                  value={songName}
                  onChange={handleSongInputChange}
                  placeholder="Enter song name"
                />
                <button type="button" className="btn btn-secondary" onClick={addSong}>Add</button>
              </div>
              
              {formData.songs.length > 0 && (
                <div className="songs-list">
                  <h4>🎵 Artist Songs</h4>
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
            
            <button type="submit" className="btn btn-primary">✨ Create Artist</button>
          </form>
        </div>
      )}

      {activeTab === 'update' && (
        <div className="form-container">
          <h2>✏️ Update Artist</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="name">👤 Artist Name</label>
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
              <label htmlFor="monthlyListeners">👂 Monthly Listeners</label>
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
              <label htmlFor="genre">🎭 Genre</label>
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
            
            <div className="form-group">
              <label>💿 Albums</label>
              <div className="album-input-container">
                <input
                  type="text"
                  id="albumName"
                  className="form-control"
                  value={albumName}
                  onChange={handleAlbumInputChange}
                  placeholder="Enter album name"
                />
                <button type="button" className="btn btn-secondary" onClick={addAlbum}>Add</button>
              </div>
              
              {formData.albums.length > 0 && (
                <div className="albums-list">
                  <h4>💿 Artist Albums</h4>
                  <ul>
                    {formData.albums.map((album, index) => (
                      <li key={index}>
                        {album.name}
                        <button 
                          type="button" 
                          className="btn-remove" 
                          onClick={() => removeAlbum(index)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>🎵 Songs</label>
              <div className="song-input-container">
                <input
                  type="text"
                  id="songName"
                  className="form-control"
                  value={songName}
                  onChange={handleSongInputChange}
                  placeholder="Enter song name"
                />
                <button type="button" className="btn btn-secondary" onClick={addSong}>Add</button>
              </div>
              
              {formData.songs.length > 0 && (
                <div className="songs-list">
                  <h4>🎵 Artist Songs</h4>
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
            
            <button type="submit" className="btn btn-primary">💾 Save Changes</button>
          </form>
        </div>
      )}

      {activeTab === 'retrieve' && (
        <div className="data-display">
          <h2 className="data-header">🎸 All Artists</h2>
          {artists.length > 0 ? (
            artists.map(artist => {
              const artistAlbums = typeof artist.albums === 'string' 
                ? JSON.parse(artist.albums) 
                : (artist.albums || []);
                
              const artistSongs = typeof artist.songs === 'string' 
                ? JSON.parse(artist.songs) 
                : (artist.songs || []);
                
              return (
                <div className="data-item" key={artist.id}>
                  <h3>{artist.name}</h3>
                  <p><strong>👂 Monthly Listeners:</strong> {artist.monthly_listeners}</p>
                  <p><strong>🎭 Genre:</strong> {artist.genre}</p>
                  
                  {artistAlbums.length > 0 && (
                    <div className="artist-albums">
                      <p><strong>💿 Albums:</strong></p>
                      <ul>
                        {artistAlbums.map((album, index) => (
                          <li key={index}>{album.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {artistSongs.length > 0 && (
                    <div className="artist-songs">
                      <p><strong>🎵 Songs:</strong></p>
                      <ul>
                        {artistSongs.map((song, index) => (
                          <li key={index}>{song.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="action-buttons">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => prepareUpdate(artist)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleDelete(artist.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No artists found. Create some artists first! ✨</p>
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
