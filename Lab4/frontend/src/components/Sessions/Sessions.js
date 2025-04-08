import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sessions.css';

const Sessions = () => {
  const [activeTab, setActiveTab] = useState('retrieve');
  const [sessions, setSessions] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    therapist_id: '',
    client_id: '',
    notes: '',
    session_date: '',
    session_length: ''
  });
  const [updateId, setUpdateId] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const apiUrl = 'http://localhost:1234/api/sessions';
  const therapistsUrl = 'http://localhost:1234/api/therapists';
  const clientsUrl = 'http://localhost:1234/api/clients';

  useEffect(() => {
    if (activeTab === 'retrieve') {
      fetchSessions();
    } else if (activeTab === 'create' || activeTab === 'update') {
      fetchTherapistsAndClients();
    }
  }, [activeTab]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(apiUrl);
      setSessions(response.data);
      setResponseMessage(`${response.data.length} sessions retrieved successfully`);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setResponseMessage('Error fetching sessions. Please try again.');
    }
  };

  const fetchTherapistsAndClients = async () => {
    try {
      const therapistsResponse = await axios.get(therapistsUrl);
      setTherapists(therapistsResponse.data.filter(t => t.availability === 'TAKING CLIENTS'));
      
      const clientsResponse = await axios.get(clientsUrl);
      setClients(clientsResponse.data);
    } catch (error) {
      console.error('Error fetching therapists and clients:', error);
      setResponseMessage('Error fetching required data. Please try again.');
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
      setResponseMessage('Session created successfully!');
      setFormData({
        therapist_id: '',
        client_id: '',
        notes: '',
        session_date: '',
        session_length: ''
      });
      
      // Refresh data
      fetchSessions();
      setActiveTab('retrieve');
    } catch (error) {
      console.error('Error creating session:', error);
      setResponseMessage('Error creating session. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/${updateId}`, formData);
      setResponseMessage('Session updated successfully!');
      setFormData({
        therapist_id: '',
        client_id: '',
        notes: '',
        session_date: '',
        session_length: ''
      });
      setUpdateId(null);
      
      // Refresh data
      fetchSessions();
      setActiveTab('retrieve');
    } catch (error) {
      console.error('Error updating session:', error);
      setResponseMessage('Error updating session. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setSessions(sessions.filter(session => session.id !== id));
      setResponseMessage('Session deleted successfully!');
    } catch (error) {
      console.error('Error deleting session:', error);
      setResponseMessage('Error deleting session. Please try again.');
    }
  };

  const prepareUpdate = (session) => {
    setFormData({
      therapist_id: session.therapist_id,
      client_id: session.client_id,
      notes: session.notes,
      session_date: new Date(session.session_date).toISOString().split('T')[0],
      session_length: session.session_length
    });
    setUpdateId(session.id);
    setActiveTab('update');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format session length (minutes) to hours and minutes
  const formatSessionLength = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
    }
    return `${mins}m`;
  };

  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <h1 className="sessions-title">Sessions</h1>
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
          <h2>Add New Session</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="therapist_id">Therapist</label>
              <select
                id="therapist_id"
                name="therapist_id"
                className="form-control"
                value={formData.therapist_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Therapist</option>
                {therapists.map(therapist => (
                  <option key={therapist.id} value={therapist.id}>
                    {therapist.title} {therapist.name} ({therapist.location})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="client_id">Client</label>
              <select
                id="client_id"
                name="client_id"
                className="form-control"
                value={formData.client_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.appointment_regularity === 'WEEKLY' ? 'Weekly' : 'Monthly'})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="session_date">Session Date</label>
              <input
                type="date"
                id="session_date"
                name="session_date"
                className="form-control"
                value={formData.session_date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="session_length">Session Length (minutes)</label>
              <input
                type="number"
                id="session_length"
                name="session_length"
                className="form-control"
                value={formData.session_length}
                onChange={handleInputChange}
                placeholder="Length in minutes"
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Session notes"
                rows="4"
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary">Create Session</button>
          </form>
        </div>
      )}

      {activeTab === 'update' && updateId && (
        <div className="form-container">
          <h2>Edit Session</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="therapist_id">Therapist</label>
              <select
                id="therapist_id"
                name="therapist_id"
                className="form-control"
                value={formData.therapist_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Therapist</option>
                {therapists.map(therapist => (
                  <option key={therapist.id} value={therapist.id}>
                    {therapist.title} {therapist.name} ({therapist.location})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="client_id">Client</label>
              <select
                id="client_id"
                name="client_id"
                className="form-control"
                value={formData.client_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.appointment_regularity === 'WEEKLY' ? 'Weekly' : 'Monthly'})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="session_date">Session Date</label>
              <input
                type="date"
                id="session_date"
                name="session_date"
                className="form-control"
                value={formData.session_date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="session_length">Session Length (minutes)</label>
              <input
                type="number"
                id="session_length"
                name="session_length"
                className="form-control"
                value={formData.session_length}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary">Update Session</button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => {
                setUpdateId(null);
                setFormData({
                  therapist_id: '',
                  client_id: '',
                  notes: '',
                  session_date: '',
                  session_length: ''
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
          <h2 className="data-header">All Sessions</h2>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Therapist</th>
                  <th>Client</th>
                  <th>Length</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length > 0 ? (
                  sessions.map(session => (
                    <tr key={session.id}>
                      <td>{formatDate(session.session_date)}</td>
                      <td>{session.therapist_name}</td>
                      <td>{session.client_name}</td>
                      <td>{formatSessionLength(session.session_length)}</td>
                      <td className="notes-cell">
                        {session.notes ? 
                          (session.notes.length > 100 ? 
                            `${session.notes.substring(0, 100)}...` : 
                            session.notes) : 
                          <span className="no-notes">No notes</span>
                        }
                      </td>
                      <td>
                        <button 
                          className="btn-icon edit-btn"
                          onClick={() => prepareUpdate(session)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon delete-btn"
                          onClick={() => handleDelete(session.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">No sessions found. Create some sessions first!</td>
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

export default Sessions;
