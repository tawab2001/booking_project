
import React from 'react';
import { Calendar, MapPin, Search, Eye, Ticket } from 'lucide-react';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';

const events = [
  {
    id: 1,
    title: 'Music Festival 2025',
    date: '2025-06-01',
    location: 'Cairo, Egypt',
    image: 'https://via.placeholder.com/400x200',
    description: 'Enjoy a vibrant music festival with artists from around the world.',
    seatsAvailable: 120,
  },
  {
    id: 2,
    title: 'Tech Conference',
    date: '2025-07-20',
    location: 'Alexandria, Egypt',
    image: 'https://via.placeholder.com/400x200',
    description: 'Join the largest tech conference in the region with keynotes and workshops.',
    seatsAvailable: 45,
  },
  {
    id: 3,
    title: 'Art Expo',
    date: '2025-08-15',
    location: 'Giza, Egypt',
    image: 'https://via.placeholder.com/400x200',
    description: 'Explore the beauty of modern art at our annual Art Expo.',
    seatsAvailable: 25,
  },
];

const EventCard = ({ event }) => {
  const handleViewClick = () => {
     alert(`Viewing details for: ${event.title}`);
  };

  const handleBookClick = () => {
    alert(`Booking for: ${event.title}`);
  };

  return (
    <Card className="mb-4 bg-white text-dark shadow">
      <Card.Img variant="top" src={event.image} alt={event.title} style={{ height: 200, objectFit: 'cover' }} />
      <Card.Body>
        <Card.Title className="text-warning">{event.title}</Card.Title>
        <Card.Text>
          <div className="d-flex align-items-center text-dark mb-2">
            <Calendar size={16} className="me-2 text-warning" />
            <span className="small">{event.date}</span>
          </div>
          <div className="d-flex align-items-center text-dark mb-2">
            <MapPin size={16} className="me-2 text-warning" />
            <span className="small">{event.location}</span>
          </div>
          {/* Fix template literal syntax */}
          <span className={`badge mb-2 ${event.seatsAvailable > 100 ? 'bg-warning text-dark' : event.seatsAvailable > 30 ? 'bg-light text-dark' : 'bg-danger'}`}>
            {event.seatsAvailable} seats
          </span>
          <div className="mb-3 text-dark" style={{ minHeight: 60 }}>{event.description}</div>
        </Card.Text>
        <div className="d-flex gap-2">
          <Button variant="warning" className="flex-fill d-flex align-items-center justify-content-center gap-1 text-dark" onClick={handleViewClick}>
            <Eye size={16} className="text-dark" />
            View
          </Button>
          <Button variant="dark" className="flex-fill d-flex align-items-center justify-content-center gap-1 text-warning" onClick={handleBookClick}>
            <Ticket size={16} className="text-warning" />
            Book
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

const Events = () => {
  return (
    <Container className="py-5" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <div className="text-center mb-4">
        <h1 className="text-warning mb-2">Upcoming Events</h1>
        <p className="text-dark">
          Discover and book tickets for the most exciting events happening near you.
        </p>
      </div>
      <Row className="mb-4">
        <Col md={{ span: 6, offset: 3 }}>
          <Form>
            <Form.Group className="position-relative">
              <Form.Control
                type="text"
                placeholder="Search events..."
                className="ps-5 bg-white text-dark border-warning"
              />
              <Search size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-warning" />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row>
        {events.map((event) => (
          <Col key={event.id} xs={12} md={6} lg={4}>
            <EventCard event={event} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Events;