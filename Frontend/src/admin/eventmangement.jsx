import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner } from 'react-bootstrap';
import axiosInstance from '../apiConfig/axiosConfig';
import { ENDPOINTS } from '../apiConfig/api';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN_EVENTS);
      setEvents(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load events');
      setLoading(false);
      console.error('Error fetching events:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'draft': 'secondary',
      'published': 'success',
      'cancelled': 'danger',
      'completed': 'info'
    };
    return <Badge bg={statusColors[status] || 'primary'}>{status}</Badge>;
  };

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Event Management</h2>
        <Button variant="primary">Add New Event</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
              <td>{event.location}</td>
              <td>{getStatusBadge(event.status)}</td>
              <td>
                <Button variant="info" size="sm" className="me-2">View</Button>
                <Button variant="warning" size="sm" className="me-2">Edit</Button>
                <Button variant="danger" size="sm">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EventManagement;