import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, Clock } from 'lucide-react';
import { Container, Row, Col, Button, Card, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import eventApi from '../../apiConfig/eventApi';
import { placeholderImage } from '../../assets/placeholder';

const EventCard = ({ image, title, date, time, location, onView, onBook }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Card 
      className="h-100 shadow"
      style={{ 
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.3s ease'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card.Img 
        variant="top" 
        src={imageError ? placeholderImage : (image || placeholderImage)}
        onError={() => setImageError(true)}
        style={{ height: '200px', objectFit: 'cover' }} 
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <Calendar className="me-2" size={18} style={{ color: '#ffc107' }} />
            <small>{date}</small>
          </div>
          <div className="d-flex align-items-center mb-2">
            <Clock className="me-2" size={18} style={{ color: '#ffc107' }} />
            <small>{time}</small>
          </div>
          <div className="d-flex align-items-center">
            <MapPin className="me-2" size={18} style={{ color: '#ffc107' }} />
            <small>{location}</small>
          </div>
        </div>
        <div className="d-flex gap-2">
          <Button variant="dark" className="w-50" onClick={onView}>View</Button>
          <Button variant="warning" className="w-50" onClick={onBook}>Book</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching events...');
      const response = await eventApi.getAllEvents();
      console.log('Events received:', response);
      setEvents(response);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id) => {
    console.log('Viewing event:', id);
    navigate(`/event/${id}`);
  };

  const handleBook = (id) => {
    console.log('Booking event:', id);
    navigate(`/booking/${id}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching:', searchTerm);
    // TODO: Implement search functionality
  };

 
  const filteredEvents = events.filter((event) => {
    const search = searchTerm.toLowerCase();
    return (
      event.title?.toLowerCase().includes(search) ||
      event.venue?.toLowerCase().includes(search) ||
      event.dates?.[0]?.startDate?.toLowerCase().includes(search)
    );
  });

  return (
    <Container className="py-5">
      <div className="text-center mb-4">
        <h1 className="text-warning mb-2">Upcoming Events</h1>
        <p className="text-dark">
          Discover and book tickets for the most exciting events happening near you.
        </p>
      </div>

      {/* Search Section */}
      <Row className="mb-4">
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSearch}>
            <Form.Group className="position-relative">
              <Form.Control
                type="text"
                placeholder="Search events..."
                className="ps-5 bg-white text-dark border-warning"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-warning" />
            </Form.Group>
          </Form>
        </Col>
      </Row>

      {/* Events List */}
      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="warning" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">{error}</Alert>
      ) : filteredEvents.length === 0 ? (
        <p className="text-center text-muted">No events found</p>
      ) : (
        <Row>
          {filteredEvents.map((event) => (
            <Col key={event.id} md={4} className="mb-4">
              <EventCard
                image={event.cover_image || event.social_image}
                title={event.title}
                date={event.dates?.[0]?.startDate || 'Date TBA'}
                time={event.dates?.[0]?.startTime || 'Time TBA'}
                location={event.venue}
                onView={() => handleView(event.id)}
                onBook={() => handleBook(event.id)}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Events;
