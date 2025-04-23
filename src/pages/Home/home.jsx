import React, { useEffect, useState } from "react";
import "./home.module.css";
import { Form, Button, Card, Col, Row, Container } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

// استيراد الصور
import booking from "../../assets/booking.jpg";
import booking2 from "../../assets/booking2.jpg";
import booking3 from "../../assets/booking3.jpg";
import booking4 from "../../assets/booking4.jpg";
import booking5 from "../../assets/booking5.jpg";
import booking6 from "../../assets/booking6.jpg";

// الصور
const images = [
    booking,
    booking2,
    booking3,
    booking4,
    booking5,
    booking6,
];

const Home = () => {
    const [currentImage, setCurrentImage] = useState(0);

    // التبديل بين الصور في الهيرو سيكشن
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000); // كل 4 ثواني تتغير الصورة
        return () => clearInterval(interval);
    }, []);

    // بيانات Featured Packages (ستتم إضافتها من API لاحقًا)
    const featuredPackages = [
        {
            id: 1,
            title: "Standard Package",
            description: "Perfect for small events with basic needs. Includes essential services.",
            price: "$100",
            imageUrl: "https://via.placeholder.com/400x200",
        },
        {
            id: 2,
            title: "Premium Package",
            description: "Ideal for medium-sized events with added features and customizations.",
            price: "$250",
            imageUrl: "https://via.placeholder.com/400x200",
        },
        {
            id: 3,
            title: "Luxury Package",
            description: "For large, high-end events. Full customizations and top-tier services.",
            price: "$500",
            imageUrl: "https://via.placeholder.com/400x200",
        },
    ];

    const reviews = [
        {
          name: "Sara Ahmed",
          text: "The booking process was super easy and the event was amazing!",
          rating: 5,
        },
        {
          name: "Mohamed Ali",
          text: "Great experience. I’ll definitely book again.",
          rating: 4,
        },
        {
          name: "Layla Hassan",
          text: "Smooth process and very helpful support.",
          rating: 5,
        },
      ];
    

    return (
        <div>
            {/* الهيرو سيكشن */}
            <div
                className="hero-section d-flex align-items-center justify-content-center text-white"
                style={{
                    backgroundImage: `url(${images[currentImage]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "70vh",
                    position: "relative",
                }}
            >
                <div
                    className="overlay"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1,
                    }}
                ></div>

                <div className="content text-center z-2" style={{ zIndex: 2 }}>
                    <h1 className="mb-4">Find Your Event</h1>
                    <Form className="d-flex flex-column flex-md-row gap-3 justify-content-center align-items-center">
                        <Form.Control
                            type="text"
                            placeholder="Event Name"
                            className="w-100 w-md-25 rounded-pill p-3"
                            style={{ fontSize: "1.2rem" }}
                        />
                        <Form.Control
                            type="date"
                            className="w-100 w-md-25 rounded-pill p-3"
                            style={{ fontSize: "1.2rem" }}
                        />
                        <Button variant="warning" className="px-4 py-3 rounded-pill" style={{ fontSize: "1.2rem" }}>
                            Search
                        </Button>
                    </Form>
                </div>
            </div>

            {/* قسم Popular Events */}
            <div className="popular-events py-5 bg-dark-subtle">
                <Container>
                    <h2 className="text-center mb-4">Popular Events</h2>
                    <Row>
                        {featuredPackages.map((pkg) => (
                            <Col key={pkg.id} md={4} sm={6} className="mb-4">
                                <Card>
                                    <Card.Img variant="top" src={pkg.imageUrl} />
                                    <Card.Body>
                                        <Card.Title>{pkg.title}</Card.Title>
                                        <Card.Text>{pkg.description}</Card.Text>
                                        <Card.Footer>
                                            <small className="text-muted">{pkg.price}</small>
                                        </Card.Footer>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>


            {/* قسم Featured Packages */}
            <div className="featured-packages py-5 bg-white">
                <Container>
                    <h2 className="text-center mb-4">Featured Packages</h2>
                    <Row>
                        {featuredPackages.map((pkg) => (
                            <Col key={pkg.id} md={4} sm={6} className="mb-4">
                                <Card className="h-100 shadow">
                                    <Card.Img variant="top" src={pkg.imageUrl} />
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
            </div>

            {/* قسم Best Price Guarantee & Other Info */}
            <div className="info-section py-5">
                <Container>
                    <Row>
                        <Col md={4} className="mb-4 text-center">
                            <h3>Best Price Guarantee</h3>
                            <p>We promise the best rates and will match any lower price you find.</p>
                        </Col>
                        <Col md={4} className="mb-4 text-center">
                            <h3>24/7 Support</h3>
                            <p>Our travel experts are here to help you anytime, anywhere.</p>
                        </Col>
                        <Col md={4} className="mb-4 text-center">
                            <h3>Experienced Guides</h3>
                            <p>Professional local guides to enhance your travel experience.</p>
                        </Col>
                    </Row>

                    <Row className="text-center mt-5 bg-dark text-white p-4 rounded">
                        <Col md={3} className="mb-4">
                            <h2 className="text-warning fw-bold display-5">50K+</h2>
                            <p>Happy Travelers</p>
                        </Col>
                        <Col md={3} className="mb-4">
                            <h2 className="text-warning fw-bold display-5">100+</h2>
                            <p>Destinations</p>
                        </Col>
                        <Col md={3} className="mb-4">
                            <h2 className="text-warning fw-bold display-5">500+</h2>
                            <p>Travel Packages</p>
                        </Col>
                        <Col md={3} className="mb-4">
                            <h2 className="text-warning fw-bold display-5">15+</h2>
                            <p>Years Experience</p>
                        </Col>
                    </Row>

                </Container>
            </div>


            <div className="testimonials-section py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5">What Our Users Say</h2>
        <Row>
          {reviews.map((review, idx) => (
            <Col md={4} className="mb-4" key={idx}>
              <Card className="shadow h-100">
                <Card.Body>
                  <p className="mb-3">"{review.text}"</p>
                  <div className="mb-2 text-warning">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <h6 className="mb-0">— {review.name}</h6>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>

        </div>
    );
};

export default Home;
