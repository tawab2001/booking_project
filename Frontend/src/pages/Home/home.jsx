import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Calendar, MapPin, Clock, Star, Award, Users } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Mock Data
const heroImages = [
  'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg',
  'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
  'https://images.pexels.com/photos/301987/pexels-photo-301987.jpeg',
  'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg'
];

const specialOffers = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1462935/pexels-photo-1462935.jpeg',
    title: '20% Off Football Tickets!',
    date: 'June 15, 2025',
    time: 'Multiple times',
    location: 'Various Stadiums'
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    title: 'Buy 5 Tickets Get 1 Free!',
    date: 'July 1-30, 2025',
    time: 'All day',
    location: 'Online only'
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg',
    title: '15% Off Concert Tickets!',
    date: 'August 1-15, 2025',
    time: 'Various times',
    location: 'Multiple venues'
  }
];

const upcomingMatches = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
    title: 'Barcelona vs Real Madrid',
    date: 'May 25, 2025',
    time: '8:00 PM',
    location: 'Camp Nou Stadium'
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg',
    title: 'Liverpool vs Manchester City',
    date: 'May 30, 2025',
    time: '6:00 PM',
    location: 'Anfield Stadium'
  }
];

const reviews = [
  {
    id: 1,
    name: "Sara Ahmed",
    text: "The booking process was super easy and the event was amazing!",
    rating: 5
  },
  {
    id: 2,
    name: "Mohamed Ali",
    text: "Great experience. I'll definitely book again.",
    rating: 4
  },
  {
    id: 3,
    name: "Layla Hassan",
    text: "Smooth process and very helpful support.",
    rating: 5
  }
];

const featuredPackages = [
  {
    id: 1,
    title: "Summer Music Festival",
    description: "A three-day music festival featuring top artists from around the world.",
    price: "$199",
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg"
  },
  {
    id: 2,
    title: "Premier League Finals",
    description: "Experience the excitement of the Premier League championship match live.",
    price: "$299",
    imageUrl: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg"
  },
  {
    id: 3,
    title: "Broadway Theater Weekend",
    description: "A weekend package including tickets to two top Broadway shows.",
    price: "$399",
    imageUrl: "https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg"
  }
];

// Event Card Component
const EventCard = ({ image, title, date, time, location, onView, onBook }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      style={{ 
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.3s',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-100 shadow"
    >
      <Card.Img variant="top" src={image} style={{ height: '200px', objectFit: 'cover' }} />
      <Card.Body style={{ backgroundColor: 'white' }}>
        <Card.Title as="h5" className="mb-3" style={{ color: '#212529' }}>{title}</Card.Title>
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <Calendar className="me-2" size={18} style={{ color: '#ffc107' }} />
            <small style={{ color: '#212529' }}>{date}</small>
          </div>
          <div className="d-flex align-items-center mb-2">
            <Clock className="me-2" size={18} style={{ color: '#ffc107' }} />
            <small style={{ color: '#212529' }}>{time}</small>
          </div>
          <div className="d-flex align-items-center">
            <MapPin className="me-2" size={18} style={{ color: '#ffc107' }} />
            <small style={{ color: '#212529' }}>{location}</small>
          </div>
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="dark" 
            className="w-50 d-flex align-items-center justify-content-center"
            onClick={onView}
          >
            View
          </Button>
          <Button 
            variant="warning" 
            className="w-50 d-flex align-items-center justify-content-center"
            onClick={onBook}
          >
            Book
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

// Review Card Component
const ReviewCard = ({ text, rating, name }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card 
      className="h-100 shadow-sm"
      style={{ 
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.3s',
        cursor: 'pointer',
        backgroundColor: 'white'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card.Body>
        <p style={{ color: '#212529' }} className="mb-3">"{text}"</p>
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
        <p className="mb-0 fw-bold" style={{ color: '#212529' }}>— {name}</p>
      </Card.Body>
    </Card>
  );
};

function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleView = (id) => {
<<<<<<< HEAD
    console.log(`View event ${id}`);
  };

  const handleBook = (id) => {
    console.log(`Book event${id}`);
=======
>>>>>>> 8ec029018d2f5e2612c48178633a258315daef69
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Hero Section */}
      <div
        style={{
<<<<<<< HEAD
          backgroundImage:  `url(${heroImages[currentImage]})`,
=======

>>>>>>> 8ec029018d2f5e2612c48178633a258315daef69
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '70vh',
          transition: 'background-image 0.5s ease-in-out',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          opacity: 0.5
        }}></div>
        <Container style={{ position: 'relative', textAlign: 'center' }}>
          <h1 className="display-4 mb-4">Find Your Perfect Event</h1>
          <Form className="d-flex flex-column flex-md-row gap-3 justify-content-center align-items-center">
            <Form.Control
              type="text"
              placeholder="Event Name"
              style={{ maxWidth: '300px' }}
            />
            <Form.Control
              type="date"
              style={{ maxWidth: '300px' }}
            />
            <Button variant="warning">
              Search
            </Button>
          </Form>
          <Button variant="dark" className="mt-3">
            Add Event
          </Button>
        </Container>
      </div>

      {/* Special Offers Section */}
      <section style={{ padding: '3rem 0', backgroundColor: 'white' }}>
        <Container>
          <h2 className="text-center mb-4" style={{ color: '#212529' }}>
            <span style={{ color: '#ffc107' }}>🔥</span> Special Offers <span style={{ color: '#ffc107' }}>🔥</span>
          </h2>
          <Row>
            {specialOffers.map((offer) => (
              <Col key={offer.id} md={4} className="mb-4">
                <EventCard
                  {...offer}
                  onView={() => handleView(offer.id)}
                  onBook={() => handleBook(offer.id)}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Upcoming Matches Section */}
      <section style={{ padding: '3rem 0', backgroundColor: '#f8f9fa' }}>
        <Container>
          <h2 className="text-center mb-4" style={{ color: '#212529' }}>
            <span style={{ color: '#ffc107' }}>🏆</span> Upcoming Matches <span style={{ color: '#ffc107' }}>🏆</span>
          </h2>
          <Row>
            {upcomingMatches.map((match) => (
              <Col key={match.id} md={6} className="mb-4">
                <EventCard
                  {...match}
                  onView={() => handleView(match.id)}
                  onBook={() => handleBook(match.id)}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Info Section */}
      <section style={{ padding: '3rem 0', backgroundColor: 'white' }}>
        <Container>
          <Row>
            <Col md={4} className="mb-4 text-center">
              <div className="mb-3">
                <Award size={48} style={{ color: '#ffc107' }} />
              </div>
              <h3 style={{ color: '#212529' }}>Best Price Guarantee</h3>
              <p style={{ color: '#6c757d' }}>We promise the best rates and will match any lower price you find.</p>
            </Col>
            <Col md={4} className="mb-4 text-center">
              <div className="mb-3">
                <Clock size={48} style={{ color: '#ffc107' }} />
              </div>
              <h3 style={{ color: '#212529' }}>24/7 Support</h3>
              <p style={{ color: '#6c757d' }}>Our travel experts are here to help you anytime, anywhere.</p>
            </Col>
            <Col md={4} className="mb-4 text-center">
              <div className="mb-3">
                <Users size={48} style={{ color: '#ffc107' }} />
              </div>
              <h3 style={{ color: '#212529' }}>Experienced Guides</h3>
              <p style={{ color: '#6c757d' }}>Professional local guides to enhance your travel experience.</p>
            </Col>
          </Row>

          <Row className="text-center mt-5 p-4 rounded" style={{ backgroundColor: '#212529', color: 'white' }}>
            <Col md={3} className="mb-4 mb-md-0">
              <h2 style={{ color: '#ffc107' }} className="fw-bold display-5">50K+</h2>
              <p>Happy Travelers</p>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <h2 style={{ color: '#ffc107' }} className="fw-bold display-5">100+</h2>
              <p>Destinations</p>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <h2 style={{ color: '#ffc107' }} className="fw-bold display-5">500+</h2>
              <p>Travel Packages</p>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <h2 style={{ color: '#ffc107' }} className="fw-bold display-5">15+</h2>
              <p>Years Experience</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Packages Section */}
      <section style={{ padding: '3rem 0', backgroundColor: '#f8f9fa' }}>
        <Container>
          <h2 className="text-center mb-4" style={{ color: '#212529' }}>Featured Packages</h2>
          <Row>
            {featuredPackages.map((pkg) => (
              <Col key={pkg.id} md={4} sm={6} className="mb-4">
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

      {/* Testimonials Section */}
      <section style={{ padding: '3rem 0', backgroundColor: 'white' }}>
        <Container>
          <h2 className="text-center mb-4" style={{ color: '#212529' }}>What Our Users Say</h2>
          <Row>
            {reviews.map((review) => (
              <Col key={review.id} md={4} className="mb-4">
                <ReviewCard 
                  text={review.text}
                  rating={review.rating}
                  name={review.name}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Home;