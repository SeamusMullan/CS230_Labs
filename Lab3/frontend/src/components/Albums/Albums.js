import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Albums.css';

const Albums = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    artistId: '',
    releaseYear: '',
    numListens: '',
    songs: []
  });
  const [songName, setSongName] = useState('');
  const [updateId, setUpdateId] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const apiUrl = 'http://localhost:1234/api/albums';
  const artistsApiUrl = 'http://localhost:1234/api/artists';
  const songsApiUrl = 'http://localhost:1234/api/songs';

  useEffect(() => {
    if (activeTab === 'retrieve') {
      fetchAlbums();
    } else if (activeTab === 'create' || activeTab === 'update') {
      fetchArtists();
      fetchAllSongs();
    }
  }, [activeTab]);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(apiUrl);
      // Make sure we're getting all associated songs
      setAlbums(response.data);
      setResponseMessage(`✓ ${response.data.length} albums retrieved successfully`);
    } catch (error) {
      console.error('Error fetching albums:', error);
      setResponseMessage('Error fetching albums. Please try again.');
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await axios.get(artistsApiUrl);
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
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
    
    // If selecting an artist from dropdown, set the artistId
    if (name === 'artist') {
      const selectedArtist = artists.find(artist => artist.name === value);
      if (selectedArtist) {
        setFormData({ ...formData, artist: value, artistId: selectedArtist.id });
      } else {
        setFormData({ ...formData, artist: value, artistId: '' });
      }
    }
  };

  const handleSongInputChange = (e) => {
    setSongName(e.target.value);
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
            artist_name: existingSong.artist_name,
            isExisting: true 
          }]
        });
      } else {
        // Add new song with the current artist ID
        setFormData({
          ...formData,
          songs: [...formData.songs, { 
            name: songName.trim(),
            artist_id: formData.artistId, // Associate with current artist
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
      // Include artist_id with the request
      const dataToSend = {
        ...formData,
        // Make sure songs have the correct properties
        songs: formData.songs.map(song => ({
          id: song.id,
          name: song.name,
          artist_id: song.artist_id || formData.artistId
        }))
      };
      
      const response = await axios.post(apiUrl, dataToSend);
      setResponseMessage('Album created successfully!');
      setFormData({ 
        name: '', 
        artist: '', 
        artistId: '', 
        releaseYear: '', 
        numListens: '', 
        songs: [] 
      });
      
      // Refresh data after creating
      fetchAlbums();
      fetchAllSongs();
    } catch (error) {
      console.error('Error creating album:', error);
      setResponseMessage('Error creating album. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Include artist_id with the request
      const dataToSend = {
        ...formData,
        // Make sure songs have the correct properties
        songs: formData.songs.map(song => ({
          id: song.id, 
          name: song.name,
          artist_id: song.artist_id || formData.artistId
        }))
      };
      
      const response = await axios.put(`${apiUrl}/${updateId}`, dataToSend);
      setResponseMessage('Album updated successfully!');
      setFormData({ 
        name: '', 
        artist: '', 
        artistId: '', 
        releaseYear: '', 
        numListens: '', 
        songs: [] 
      });
      setUpdateId(null);
      
      // Refresh data after updating
      fetchAlbums();
      fetchAllSongs();
    } catch (error) {
      console.error('Error updating album:', error);
      setResponseMessage('Error updating album. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setAlbums(albums.filter(album => album.id !== id));
      setResponseMessage('Album and all its songs deleted successfully!');
      
      // Refresh songs data as deletion cascades to songs
      fetchAllSongs();
    } catch (error) {
      console.error('Error deleting album:', error);
      setResponseMessage('Error deleting album. Please try again.');
    }
  };

  const prepareUpdate = (album) => {
    const albumSongs = album.songs || [];
    
    setFormData({
      name: album.name,
      artist: album.artist_name || '',
      artistId: album.artist_id || '',
      releaseYear: album.release_year || '',
      numListens: album.num_listens || 0,
      songs: albumSongs.map(song => ({
        id: song.id,
        name: song.name,
        artist_name: song.artist_name,
        isExisting: true
      }))
    });
    setUpdateId(album.id);
    setActiveTab('update');
  };

  // For selecting existing artists from dropdown
  const renderArtistOptions = () => {
    return artists.map(artist => (
      <option key={artist.id} value={artist.name}>
        {artist.name}
      </option>
    ));
  };

  // For selecting existing songs from dropdown
  const renderSongOptions = () => {
    return songs.map(song => (
      <option key={song.id} value={song.name}>
        {song.name} ({song.artist_name || 'Unknown Artist'})
      </option>
    ));
  };

  return (
    <div className="albums-container">
      <div className="albums-header">
        <h1 className="albums-title">Albums</h1>
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
                placeholder="Enter album name"
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
                list="artist-options"
                placeholder="Select an existing artist or type a new one"
                required
              />
              <datalist id="artist-options">
                {renderArtistOptions()}
              </datalist>
              <small className="form-text">
                Select an existing artist or type a new artist name to create one
              </small>
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
                placeholder="Enter release year"
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
                placeholder="Enter number of listens"
                required
              />
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
                  <h4>Album Songs</h4>
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
                list="artist-options-update"
                placeholder="Select an existing artist or type a new one"
                required
              />
              <datalist id="artist-options-update">
                {renderArtistOptions()}
              </datalist>
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
                  <h4>Album Songs</h4>
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
          <h2 className="data-header">All Albums</h2>
          {albums.length > 0 ? (
            albums.map(album => {
              const albumSongs = album.songs || [];
                
              return (
                <div className="data-item" key={album.id}>
                  <div className="album-cover"></div>
                  <h3>{album.name}</h3>
                  <p><strong>Artist:</strong> {album.artist_name || 'Unknown Artist'}</p>
                  <p><strong>Release Year:</strong> {album.release_year}</p>
                  <p><strong>Number of Listens:</strong> {album.num_listens}</p>
                  <p><strong>Number of Songs:</strong> {albumSongs.length}</p>
                  
                  {albumSongs.length > 0 && (
                    <div className="album-songs">
                      <p><strong>Songs:</strong></p>
                      <ul>
                        {albumSongs.map((song, index) => (
                          <li key={index}>
                            {song.name}
                            {song.artist_name && song.artist_name !== album.artist_name && 
                              <span className="song-artist"> (by {song.artist_name})</span>
                            }
                          </li>
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
