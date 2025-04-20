import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Therapists.css';

const Therapists = () => {
  const [activeTab, setActiveTab] = useState('retrieve');
  const [therapists, setTherapists] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    email: '',
    location: '',
    years_practice: '',
    availability: 'TAKING CLIENTS'
  });
  const [updateId, setUpdateId] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const apiUrl = 'http://localhost:1234/api/therapists';

  useEffect(() => {
    if (activeTab === 'retrieve') {
      fetchTherapists();
    }
  }, [activeTab]);

  const fetchTherapists = async () => {
    try {
      const response = await axios.get(apiUrl);
      setTherapists(response.data);
      setResponseMessage(`${response.data.length} therapists retrieved successfully`);
    } catch (error) {
      console.error('Error fetching therapists:', error);
      setResponseMessage('Error fetching therapists. Please try again.');
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
      setResponseMessage('Therapist created successfully!');
      setFormData({
        title: '',
        name: '',
        email: '',
        location: '',
        years_practice: '',
        availability: 'TAKING CLIENTS'
      });
      
      // Refresh data
      fetchTherapists();
      setActiveTab('retrieve');
    } catch (error) {
      console.error('Error creating therapist:', error);
      setResponseMessage('Error creating therapist. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/${updateId}`, formData);
      setResponseMessage('Therapist updated successfully!');
      setFormData({
        title: '',
        name: '',
        email: '',
        location: '',
        years_practice: '',
        availability: 'TAKING CLIENTS'
      });
      setUpdateId(null);
      
      // Refresh data
      fetchTherapists();
      setActiveTab('retrieve');
    } catch (error) {
      console.error('Error updating therapist:', error);
      setResponseMessage('Error updating therapist. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setTherapists(therapists.filter(therapist => therapist.id !== id));
      setResponseMessage('Therapist deleted successfully!');
    } catch (error) {
      console.error('Error deleting therapist:', error);
      setResponseMessage('Error deleting therapist. Please try again.');
    }
  };

  const prepareUpdate = (therapist) => {
    setFormData({
      title: therapist.title,
      name: therapist.name,
      email: therapist.email,
      location: therapist.location,
      years_practice: therapist.years_practice,
      availability: therapist.availability
    });
    setUpdateId(therapist.id);
    setActiveTab('update');
  };

  return (
    <div className="therapists-container">
      <div className="therapists-header">
        <h1 className="therapists-title">Therapists</h1>
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
          View All
        </button>
        <button 
          className={`crud-tab ${activeTab === 'update' ? 'active' : ''}`}
          onClick={() => setActiveTab('update')}
          disabled={!updateId}
        >
          Edit
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="form-container">
          <h2>Add New Therapist</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Dr., Prof., etc."
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Office location"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="years_practice">Years of Practice</label>
              <input
                type="number"
                id="years_practice"
                name="years_practice"
                className="form-control"
                value={formData.years_practice}
                onChange={handleInputChange}
                placeholder="Years of practice"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="availability">Availability</label>
              <select
                id="availability"
                name="availability"
                className="form-control"
                value={formData.availability}
                onChange={handleInputChange}
                required
              >
                <option value="TAKING CLIENTS">Taking Clients</option>
                <option value="NOT TAKING CLIENTS">Not Taking Clients</option>
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary">Create Therapist</button>
          </form>
        </div>
      )}

      {activeTab === 'update' && updateId && (
        <div className="form-container">
          <h2>Edit Therapist</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
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
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="years_practice">Years of Practice</label>
              <input
                type="number"
                id="years_practice"
                name="years_practice"
                className="form-control"
                value={formData.years_practice}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="availability">Availability</label>
              <select
                id="availability"
                name="availability"
                className="form-control"
                value={formData.availability}
                onChange={handleInputChange}
                required
              >
                <option value="TAKING CLIENTS">Taking Clients</option>
                <option value="NOT TAKING CLIENTS">Not Taking Clients</option>
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary">Update Therapist</button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => {
                setUpdateId(null);
                setFormData({
                  title: '',
                  name: '',
                  email: '',
                  location: '',
                  years_practice: '',
                  availability: 'TAKING CLIENTS'
                });
                setActiveTab('retrieve');
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {activeTab === 'retrieve' && (
        <div className="data-display">
          <h2 className="data-header">All Therapists</h2>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Years of Practice</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {therapists.length > 0 ? (
                  therapists.map(therapist => (
                    <tr key={therapist.id}>
                      <td>{therapist.title}</td>
                      <td>{therapist.name}</td>
                      <td>{therapist.email}</td>
                      <td>{therapist.location}</td>
                      <td>{therapist.years_practice}</td>
                      <td>
                        <span className={`status ${therapist.availability === 'TAKING CLIENTS' ? 'status-active' : 'status-inactive'}`}>
                          {therapist.availability === 'TAKING CLIENTS' ? 'Taking Clients' : 'Not Taking Clients'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-icon edit-btn"
                          onClick={() => prepareUpdate(therapist)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon delete-btn"
                          onClick={() => handleDelete(therapist.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No therapists found. Create some therapists first!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

export default Therapists;
