import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import eventApi from '../apiConfig/eventApi';
import { Trash2, Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const navigate = useNavigate();

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching events...');
      const response = await eventApi.getAllEvents();
      console.log('Events response:', response);
      
      if (Array.isArray(response)) {
        setEvents(response);
      } else if (response?.data) {
        setEvents(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle delete event
  const handleDelete = async () => {
    try {
      setError(null);
      await eventApi.deleteEvent(selectedEventId);
      setEvents(events.filter(event => event.id !== selectedEventId));
      setShowDeleteModal(false);
      setSelectedEventId(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.message || 'Failed to delete event');
    }
  };

  // Show delete confirmation modal
  const confirmDelete = (eventId) => {
    setSelectedEventId(eventId);
    setShowDeleteModal(true);
  };

  // View event details
  const handleView = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Event Management</h2>
        <Button 
          variant="outline-primary"
          onClick={fetchEvents}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "me-2 spin" : "me-2"} />
          Refresh
        </Button>
      </div>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading events...</p>
        </div>
      ) : (
        <>
          {events.length === 0 ? (
            <Alert variant="info">
              No events found.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
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
                      <td>{event.category || 'N/A'}</td>
                      <td>{formatDate(event.dates?.[0]?.startDate)}</td>
                      <td>{event.venue || 'N/A'}</td>
                      <td>
                        <span className={`badge bg-${event.is_active ? 'success' : 'danger'}`}>
                          {event.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleView(event.id)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => confirmDelete(event.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this event? This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .table-responsive {
          margin-bottom: 1rem;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .table {
          margin-bottom: 0;
        }
        
        .badge {
          padding: 0.5em 0.75em;
          font-weight: 500;
        }
      `}</style>
    </Container>
  );
};

export default EventManagement;


