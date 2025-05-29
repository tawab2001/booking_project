import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Calendar, MapPin, Clock, Star, Award, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import eventApi from '../../apiConfig/eventApi';


// Mock Data - Keep these for static sections
const heroImages = [
  'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg',
  'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
  'https://images.pexels.com/photos/301987/pexels-photo-301987.jpeg',
  'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg'
];

const specialOffers = [
  {
    id: 1,
    title: '20% Off Football Tickets!',
    description: 'Limited time offer for all football matches'
  },
  {
    id: 2,
    title: 'Buy 5 Tickets Get 1 Free!',
    description: 'Special group booking offer'
  },
  {
    id: 3,
    title: '15% Off Concert Tickets!',
    description: 'Early bird special for upcoming concerts'
  }
];

const featuredPackages = [
  {
    id: 1,
    title: "Summer Music Festival",
    description: "A three-day music festival featuring top artists.",
    price: "$199",
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg"
  },
  {
    id: 2,
    title: "Premier League Finals",
    description: "Experience the excitement of the finals live.",
    price: "$299",
    imageUrl: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg"
  },
  {
    id: 3,
    title: "Theater Weekend",
    description: "Weekend package including two shows.",
    price: "$399",
    imageUrl: "https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg"
  }
];

const reviews = [
  {
    id: 1,
    name: "Sara Ahmed",
    text: "The booking process was super easy!",
    rating: 5
  },
  {
    id: 2,
    name: "Mohamed Ali",
    text: "Great experience. Will book again.",
    rating: 4
  },
  {
    id: 3,
    name: "Layla Hassan",
    text: "Smooth process and helpful support.",
    rating: 5
  }
];

// Category options (same as Add Event + 4 more)
const CATEGORY_OPTIONS = [
  { value: "music", label: "Music" },
  { value: "art", label: "Art" },
  { value: "sports", label: "Sports" },
  { value: "education", label: "Education" },
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "health", label: "Health" },
  { value: "conference", label: "Conference" }
];

// Welcome texts for hero slider
const welcomeTexts = [
  "Book your spot at the best events easily and quickly!",
  "Discover music, sports, education, and more events!",
  "Enjoy fast and secure booking for all occasions.",
  "Join the largest events community in Egypt.",
  "Don't miss exclusive offers and special discounts!"
];

// Components
const EventCard = ({ image, title, date, time, location, onView, onBook }) => {
  const [isHovered, setIsHovered] = useState(false);

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
        src={image || 'https://via.placeholder.com/400x200'} 
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

const ReviewCard = ({ text, rating, name }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <p className="mb-3">"{text}"</p>
        <div className="d-flex mb-2">
          {[...Array(rating)].map((_, i) => (
            <Star
              key={i}
              style={{ color: '#ffc107' }}
              size={18}
              fill="currentColor"
            />
          ))}
        </div>
        <p className="mb-0 fw-bold">— {name}</p>
      </Card.Body>
    </Card>
  );
};

// Main Component
function Home() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [userType, setUserType] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Hero welcome text slider
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const welcomeInterval = useRef();

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    setUserType(storedUserType);

    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000);

    fetchEvents();

    welcomeInterval.current = setInterval(() => {
      setWelcomeIndex((prev) => (prev + 1) % welcomeTexts.length);
    }, 3500);

    return () => {
      clearInterval(interval);
      clearInterval(welcomeInterval.current);
    };
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await eventApi.getAllEvents();
      setEvents(response);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = () => navigate('/addEvent');
  const handleView = (id) => navigate(`/event/${id}`);
  const handleBook = (id) => navigate(`/booking/${id}`);

  // Filtering events
  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory ? event.category === selectedCategory : true;
    const nameMatch = searchTerm
      ? event.title?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const dateMatch = searchDate
      ? event.dates && event.dates[0] && event.dates[0].startDate === searchDate
      : true;
    return categoryMatch && nameMatch && dateMatch;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `url(${heroImages[currentImage]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '70vh',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}></div>
        
        <Container style={{ position: 'relative', height: '100%' }} className="d-flex align-items-center justify-content-center">
          <div className="text-center text-white">
            <h1 className="display-4 mb-4">Find Your Perfect Event</h1>
            <h2
              className="mb-4"
              style={{
                minHeight: 48,
                transition: 'all 0.5s',
                fontWeight: 'bold'
              }}
            >
              {welcomeTexts[welcomeIndex]}
            </h2>
            <Button
              variant="warning"
              size="lg"
              className="rounded-pill px-5 mb-3"
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            >
              Discover Events
            </Button>
            {userType === 'organizer' && (
              <Button 
                variant="dark" 
                className="mt-3 ms-2"
                onClick={handleAddEvent}
              >
                Add Event
              </Button>
            )}
          </div>
        </Container>
      </div>

      {/* Events Section */}
      <section style={{ padding: '3rem 0', backgroundColor: '#f8f9fa' }}>
        <Container>
          <h2 className="text-center mb-4">
            <span style={{ color: '#ffc107' }}>🎉</span> Latest Events
          </h2>
          {/* Category Filter - single row, scrollable if needed */}
          <div className="d-flex justify-content-center mb-4 overflow-auto" style={{whiteSpace: 'nowrap'}}>
            <Button
              variant={selectedCategory === '' ? "warning" : "outline-warning"}
              className="rounded-pill px-4 mx-1 flex-shrink-0"
              onClick={() => setSelectedCategory('')}
            >
              All
            </Button>
            {CATEGORY_OPTIONS.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "warning" : "outline-warning"}
                className="rounded-pill px-4 mx-1 text-capitalize flex-shrink-0"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
          {/* Search & Date Filter */}
          <Form className="d-flex flex-column flex-md-row gap-3 justify-content-center align-items-center mb-4">
            <Form.Control
              type="text"
              placeholder="Event Name"
              style={{ maxWidth: '300px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Form.Control
              type="date"
              style={{ maxWidth: '300px' }}
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </Form>
          {isLoading ? (
            <div className="text-center">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
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
      </section>

      {/* Special Offers Section */}
      <section style={{ padding: '3rem 0', backgroundColor: 'white' }}>
        <Container>
          <h2 className="text-center mb-4">
            <span style={{ color: '#ffc107' }}>🔥</span> Special Offers
          </h2>
          <Row>
            {specialOffers.map((offer) => (
              <Col key={offer.id} md={4} className="mb-4">
                <Card className="h-100 shadow text-center">
                  <Card.Body>
                    <Card.Title className="mb-2">{offer.title}</Card.Title>
                    <Card.Text>{offer.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Info Section */}
      <section style={{ padding: '3rem 0', backgroundColor: '#f8f9fa' }}>
        <Container>
          <Row>
            <Col md={4} className="mb-4 text-center">
              <Award size={48} className="mb-3 text-warning" />
              <h3>Best Price Guarantee</h3>
              <p className="text-muted">We promise the best rates available.</p>
            </Col>
            <Col md={4} className="mb-4 text-center">
              <Clock size={48} className="mb-3 text-warning" />
              <h3>24/7 Support</h3>
              <p className="text-muted">Always here to help you.</p>
            </Col>
            <Col md={4} className="mb-4 text-center">
              <Users size={48} className="mb-3 text-warning" />
              <h3>Experienced Team</h3>
              <p className="text-muted">Professional service guaranteed.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Packages */}
      <section style={{ padding: '3rem 0', backgroundColor: 'white' }}>
        <Container>
          <h2 className="text-center mb-4">Featured Packages</h2>
          <Row>
            {featuredPackages.map((pkg) => (
              <Col key={pkg.id} md={4} className="mb-4">
                <Card className="h-100 shadow">
                  <Card.Img variant="top" src={pkg.imageUrl} style={{ height: '200px', objectFit: 'cover' }} />
                  <Card.Body>
                    <Card.Title>{pkg.title}</Card.Title>
                    <Card.Text>{pkg.description}</Card.Text>
                    <h5 className="text-warning mt-2">{pkg.price}</h5>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '3rem 0', backgroundColor: '#f8f9fa' }}>
        <Container>
          <h2 className="text-center mb-4">What Our Users Say</h2>
          <Row>
            {reviews.map((review) => (
              <Col key={review.id} md={4} className="mb-4">
                <ReviewCard {...review} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Home;