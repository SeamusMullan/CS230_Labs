import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Clients.css';

const Clients = () => {
  const [activeTab, setActiveTab] = useState('retrieve');
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    appointment_regularity: 'WEEKLY'
  });
  const [updateId, setUpdateId] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const apiUrl = 'http://localhost:1234/api/clients';

  useEffect(() => {
    if (activeTab === 'retrieve') {
      fetchClients();
    }
  }, [activeTab]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(apiUrl);
      setClients(response.data);
      setResponseMessage(`${response.data.length} clients retrieved successfully`);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setResponseMessage('Error fetching clients. Please try again.');
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
      setResponseMessage('Client created successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        appointment_regularity: 'WEEKLY'
      });
      
      // Refresh data
      fetchClients();
      setActiveTab('retrieve');
    } catch (error) {
      console.error('Error creating client:', error);
      setResponseMessage('Error creating client. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/${updateId}`, formData);
      setResponseMessage('Client updated successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        appointment_regularity: 'WEEKLY'
      });
      setUpdateId(null);
      
      // Refresh data
      fetchClients();
      setActiveTab('retrieve');
    } catch (error) {
      console.error('Error updating client:', error);
      setResponseMessage('Error updating client. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setClients(clients.filter(client => client.id !== id));
      setResponseMessage('Client deleted successfully!');
    } catch (error) {
      console.error('Error deleting client:', error);
      setResponseMessage('Error deleting client. Please try again.');
    }
  };

  const prepareUpdate = (client) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      appointment_regularity: client.appointment_regularity
    });
    setUpdateId(client.id);
    setActiveTab('update');
  };

  return (
    <div className="clients-container">
      <div className="clients-header">
        <h1 className="clients-title">Clients</h1>
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
          <h2>Add New Client</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Client's full name"
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
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone number"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="appointment_regularity">Appointment Regularity</label>
              <select
                id="appointment_regularity"
                name="appointment_regularity"
                className="form-control"
                value={formData.appointment_regularity}
                onChange={handleInputChange}
                required
              >
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary">Create Client</button>
          </form>
        </div>
      )}

      {activeTab === 'update' && updateId && (
        <div className="form-container">
          <h2>Edit Client</h2>
          <form onSubmit={handleUpdate}>
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
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="appointment_regularity">Appointment Regularity</label>
              <select
                id="appointment_regularity"
                name="appointment_regularity"
                className="form-control"
                value={formData.appointment_regularity}
                onChange={handleInputChange}
                required
              >
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary">Update Client</button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => {
                setUpdateId(null);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  appointment_regularity: 'WEEKLY'
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
          <h2 className="data-header">All Clients</h2>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Appointment Regularity</th>
                  <th>Sessions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length > 0 ? (
                  clients.map(client => (
                    <tr key={client.id}>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                      <td>{client.phone}</td>
                      <td>
                        <span className={`regularity ${client.appointment_regularity === 'WEEKLY' ? 'regularity-weekly' : 'regularity-monthly'}`}>
                          {client.appointment_regularity === 'WEEKLY' ? 'Weekly' : 'Monthly'}
                        </span>
                      </td>
                      <td>{client.sessions_count || 0}</td>
                      <td>
                        <button 
                          className="btn-icon edit-btn"
                          onClick={() => prepareUpdate(client)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon delete-btn"
                          onClick={() => handleDelete(client.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">No clients found. Create some clients first!</td>
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

export default Clients;
