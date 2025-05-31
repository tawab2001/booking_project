import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import organizerApi from '../../apiConfig/organizerApi';
import { CheckCircle } from 'react-feather';

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    address: '',
    category: '',
    phone: '',
    email: '',
    startSales: '',
    endSales: '',
    paymentMethod: 'Credit Card',
    dates: [{ startDate: '', endDate: '', startTime: '', endTime: '' }],
    tickets: {
      regular: { price: '', quantity: '' },
      vip: { price: '', quantity: '' }
    }
  });

  // Custom styles
  const styles = {
    card: {
      borderRadius: '10px'
    },
    formControl: {
      '&:focus': {
        borderColor: '#0d6efd',
        boxShadow: '0 0 0 0.2rem rgba(13, 110, 253, 0.25)'
      }
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizerApi.getEventDetails(eventId);
      
      if (!response) {
        throw new Error('No data received from server');
      }

      // Format dates for form inputs
      const formattedDates = response.dates?.map(date => ({
        startDate: date.startDate?.split('T')[0] || '',
        endDate: date.endDate?.split('T')[0] || '',
        startTime: date.startTime || '',
        endTime: date.endTime || ''
      })) || [{ startDate: '', endDate: '', startTime: '', endTime: '' }];

      // Format sales dates
      const startSales = response.startSales?.split('T')[0] || '';
      const endSales = response.endSales?.split('T')[0] || '';

      // Set default tickets if not present
      const tickets = {
        regular: {
          price: response.tickets?.regular?.price || '',
          quantity: response.tickets?.regular?.quantity || ''
        },
        vip: {
          price: response.tickets?.vip?.price || '',
          quantity: response.tickets?.vip?.quantity || ''
        }
      };

      setFormData({
        title: response.title || '',
        description: response.description || '',
        venue: response.venue || '',
        address: response.address || '',
        category: response.category || '',
        phone: response.phone || '',
        email: response.email || '',
        dates: formattedDates,
        startSales,
        endSales,
        tickets
      });
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError(err.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      dates: prev.dates.map((date, i) => 
        i === index ? { ...date, [field]: value } : date
      )
    }));
  };

  const handleTicketChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        [type]: {
          ...prev.tickets[type],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      const requiredFields = ['title', 'description', 'venue', 'address', 'email'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate dates
      if (!formData.dates[0].startDate || !formData.dates[0].endDate) {
        throw new Error('Please set both start and end dates');
      }

      // Validate tickets
      if (!formData.tickets.regular.price || !formData.tickets.regular.quantity ||
          !formData.tickets.vip.price || !formData.tickets.vip.quantity) {
        throw new Error('Please set both price and quantity for all ticket types');
      }

      // Format dates for API
      const formattedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        venue: formData.venue.trim(),
        address: formData.address.trim(),
        category: formData.category.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        dates: formData.dates.map(date => ({
          startDate: `${date.startDate}T${date.startTime || '00:00'}:00`,
          endDate: `${date.endDate}T${date.endTime || '00:00'}:00`,
          startTime: date.startTime || '00:00',
          endTime: date.endTime || '00:00'
        })),
        startSales: `${formData.startSales}T00:00:00`,
        endSales: `${formData.endSales}T23:59:59`,
        tickets: {
          regular: {
            price: parseFloat(formData.tickets.regular.price),
            quantity: parseInt(formData.tickets.regular.quantity, 10)
          },
          vip: {
            price: parseFloat(formData.tickets.vip.price),
            quantity: parseInt(formData.tickets.vip.quantity, 10)
          }
        }
      };

      // Validate numeric values
      if (isNaN(formattedData.tickets.regular.price) || isNaN(formattedData.tickets.vip.price)) {
        throw new Error('Ticket prices must be valid numbers');
      }
      if (isNaN(formattedData.tickets.regular.quantity) || isNaN(formattedData.tickets.vip.quantity)) {
        throw new Error('Ticket quantities must be valid numbers');
      }

      const response = await organizerApi.updateEvent(eventId, formattedData);
      
      setSuccess(true);
      // Wait for 2 seconds to show the success message before redirecting
      setTimeout(() => {
        navigate('/admindashboard');
      }, 2000);
      
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err.message || 'Failed to update event. Please check your input and try again.');
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading event details...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow" style={styles.card}>
        <Card.Body>
          <h2 className="mb-4">Edit Event</h2>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="d-flex align-items-center">
              <CheckCircle className="me-2" size={20} />
              Event updated successfully! Redirecting to dashboard...
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Venue</Form.Label>
                  <Form.Control
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4 className="mt-4">Event Dates</h4>
            {formData.dates.map((date, index) => (
              <Row key={index} className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={date.startDate}
                      onChange={(e) => handleDateChange(index, 'startDate', e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={date.endDate}
                      onChange={(e) => handleDateChange(index, 'endDate', e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={date.startTime}
                      onChange={(e) => handleDateChange(index, 'startTime', e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={date.endTime}
                      onChange={(e) => handleDateChange(index, 'endTime', e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            ))}

            <h4 className="mt-4">Ticket Types</h4>
            <Row>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Body>
                    <h5>Regular Tickets</h5>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Price</Form.Label>
                          <Form.Control
                            type="number"
                            value={formData.tickets.regular.price}
                            onChange={(e) => handleTicketChange('regular', 'price', e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            value={formData.tickets.regular.quantity}
                            onChange={(e) => handleTicketChange('regular', 'quantity', e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Body>
                    <h5>VIP Tickets</h5>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Price</Form.Label>
                          <Form.Control
                            type="number"
                            value={formData.tickets.vip.price}
                            onChange={(e) => handleTicketChange('vip', 'price', e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            value={formData.tickets.vip.quantity}
                            onChange={(e) => handleTicketChange('vip', 'quantity', e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sales Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startSales"
                    value={formData.startSales}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sales End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endSales"
                    value={formData.endSales}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 justify-content-end mt-4">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/admindashboard')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Event'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditEvent; 