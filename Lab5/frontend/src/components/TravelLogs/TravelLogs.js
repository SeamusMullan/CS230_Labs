import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TravelLogs.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:1234/api';

// Helper to get token for authentication headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const TravelLogs = () => {
    const [travelLogs, setTravelLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingLog, setEditingLog] = useState(null); // Log being edited
    const [newLog, setNewLog] = useState({ // For creating new log
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        tags: '' // Input as comma-separated string
    });

    // Fetch logs on component mount
    useEffect(() => {
        fetchTravelLogs();
    }, []);

    const fetchTravelLogs = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_URL}/travel-logs`, { headers: getAuthHeaders() });
            setTravelLogs(response.data);
        } catch (err) {
            console.error('Fetch error:', err.response || err.message);
            setError(err.response?.data?.error || 'Failed to fetch travel logs. Please ensure you are logged in.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e, isNewLog = false) => {
        const { name, value } = e.target;
        if (isNewLog) {
            setNewLog({ ...newLog, [name]: value });
        } else if (editingLog) {
            setEditingLog({ ...editingLog, [name]: value });
        }
    };

    // Parse comma-separated strings into arrays
    const parseTagsString = (tagsString) => {
        return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    };

    // Format array into comma-separated string
    const formatTagsArray = (tagsArray) => {
        return Array.isArray(tagsArray) ? tagsArray.join(', ') : '';
    };

    const handleCreateLog = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = {
                ...newLog,
                tags: parseTagsString(newLog.tags)
            };
            const response = await axios.post(`${API_URL}/travel-logs`, payload, { headers: getAuthHeaders() });
            setTravelLogs([...travelLogs, response.data]); // Add new log to state
            setNewLog({ title: '', description: '', start_date: '', end_date: '', tags: '' }); // Reset form
        } catch (err) {
            console.error('Create error:', err.response || err.message);
            setError(err.response?.data?.error || 'Failed to create travel log.');
        }
    };

    const handleUpdateLog = async (e) => {
        e.preventDefault();
        if (!editingLog) return;
        setError('');
        try {
            const payload = {
                ...editingLog,
                tags: parseTagsString(editingLog.tags)
            };
            const response = await axios.put(`${API_URL}/travel-logs/${editingLog.id}`, payload, { headers: getAuthHeaders() });
            setTravelLogs(travelLogs.map(log => (log.id === editingLog.id ? response.data : log)));
            setEditingLog(null); // Exit editing mode
        } catch (err) {
            console.error('Update error:', err.response || err.message);
            setError(err.response?.data?.error || 'Failed to update travel log.');
        }
    };

    const handleDeleteLog = async (id) => {
        if (!window.confirm('Are you sure you want to delete this travel log?')) return;
        setError('');
        try {
            await axios.delete(`${API_URL}/travel-logs/${id}`, { headers: getAuthHeaders() });
            setTravelLogs(travelLogs.filter(log => log.id !== id));
        } catch (err) {
            console.error('Delete error:', err.response || err.message);
            setError(err.response?.data?.error || 'Failed to delete travel log.');
        }
    };

    // Start editing a log
    const startEditing = (log) => {
        setEditingLog({
            ...log,
            tags: formatTagsArray(log.tags),
            start_date: log.start_date.split('T')[0], // Format date for input field
            end_date: log.end_date.split('T')[0] // Format date for input field
        });
    };

    return (
        <div className="travel-logs-container">
            <h2>My Travel Logs</h2>

            {error && <div className="error-message">{error}</div>}

            {/* Create New Log Form */}
            <div className="log-form create-log-form">
                <h3>Add New Travel Log</h3>
                <form onSubmit={handleCreateLog}>
                    <input 
                        type="text" 
                        name="title" 
                        value={newLog.title} 
                        onChange={(e) => handleInputChange(e, true)} 
                        placeholder="Log Title" 
                        required 
                    />
                    <textarea 
                        name="description" 
                        value={newLog.description} 
                        onChange={(e) => handleInputChange(e, true)} 
                        placeholder="Description"
                    />
                    <div className="date-inputs">
                        <div>
                            <label>Start Date:</label>
                            <input 
                                type="date" 
                                name="start_date" 
                                value={newLog.start_date} 
                                onChange={(e) => handleInputChange(e, true)} 
                                required 
                            />
                        </div>
                        <div>
                            <label>End Date:</label>
                            <input 
                                type="date" 
                                name="end_date" 
                                value={newLog.end_date} 
                                onChange={(e) => handleInputChange(e, true)} 
                                required 
                            />
                        </div>
                    </div>
                    <input 
                        type="text" 
                        name="tags" 
                        value={newLog.tags} 
                        onChange={(e) => handleInputChange(e, true)} 
                        placeholder="Tags (comma-separated)" 
                    />
                    <button type="submit">Add Log</button>
                </form>
            </div>

            {isLoading && <p>Loading logs...</p>}

            {/* Display Logs */}
            <div className="logs-list">
                {travelLogs.length === 0 && !isLoading && <p>No travel logs found. Add one above!</p>}
                {travelLogs.map(log => (
                    <div key={log.id} className="log-item">
                        {editingLog && editingLog.id === log.id ? (
                            /* Edit Form */
                            <form onSubmit={handleUpdateLog} className="log-form edit-log-form">
                                <input 
                                    type="text" 
                                    name="title" 
                                    value={editingLog.title} 
                                    onChange={handleInputChange} 
                                    placeholder="Log Title" 
                                    required 
                                />
                                <textarea 
                                    name="description" 
                                    value={editingLog.description || ''} 
                                    onChange={handleInputChange} 
                                    placeholder="Description"
                                />
                                <div className="date-inputs">
                                    <div>
                                        <label>Start Date:</label>
                                        <input 
                                            type="date" 
                                            name="start_date" 
                                            value={editingLog.start_date} 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label>End Date:</label>
                                        <input 
                                            type="date" 
                                            name="end_date" 
                                            value={editingLog.end_date} 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <input 
                                    type="text" 
                                    name="tags" 
                                    value={editingLog.tags} 
                                    onChange={handleInputChange} 
                                    placeholder="Tags (comma-separated)" 
                                />
                                <div className="form-actions">
                                    <button type="submit">Save Changes</button>
                                    <button type="button" onClick={() => setEditingLog(null)}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            /* Display Log */
                            <>
                                <h3>{log.title}</h3>
                                <p className="log-description">{log.description}</p>
                                <div className="log-details">
                                    <p className="log-dates"><strong>Dates:</strong> {new Date(log.start_date).toLocaleDateString()} - {new Date(log.end_date).toLocaleDateString()}</p>
                                    <p className="log-post-date"><strong>Posted on:</strong> {new Date(log.post_date).toLocaleDateString()}</p>
                                </div>
                                {log.tags && log.tags.length > 0 && (
                                    <p className="log-tags">
                                        <strong>Tags:</strong> {log.tags.map((tag, idx) => (
                                            <span key={idx} className="tag">{tag}</span>
                                        ))}
                                    </p>
                                )}
                                <div className="log-actions">
                                    <button onClick={() => startEditing(log)}>Edit</button>
                                    <button onClick={() => handleDeleteLog(log.id)} className="delete-button">Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TravelLogs;
