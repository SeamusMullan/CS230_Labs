import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JourneyPlans.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:1234/api';

// Helper to get token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper to parse comma-separated strings into arrays
const parseList = (listString) => {
    return listString.split(',').map(item => item.trim()).filter(item => item !== '');
};

// Helper to format array into comma-separated string
const formatList = (listArray) => {
    return Array.isArray(listArray) ? listArray.join(', ') : '';
};

const JourneyPlans = () => {
    const [journeyPlans, setJourneyPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingPlan, setEditingPlan] = useState(null); // Plan being edited
    const [newPlan, setNewPlan] = useState({ // For creating new plan
        name: '',
        locations: '', // Input as comma-separated string
        start_date: '',
        end_date: '',
        activities: '', // Input as comma-separated string
        description: ''
    });

    // Fetch plans on component mount
    useEffect(() => {
        fetchJourneyPlans();
    }, []);

    const fetchJourneyPlans = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_URL}/journey-plans`, { headers: getAuthHeaders() });
            setJourneyPlans(response.data);
        } catch (err) {
            console.error('Fetch error:', err.response || err.message);
            setError(err.response?.data?.error || 'Failed to fetch journey plans. Please ensure you are logged in.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e, isNewPlan = false) => {
        const { name, value } = e.target;
        if (isNewPlan) {
            setNewPlan({ ...newPlan, [name]: value });
        } else if (editingPlan) {
            setEditingPlan({ ...editingPlan, [name]: value });
        }
    };

    const handleCreatePlan = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = {
                ...newPlan,
                locations: parseList(newPlan.locations),
                activities: parseList(newPlan.activities)
            };
            const response = await axios.post(`${API_URL}/journey-plans`, payload, { headers: getAuthHeaders() });
            setJourneyPlans([...journeyPlans, response.data]); // Add new plan to state
            setNewPlan({ name: '', locations: '', start_date: '', end_date: '', activities: '', description: '' }); // Reset form
        } catch (err) {
            console.error('Create error:', err.response || err.message);
            setError(err.response?.data?.error || 'Failed to create journey plan.');
        }
    };

    const handleUpdatePlan = async (e) => {
        e.preventDefault();
        if (!editingPlan) return;
        setError('');
        try {
            const payload = {
                ...editingPlan,
                locations: parseList(editingPlan.locations),
                activities: parseList(editingPlan.activities)
            };
            const response = await axios.put(`${API_URL}/journey-plans/${editingPlan.id}`, payload, { headers: getAuthHeaders() });
            setJourneyPlans(journeyPlans.map(plan => (plan.id === editingPlan.id ? response.data : plan)));
            setEditingPlan(null); // Exit editing mode
        } catch (err) {
            console.error('Update error:', err.response || err.message);
            setError(err.response?.data?.error || 'Failed to update journey plan.');
        }
    };

    const handleDeletePlan = async (id) => {
        if (!window.confirm('Are you sure you want to delete this journey plan?')) return;
        setError('');
        try {
            await axios.delete(`${API_URL}/journey-plans/${id}`, { headers: getAuthHeaders() });
            setJourneyPlans(journeyPlans.filter(plan => plan.id !== id));
        } catch (err) {
            console.error('Delete error:', err.response || err.message);
            setError(err.response?.data?.error || 'Failed to delete journey plan.');
        }
    };

    // Start editing a plan
    const startEditing = (plan) => {
        // Convert arrays back to comma-separated strings for editing
        setEditingPlan({
            ...plan,
            locations: formatList(plan.locations),
            activities: formatList(plan.activities)
        });
    };

    return (
        <div className="journey-plans-container">
            <h2>My Journey Plans</h2>

            {error && <div className="error-message">{error}</div>}

            {/* Create New Plan Form */}
            <div className="plan-form create-plan-form">
                <h3>Add New Journey Plan</h3>
                <form onSubmit={handleCreatePlan}>
                    <input type="text" name="name" value={newPlan.name} onChange={(e) => handleInputChange(e, true)} placeholder="Plan Name" required />
                    <input type="text" name="locations" value={newPlan.locations} onChange={(e) => handleInputChange(e, true)} placeholder="Locations (comma-separated)" />
                    <input type="date" name="start_date" value={newPlan.start_date} onChange={(e) => handleInputChange(e, true)} required />
                    <input type="date" name="end_date" value={newPlan.end_date} onChange={(e) => handleInputChange(e, true)} required />
                    <input type="text" name="activities" value={newPlan.activities} onChange={(e) => handleInputChange(e, true)} placeholder="Activities (comma-separated)" />
                    <textarea name="description" value={newPlan.description} onChange={(e) => handleInputChange(e, true)} placeholder="Description"></textarea>
                    <button type="submit">Add Plan</button>
                </form>
            </div>

            {isLoading && <p>Loading plans...</p>}

            {/* Display Plans */}
            <div className="plans-list">
                {journeyPlans.length === 0 && !isLoading && <p>No journey plans found. Add one above!</p>}
                {journeyPlans.map(plan => (
                    <div key={plan.id} className="plan-item">
                        {editingPlan && editingPlan.id === plan.id ? (
                            /* Edit Form */
                            <form onSubmit={handleUpdatePlan} className="plan-form edit-plan-form">
                                <input type="text" name="name" value={editingPlan.name} onChange={handleInputChange} placeholder="Plan Name" required />
                                <input type="text" name="locations" value={editingPlan.locations} onChange={handleInputChange} placeholder="Locations (comma-separated)" />
                                <input type="date" name="start_date" value={editingPlan.start_date.split('T')[0]} onChange={handleInputChange} required />
                                <input type="date" name="end_date" value={editingPlan.end_date.split('T')[0]} onChange={handleInputChange} required />
                                <input type="text" name="activities" value={editingPlan.activities} onChange={handleInputChange} placeholder="Activities (comma-separated)" />
                                <textarea name="description" value={editingPlan.description} onChange={handleInputChange} placeholder="Description"></textarea>
                                <button type="submit">Save Changes</button>
                                <button type="button" onClick={() => setEditingPlan(null)}>Cancel</button>
                            </form>
                        ) : (
                            /* Display Plan */
                            <>
                                <h3>{plan.name}</h3>
                                <p>{plan.description}</p>
                                <p><strong>Dates:</strong> {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}</p>
                                {plan.locations && plan.locations.length > 0 && (
                                    <p><strong>Locations:</strong> {plan.locations.join(', ')}</p>
                                )}
                                {plan.activities && plan.activities.length > 0 && (
                                    <p><strong>Activities:</strong> {plan.activities.join(', ')}</p>
                                )}
                                <div className="plan-actions">
                                    <button onClick={() => startEditing(plan)}>Edit</button>
                                    <button onClick={() => handleDeletePlan(plan.id)} className="delete-button">Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JourneyPlans;
