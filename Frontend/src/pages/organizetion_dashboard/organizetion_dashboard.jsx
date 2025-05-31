import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Modal } from "react-bootstrap";
import organizerApi from "../../apiConfig/organizerApi";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Trash2, Edit2 } from 'lucide-react';

const OrganizerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTickets: 0,
    revenue: 0
  });
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await organizerApi.getDashboardStats();
      console.log('Dashboard API Response:', response); // Debug log

      if (response?.status === 'success' && response?.data) {
        const { total_events, total_tickets_sold, total_revenue, recent_events } = response.data;
        
        console.log('Parsed Data:', { // Debug log
          total_events,
          total_tickets_sold,
          total_revenue,
          recent_events
        });

        setStats({
          totalEvents: total_events || 0,
          totalTickets: total_tickets_sold || 0,
          revenue: total_revenue || 0
        });
        setEvents(recent_events || []);
      } else {
        console.error('Invalid response format:', response); // Debug log
        throw new Error('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      if (error?.message === 'User is not an organizer') {
        setError('You must be logged in as an organizer to view this dashboard');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(error?.message || 'Error loading dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      setError(null);
      await organizerApi.deleteEvent(eventId);
      setSuccessMessage('Event deleted successfully!');
      await fetchDashboardData(); // Refresh data after deletion
      setShowDeleteModal(false);
      setEventToDelete(null);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Event deletion error:', error);
      setError(error?.message || 'Failed to delete event. Please try again.');
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  // Function to show delete confirmation modal
  const confirmDelete = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard data...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <h2 className="mb-4 text-center">Organizer Dashboard</h2>

      {/* Success Alert */}
      {successMessage && (
        <Alert 
          variant="success" 
          dismissible 
          onClose={() => setSuccessMessage(null)}
          className="mb-4 d-flex align-items-center"
        >
          <CheckCircle className="me-2" size={20} />
          {successMessage}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert 
          variant="danger" 
          dismissible 
          onClose={() => setError(null)} 
          className="mb-4 d-flex align-items-center"
        >
          <AlertCircle className="me-2" size={20} />
          <div>
            <Alert.Heading>Error</Alert.Heading>
            <p className="mb-0">{error}</p>
          </div>
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow text-center h-100">
            <Card.Body>
              <Card.Title className="text-primary">Total Events</Card.Title>
              <Card.Text style={{ fontSize: "2rem" }}>{stats.totalEvents}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow text-center h-100">
            <Card.Body>
              <Card.Title className="text-success">Total Tickets Sold</Card.Title>
              <Card.Text style={{ fontSize: "2rem" }}>{stats.totalTickets}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow text-center h-100">
            <Card.Body>
              <Card.Title className="text-info">Total Revenue</Card.Title>
              <Card.Text style={{ fontSize: "2rem" }}>
                ${typeof stats.revenue === 'number' ? stats.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Card.Title>Recent Events</Card.Title>
            <Button 
              variant="primary" 
              onClick={() => navigate('/organizer/events/create')}
            >
              Create New Event
            </Button>
          </div>
          
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Tickets Sold</th>
                  <th>Price Range</th>
                  <th>Revenue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      {error ? 'Failed to load events' : 'No events to display'}
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{new Date(event.created_at).toLocaleDateString()}</td>
                      <td>
                        {event.total_tickets_sold || 0}/{event.total_tickets || 0}
                      </td>
                      <td>
                        ${event.min_price === event.max_price 
                          ? event.min_price.toFixed(2)
                          : `${event.min_price.toFixed(2)} - ${event.max_price.toFixed(2)}`}
                      </td>
                      <td>${(event.total_revenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td>
                        <span className={`badge ${event.is_active ? 'bg-success' : 'bg-secondary'}`}>
                          {event.is_active ? 'Active' : 'Ended'}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => navigate(`/organizer/events/edit/${event.id}`)}
                        >
                          <Edit2 size={16} className="me-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => confirmDelete(event)}
                        >
                          <Trash2 size={16} className="me-1" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the event:</p>
          <p className="fw-bold text-danger">{eventToDelete?.title}</p>
          <p className="mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDeleteEvent(eventToDelete?.id)}
          >
            Delete Event
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .badge {
          padding: 0.5em 0.75em;
          font-weight: 500;
        }
        
        .alert {
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .alert-success {
          border-left: 4px solid #198754;
        }
        
        .alert-danger {
          border-left: 4px solid #dc3545;
        }
        
        .modal-content {
          border-radius: 12px;
        }
        
        .modal-header {
          border-bottom: 1px solid #dee2e6;
          background-color: #f8f9fa;
          border-radius: 12px 12px 0 0;
        }
        
        .modal-footer {
          border-top: 1px solid #dee2e6;
          background-color: #f8f9fa;
          border-radius: 0 0 12px 12px;
        }
      `}</style>
    </Container>
  );
};

export default OrganizerDashboard;