import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Artists.css';

const Artists = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
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
  const albumsApiUrl = 'http://localhost:1234/api/albums';
  const songsApiUrl = 'http://localhost:1234/api/songs';

  useEffect(() => {
    if (activeTab === 'retrieve') {
      fetchArtists();
    } else if (activeTab === 'create' || activeTab === 'update') {
      // Fetch albums and songs for dropdowns
      fetchAllAlbums();
      fetchAllSongs();
    }
  }, [activeTab]);

  const fetchArtists = async () => {
    try {
      const response = await axios.get(apiUrl);
      setArtists(response.data);
      setResponseMessage(`✓ ${response.data.length} artists retrieved successfully`);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setResponseMessage('Error fetching artists. Please try again.');
    }
  };

  const fetchAllAlbums = async () => {
    try {
      const response = await axios.get(albumsApiUrl);
      setAlbums(response.data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const fetchAllSongs = async () => {
    try {
      const response = await axios.get(songsApiUrl);
      setSongs(response.data);
    } catch (error) {
      console.error('Error fetching songs:', error);
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
      // Check if album exists in the dropdown
      const existingAlbum = albums.find(album => album.name === albumName.trim());
      
      if (existingAlbum) {
        // Add existing album with its ID
        setFormData({
          ...formData,
          albums: [...formData.albums, { 
            id: existingAlbum.id,
            name: existingAlbum.name,
            isExisting: true 
          }]
        });
      } else {
        // Add new album
        setFormData({
          ...formData,
          albums: [...formData.albums, { 
            name: albumName.trim(),
            isExisting: false 
          }]
        });
      }
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
      // Check if song exists in the dropdown
      const existingSong = songs.find(song => song.name === songName.trim());
      
      if (existingSong) {
        // Add existing song with its ID
        setFormData({
          ...formData,
          songs: [...formData.songs, { 
            id: existingSong.id,
            name: existingSong.name,
            isExisting: true 
          }]
        });
      } else {
        // Add new song
        setFormData({
          ...formData,
          songs: [...formData.songs, { 
            name: songName.trim(),
            isExisting: false 
          }]
        });
      }
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
      setResponseMessage('Artist created successfully!');
      setFormData({ name: '', monthlyListeners: '', genre: '', albums: [], songs: [] });
      
      // Refresh data
      fetchAllAlbums();
      fetchAllSongs();
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
      setFormData({ name: '', monthlyListeners: '', genre: '', albums: [], songs: [] });
      setUpdateId(null);
      
      // Refresh data
      fetchAllAlbums();
      fetchAllSongs();
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
      
      // Refresh related data since cascading deletes may have occurred
      fetchAllAlbums();
      fetchAllSongs();
    } catch (error) {
      console.error('Error deleting artist:', error);
      setResponseMessage('Error deleting artist. Please try again.');
    }
  };

  const prepareUpdate = (artist) => {
    setFormData({
      name: artist.name,
      monthlyListeners: artist.monthly_listeners,
      genre: artist.genre,
      albums: artist.albums || [],
      songs: artist.songs || []
    });
    setUpdateId(artist.id);
    setActiveTab('update');
  };

  // For selecting existing albums/songs from dropdowns
  const renderAlbumOptions = () => {
    return albums.map(album => (
      <option key={album.id} value={album.name}>
        {album.name} ({album.artist_name || 'Unknown Artist'})
      </option>
    ));
  };

  const renderSongOptions = () => {
    return songs.map(song => (
      <option key={song.id} value={song.name}>
        {song.name} ({song.artist_name || 'Unknown Artist'})
      </option>
    ));
  };

  return (
    <div className="artists-container">
      <div className="artists-header">
        <h1 className="artists-title">Artists</h1>
      </div>
      
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
          Browse
        </button>
        <button 
          className={`crud-tab ${activeTab === 'update' ? 'active' : ''}`}
          onClick={() => setActiveTab('update')}
        >
          Edit
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
                placeholder="Enter artist name"
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
                placeholder="Enter number of monthly listeners"
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
                placeholder="Enter music genre"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Albums</label>
              <div className="album-input-container">
                <input
                  type="text"
                  className="form-control"
                  value={albumName}
                  onChange={handleAlbumInputChange}
                  list="album-options"
                  placeholder="Select or type a new album"
                />
                <datalist id="album-options">
                  {renderAlbumOptions()}
                </datalist>
                <button type="button" className="btn btn-secondary" onClick={addAlbum}>Add</button>
              </div>
              
              {formData.albums.length > 0 && (
                <div className="albums-list">
                  <h4>Artist Albums</h4>
                  <ul>
                    {formData.albums.map((album, index) => (
                      <li key={index} className={album.isExisting ? 'existing-item' : ''}>
                        {album.name}
                        {album.isExisting && <span className="existing-badge">Existing</span>}
                        <button 
                          type="button" 
                          className="btn-remove" 
                          onClick={() => removeAlbum(index)}
                        >
                          x
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Songs</label>
              <div className="song-input-container">
                <input
                  type="text"
                  className="form-control"
                  value={songName}
                  onChange={handleSongInputChange}
                  list="song-options"
                  placeholder="Select or type a new song"
                />
                <datalist id="song-options">
                  {renderSongOptions()}
                </datalist>
                <button type="button" className="btn btn-secondary" onClick={addSong}>Add</button>
              </div>
              
              {formData.songs.length > 0 && (
                <div className="songs-list">
                  <h4>Artist Songs</h4>
                  <ul>
                    {formData.songs.map((song, index) => (
                      <li key={index} className={song.isExisting ? 'existing-item' : ''}>
                        {song.name}
                        {song.isExisting && <span className="existing-badge">Existing</span>}
                        <button 
                          type="button" 
                          className="btn-remove" 
                          onClick={() => removeSong(index)}
                        >
                          x
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
            
            <div className="form-group">
              <label>Albums</label>
              <div className="album-input-container">
                <input
                  type="text"
                  className="form-control"
                  value={albumName}
                  onChange={handleAlbumInputChange}
                  list="album-options-update"
                  placeholder="Select or type a new album"
                />
                <datalist id="album-options-update">
                  {renderAlbumOptions()}
                </datalist>
                <button type="button" className="btn btn-secondary" onClick={addAlbum}>Add</button>
              </div>
              
              {formData.albums.length > 0 && (
                <div className="albums-list">
                  <h4>Artist Albums</h4>
                  <ul>
                    {formData.albums.map((album, index) => (
                      <li key={index} className={album.isExisting ? 'existing-item' : ''}>
                        {album.name}
                        {album.isExisting && <span className="existing-badge">Existing</span>}
                        <button 
                          type="button" 
                          className="btn-remove" 
                          onClick={() => removeAlbum(index)}
                        >
                          x
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Songs</label>
              <div className="song-input-container">
                <input
                  type="text"
                  className="form-control"
                  value={songName}
                  onChange={handleSongInputChange}
                  list="song-options-update"
                  placeholder="Select or type a new song"
                />
                <datalist id="song-options-update">
                  {renderSongOptions()}
                </datalist>
                <button type="button" className="btn btn-secondary" onClick={addSong}>Add</button>
              </div>
              
              {formData.songs.length > 0 && (
                <div className="songs-list">
                  <h4>Artist Songs</h4>
                  <ul>
                    {formData.songs.map((song, index) => (
                      <li key={index} className={song.isExisting ? 'existing-item' : ''}>
                        {song.name}
                        {song.isExisting && <span className="existing-badge">Existing</span>}
                        <button 
                          type="button" 
                          className="btn-remove" 
                          onClick={() => removeSong(index)}
                        >
                          x
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        </div>
      )}

      {activeTab === 'retrieve' && (
        <div className="data-display">
          <h2 className="data-header">All Artists</h2>
          {artists.length > 0 ? (
            artists.map(artist => {
              const artistAlbums = artist.albums || [];
              const artistSongs = artist.songs || [];
                
              return (
                <div className="data-item" key={artist.id}>
                  <h3>{artist.name}</h3>
                  <p><strong>Monthly Listeners:</strong> {artist.monthly_listeners}</p>
                  <p><strong>Genre:</strong> {artist.genre}</p>
                  
                  {artistAlbums.length > 0 && (
                    <div className="artist-albums">
                      <p><strong>Albums:</strong></p>
                      <ul>
                        {artistAlbums.map((album, index) => (
                          <li key={index}>{album.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {artistSongs.length > 0 && (
                    <div className="artist-songs">
                      <p><strong>Songs:</strong></p>
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
              );
            })
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
