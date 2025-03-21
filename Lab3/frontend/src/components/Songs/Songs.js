import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Songs.css';

const Songs = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    artistId: '',
    album: '',
    albumId: '',
    releaseYear: ''
  });
  const [updateId, setUpdateId] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const apiUrl = 'http://localhost:1234/api/songs';
  const artistsApiUrl = 'http://localhost:1234/api/artists';
  const albumsApiUrl = 'http://localhost:1234/api/albums';

  useEffect(() => {
    if (activeTab === 'retrieve') {
      fetchSongs();
    } else if (activeTab === 'create' || activeTab === 'update') {
      fetchArtists();
      fetchAlbums();
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

  const fetchArtists = async () => {
    try {
      const response = await axios.get(artistsApiUrl);
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(albumsApiUrl);
      setAlbums(response.data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  // Filter albums by artist if an artist is selected
  const getFilteredAlbums = () => {
    if (formData.artistId) {
      return albums.filter(album => album.artist_id === formData.artistId);
    }
    return albums;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'artist') {
      const selectedArtist = artists.find(artist => artist.name === value);
      if (selectedArtist) {
        // If selecting an artist, update artistId and clear albumId
        setFormData({ 
          ...formData, 
          artist: value, 
          artistId: selectedArtist.id,
          album: '',
          albumId: '' 
        });
      } else {
        setFormData({ 
          ...formData, 
          artist: value, 
          artistId: '',
          album: '',
          albumId: '' 
        });
      }
    } else if (name === 'album') {
      const selectedAlbum = albums.find(album => album.name === value);
      if (selectedAlbum) {
        // If selecting an album, update albumId and also set the artist if not already set
        if (!formData.artistId && selectedAlbum.artist_id) {
          const albumArtist = artists.find(artist => artist.id === selectedAlbum.artist_id);
          setFormData({
            ...formData,
            album: value,
            albumId: selectedAlbum.id,
            artist: albumArtist ? albumArtist.name : '',
            artistId: selectedAlbum.artist_id
          });
        } else {
          setFormData({
            ...formData,
            album: value,
            albumId: selectedAlbum.id
          });
        }
      } else {
        setFormData({
          ...formData,
          album: value,
          albumId: ''
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl, formData);
      setResponseMessage('Song created successfully!');
      setFormData({
        name: '',
        artist: '',
        artistId: '',
        album: '',
        albumId: '',
        releaseYear: ''
      });
      
      // Refresh songs data
      fetchSongs();
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
      setFormData({
        name: '',
        artist: '',
        artistId: '',
        album: '',
        albumId: '',
        releaseYear: ''
      });
      setUpdateId(null);
      
      // Refresh songs data
      fetchSongs();
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
      artist: song.artist_name || '',
      artistId: song.artist_id || '',
      album: song.album_name || '',
      albumId: song.album_id || '',
      releaseYear: song.release_year || ''
    });
    setUpdateId(song.id);
    setActiveTab('update');
  };

  // Render artist options for dropdown
  const renderArtistOptions = () => {
    return artists.map(artist => (
      <option key={artist.id} value={artist.name}>
        {artist.name}
      </option>
    ));
  };

  // Render album options for dropdown (filtered by artist if applicable)
  const renderAlbumOptions = () => {
    return getFilteredAlbums().map(album => (
      <option key={album.id} value={album.name}>
        {album.name} {album.artist_name ? `(by ${album.artist_name})` : ''}
      </option>
    ));
  };

  return (
    <div className="songs-container">
      <div className="songs-header">
        <h1 className="songs-title">Songs</h1>
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
                placeholder="Enter song name"
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
              <label htmlFor="album">Album (Optional)</label>
              <input
                type="text"
                id="album"
                name="album"
                className="form-control"
                value={formData.album}
                onChange={handleInputChange}
                list="album-options"
                placeholder="Select an existing album or type a new one"
              />
              <datalist id="album-options">
                {renderAlbumOptions()}
              </datalist>
              <small className="form-text">
                Select an existing album or type a new album name to create one
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
              <label htmlFor="album">Album (Optional)</label>
              <input
                type="text"
                id="album"
                name="album"
                className="form-control"
                value={formData.album}
                onChange={handleInputChange}
                list="album-options-update"
                placeholder="Select an existing album or type a new one"
              />
              <datalist id="album-options-update">
                {renderAlbumOptions()}
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
            
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        </div>
      )}

      {activeTab === 'retrieve' && (
        <div className="data-display">
          <h2 className="data-header">All Songs</h2>
          {songs.length > 0 ? (
            songs.map(song => (
              <div className="data-item" key={song.id}>
                <div className="song-details">
                  <h3>{song.name}</h3>
                  <p><strong>Artist:</strong> {song.artist_name || 'Unknown'}</p>
                  <p><strong>Release Year:</strong> {song.release_year}</p>
                  {song.album_name && (
                    <p><strong>Album:</strong> {song.album_name}</p>
                  )}
                </div>
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
