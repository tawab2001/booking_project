// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Modal } from "react-bootstrap";
// import organizerApi from "../../apiConfig/organizerApi";
// import { useNavigate } from "react-router-dom";
// import { CheckCircle, AlertCircle, Trash2, Edit2 } from 'lucide-react';

// const OrganizerDashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [eventToDelete, setEventToDelete] = useState(null);
//   const [stats, setStats] = useState({
//     totalEvents: 0,
//     totalTickets: 0,
//     revenue: 0
//   });
//   const [events, setEvents] = useState([]);
//   const navigate = useNavigate();

//   // Custom styles
//   const styles = {
//     badge: {
//       padding: '0.5em 0.75em',
//       fontWeight: 500
//     },
//     alert: {
//       borderRadius: '8px',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//     },
//     alertSuccess: {
//       borderLeft: '4px solid #198754'
//     },
//     alertDanger: {
//       borderLeft: '4px solid #dc3545'
//     },
//     modal: {
//       content: {
//         borderRadius: '12px'
//       },
//       header: {
//         borderBottom: '1px solid #dee2e6',
//         backgroundColor: '#f8f9fa',
//         borderRadius: '12px 12px 0 0'
//       },
//       footer: {
//         borderTop: '1px solid #dee2e6',
//         backgroundColor: '#f8f9fa',
//         borderRadius: '0 0 12px 12px'
//       }
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await organizerApi.getDashboardStats();
//       console.log('Dashboard API Response:', response); // Debug log

//       if (response?.status === 'success' && response?.data) {
//         const { total_events, total_tickets_sold, total_revenue, recent_events } = response.data;
        
//         console.log('Parsed Data:', { // Debug log
//           total_events,
//           total_tickets_sold,
//           total_revenue,
//           recent_events
//         });

//         setStats({
//           totalEvents: total_events || 0,
//           totalTickets: total_tickets_sold || 0,
//           revenue: total_revenue || 0
//         });
//         setEvents(recent_events || []);
//       } else {
//         console.error('Invalid response format:', response); // Debug log
//         throw new Error('Invalid data format received from server');
//       }
//     } catch (error) {
//       console.error('Dashboard data fetch error:', error);
//       if (error?.message === 'User is not an organizer') {
//         setError('You must be logged in as an organizer to view this dashboard');
//         setTimeout(() => navigate('/login'), 3000);
//       } else {
//         setError(error?.message || 'Error loading dashboard data. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteEvent = async (eventId) => {
//     try {
//       setError(null);
//       await organizerApi.deleteEvent(eventId);
//       setSuccessMessage('Event deleted successfully!');
//       await fetchDashboardData(); // Refresh data after deletion
//       setShowDeleteModal(false);
//       setEventToDelete(null);
      
//       // Auto-hide success message after 3 seconds
//       setTimeout(() => {
//         setSuccessMessage(null);
//       }, 3000);
//     } catch (error) {
//       console.error('Event deletion error:', error);
//       setError(error?.message || 'Failed to delete event. Please try again.');
//       setShowDeleteModal(false);
//       setEventToDelete(null);
//     }
//   };

//   // Function to show delete confirmation modal
//   const confirmDelete = (event) => {
//     setEventToDelete(event);
//     setShowDeleteModal(true);
//   };

//   if (loading) {
//     return (
//       <Container className="text-center py-5">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">Loading dashboard data...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="py-5" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
//       <h2 className="mb-4 text-center">Organizer Dashboard</h2>

//       {/* Success Alert */}
//       {successMessage && (
//         <Alert 
//           variant="success" 
//           dismissible 
//           onClose={() => setSuccessMessage(null)}
//           className="mb-4 d-flex align-items-center"
//           style={{ ...styles.alert, ...styles.alertSuccess }}
//         >
//           <CheckCircle className="me-2" size={20} />
//           {successMessage}
//         </Alert>
//       )}

//       {/* Error Alert */}
//       {error && (
//         <Alert 
//           variant="danger" 
//           dismissible 
//           onClose={() => setError(null)} 
//           className="mb-4 d-flex align-items-center"
//           style={{ ...styles.alert, ...styles.alertDanger }}
//         >
//           <AlertCircle className="me-2" size={20} />
//           <div>
//             <Alert.Heading>Error</Alert.Heading>
//             <p className="mb-0">{error}</p>
//           </div>
//         </Alert>
//       )}

//       <Row className="mb-4">
//         <Col md={4}>
//           <Card className="shadow text-center h-100">
//             <Card.Body>
//               <Card.Title className="text-primary">Total Events</Card.Title>
//               <Card.Text style={{ fontSize: "2rem" }}>{stats.totalEvents}</Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="shadow text-center h-100">
//             <Card.Body>
//               <Card.Title className="text-success">Total Tickets Sold</Card.Title>
//               <Card.Text style={{ fontSize: "2rem" }}>{stats.totalTickets}</Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="shadow text-center h-100">
//             <Card.Body>
//               <Card.Title className="text-info">Total Revenue</Card.Title>
//               <Card.Text style={{ fontSize: "2rem" }}>
//                 ${typeof stats.revenue === 'number' ? stats.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
//               </Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Card className="shadow">
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <Card.Title>Recent Events</Card.Title>
//             <Button 
//               variant="primary" 
//               onClick={() => navigate('/addEvent')}
//               className="d-flex align-items-center"
//             >
//               <i className="bi bi-plus-circle me-2"></i>
//               Create New Event
//             </Button>
//           </div>
          
//           <div className="table-responsive">
//             <Table striped hover>
//               <thead>
//                 <tr>
//                   <th>Event Name</th>
//                   <th>Date</th>
//                   <th>Tickets Sold</th>
//                   <th>Price Range</th>
//                   <th>Revenue</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {events.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="text-center">
//                       {error ? 'Failed to load events' : 'No events to display'}
//                     </td>
//                   </tr>
//                 ) : (
//                   events.map((event) => (
//                     <tr key={event.id}>
//                       <td>{event.title}</td>
//                       <td>{new Date(event.created_at).toLocaleDateString()}</td>
//                       <td>
//                         {event.total_tickets_sold || 0}/{event.total_tickets || 0}
//                       </td>
//                       <td>
//                         ${event.min_price === event.max_price 
//                           ? event.min_price.toFixed(2)
//                           : `${event.min_price.toFixed(2)} - ${event.max_price.toFixed(2)}`}
//                       </td>
//                       <td>${(event.total_revenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
//                       <td>
//                         <span className={`badge ${event.is_active ? 'bg-success' : 'bg-secondary'}`}>
//                           {event.is_active ? 'Active' : 'Ended'}
//                         </span>
//                       </td>
//                       <td>
//                         <Button
//                           variant="outline-primary"
//                           size="sm"
//                           className="me-2"
//                           onClick={() => navigate(`/organizer/events/edit/${event.id}`)}
//                         >
//                           <Edit2 size={16} className="me-1" />
//                           Edit
//                         </Button>
//                         <Button
//                           variant="outline-danger"
//                           size="sm"
//                           onClick={() => confirmDelete(event)}
//                         >
//                           <Trash2 size={16} className="me-1" />
//                           Delete
//                         </Button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </Table>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
//         <Modal.Header closeButton style={styles.modal.header}>
//           <Modal.Title>Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Are you sure you want to delete the event:</p>
//           <p className="fw-bold text-danger">{eventToDelete?.title}</p>
//           <p className="mb-0">This action cannot be undone.</p>
//         </Modal.Body>
//         <Modal.Footer style={styles.modal.footer}>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             Cancel
//           </Button>
//           <Button 
//             variant="danger" 
//             onClick={() => handleDeleteEvent(eventToDelete?.id)}
//           >
//             Delete Event
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default OrganizerDashboard;
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";
import organizerApi from "../../apiConfig/organizerApi";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Trash2, Edit2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './organizerDashboard.css'; // New CSS file for custom styles

const OrganizerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTickets: 0,
    revenue: 0,
    withdrawableEarnings: 0
  });
  const [events, setEvents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    paymentMethod: 'paypal',
    paymentDetails: ''
  });
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await organizerApi.getDashboardStats();
      console.log('Dashboard API Response:', JSON.stringify(response, null, 2));

      if (response?.status === 'success' && response?.data) {
        const { total_events, total_tickets_sold, total_revenue, recent_events, withdrawable_earnings } = response.data;
        
        console.log('Parsed Data:', {
          total_events,
          total_tickets_sold,
          total_revenue,
          recent_events,
          withdrawable_earnings
        });

        // Calculate organizer earnings per event
        const updatedEvents = recent_events.map(event => ({
          ...event,
          organizerEarnings: (event.total_revenue || 0) - (2 * (event.total_tickets_sold || 0))
        }));

        setStats({
          totalEvents: total_events || 0,
          totalTickets: total_tickets_sold || 0,
          revenue: total_revenue || 0,
          withdrawableEarnings: withdrawable_earnings || 0
        });
        setEvents(updatedEvents || []);
      } else {
        console.error('Invalid response format:', response);
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
      toast.success('Event deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
      await fetchDashboardData();
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (error) {
      console.error('Event deletion error:', error);
      setError(error?.message || 'Failed to delete event. Please try again.');
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  const confirmDelete = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    try {
      setWithdrawLoading(true);
      setError(null);

      const amount = parseFloat(withdrawForm.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }
      if (amount > stats.withdrawableEarnings) {
        throw new Error('Requested amount exceeds available earnings');
      }
      if (!withdrawForm.paymentDetails.trim()) {
        throw new Error(`Please provide ${withdrawForm.paymentMethod === 'paypal' ? 'PayPal email' : 'bank account details'}`);
      }

      const response = await organizerApi.withdrawEarnings({
        amount,
        payment_method: withdrawForm.paymentMethod,
        payment_details: withdrawForm.paymentDetails
      });

      console.log('Withdrawal Response:', response);

      if (response?.status === 'success') {
        toast.success('Withdrawal request submitted successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
        setShowWithdrawModal(false);
        setWithdrawForm({ amount: '', paymentMethod: 'paypal', paymentDetails: '' });
        await fetchDashboardData(); // Refresh to update withdrawable earnings
      } else {
        throw new Error(response?.message || 'Failed to process withdrawal');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      setError(error?.message || 'Failed to process withdrawal. Please try again.');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleWithdrawFormChange = (e) => {
    const { name, value } = e.target;
    setWithdrawForm(prev => ({ ...prev, [name]: value }));
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
    <Container fluid className="py-5 organizer-dashboard">
      <ToastContainer />
      <h2 className="mb-4 text-center">Organizer Dashboard</h2>

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
        <Col md={3}>
          <Card className="stat-card text-center h-100">
            <Card.Body>
              <Card.Title className="text-primary">Total Events</Card.Title>
              <Card.Text className="stat-value">{stats.totalEvents}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card text-center h-100">
            <Card.Body>
              <Card.Title className="text-success">Total Tickets Sold</Card.Title>
              <Card.Text className="stat-value">{stats.totalTickets}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card text-center h-100">
            <Card.Body>
              <Card.Title className="text-info">Total Revenue</Card.Title>
              <Card.Text className="stat-value">
                ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card text-center h-100">
            <Card.Body>
              <Card.Title className="text-warning">Withdrawable Earnings</Card.Title>
              <Card.Text className="stat-value">
                ${stats.withdrawableEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setShowWithdrawModal(true)}
                disabled={stats.withdrawableEarnings <= 0 || withdrawLoading}
                className="mt-2"
              >
                Withdraw Earnings
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="events-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Card.Title>Recent Events</Card.Title>
            <Button 
              variant="primary" 
              onClick={() => navigate('/addEvent')}
              className="d-flex align-items-center"
            >
              <i className="bi bi-plus-circle me-2"></i>
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
                  <th>Total Revenue</th>
                  <th>Organizer Earnings</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      {error ? 'Failed to load events' : 'No events to display'}
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{new Date(event.created_at).toLocaleDateString()}</td>
                      <td>{event.total_tickets_sold || 0}/{event.total_tickets || 0}</td>
                      <td>
                        ${event.min_price === event.max_price 
                          ? event.min_price.toFixed(2)
                          : `${event.min_price.toFixed(2)} - ${event.max_price.toFixed(2)}`}
                      </td>
                      <td>${(event.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>${(event.organizerEarnings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the event:</p>
          <p className="fw-bold text-danger">{eventToDelete?.title}</p>
          <p className="mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
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

      {/* Withdraw Earnings Modal */}
      <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)} centered>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Withdraw Earnings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
              {error}
            </Alert>
          )}
          <p>
            Available Earnings: ${stats.withdrawableEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <Form onSubmit={handleWithdrawSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Amount ($)</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={withdrawForm.amount}
                onChange={handleWithdrawFormChange}
                placeholder="Enter amount to withdraw"
                min="0.01"
                step="0.01"
                required
                disabled={withdrawLoading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select
                name="paymentMethod"
                value={withdrawForm.paymentMethod}
                onChange={handleWithdrawFormChange}
                disabled={withdrawLoading}
              >
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{withdrawForm.paymentMethod === 'paypal' ? 'PayPal Email' : 'Bank Account Details'}</Form.Label>
              <Form.Control
                type="text"
                name="paymentDetails"
                value={withdrawForm.paymentDetails}
                onChange={handleWithdrawFormChange}
                placeholder={withdrawForm.paymentMethod === 'paypal' ? 'Enter PayPal email' : 'Enter bank account details'}
                required
                disabled={withdrawLoading}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={withdrawLoading}
              className="w-100"
            >
              {withdrawLoading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                'Submit Withdrawal Request'
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default OrganizerDashboard;