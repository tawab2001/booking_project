
import React, { useEffect, useState } from "react";
import "./home.module.css";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Col, Row, Container } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";


import booking from "../../assets/booking.jpg";
import booking2 from "../../assets/booking2.jpg";
import booking3 from "../../assets/booking3.jpg";
import booking4 from "../../assets/booking4.jpg";
import booking5 from "../../assets/booking5.jpg";
import booking6 from "../../assets/booking6.jpg";


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
    const navigate = useNavigate();
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000); 
        return () => clearInterval(interval);
    }, []);

 
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






      const offers = [
        {
          title: "خصم 20% على تذاكر كرة القدم!",
          description: "استمتع بخصم خاص عند شراء 3 تذاكر أو أكثر!",
          image: "/images/football1.jpg",
        },
        {
          title: "عرض خاص على تذاكر كرة القدم!",
          description: "اشترِ 5 تذاكر واحصل على تذكرة مجانية!",
          image: "/images/football2.jpg",
        },
        {
          title: "خصم 15% على أجهزة اللابتوب!",
          description: "أفضل العروض على أحدث أجهزة الكمبيوتر المحمولة.",
          image: "/images/lab1.jpg",
        },
        {
          title: "اشترِ جهاز واحصل على سماعات هدية!",
          description: "عرض مميز على أجهزة اللابتوب لفترة محدودة.",
          image: "/images/lab2.jpg",
        },
        {
          title: "خصم 10% على جميع الأجهزة!",
          description: "استمتع بخصم خاص على جميع الأجهزة لفترة محدودة.",
          image: "/images/lab3.jpg",
        },
        {
          title: "خصم 30% على تذاكر الحفلات!",
          description: "استمتع بخصم خاص عند شراء 3 تذاكر أو أكثر!",
          image: "/images/concert1.jpg",
        },
        {
          title: "عرض خاص على تذاكر الحفلات!",
          description: "اشترِ 5 تذاكر واحصل على تذكرة مجانية!",
          image: "/images/concert2.jpg",
        },
        {
          title: "خصم 15% على جميع التذاكر!",
          description: "استمتع بخصم خاص على جميع التذاكر لفترة محدودة.",
          image: "/images/concert3.jpg",
        },];
    



        const matches = [
            {
              image: "/images/match1.jpg",
              date: "25 مايو 2025",
              teams: "برشلونة × ريال مدريد",
              time: "8:00 مساءً",
              stadium: "ملعب الكامب نو",
            },
            {
              image: "/images/match2.jpg",
              date: "30 مايو 2025",
              teams: "ليفربول × مانشستر سيتي",
              time: "6:00 مساءً",
              stadium: "ملعب أنفيلد",
            },
          ];

    return (
        <div>
            {}
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




            <section className="special-offers py-5">
      <div className="container-fluid">
        <h2 className="text-center mb-5">🔥 عروضنا الخاصة 🔥</h2>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={3}
          loop={false}
        >
          {offers.map((offer, index) => (
            <SwiperSlide key={index}>
              <div
                className="card h-100 shadow-sm"
                style={{ borderRadius: "15px", overflow: "hidden" 
                 }}
              >
                <img
                  src={offer.image}
                  className="card-img-top"
                  alt={offer.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{offer.title}</h5>
                    <p className="card-text">{offer.description}</p>
                  </div>
                  <button className="btn btn-warning mt-3">احجز الآن</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>



    <section className="upcoming-matches py-5 bg-light">
      <div className="container-fluid">
        <h2 className="text-center mb-5">🏆 المباريات القادمة 🏆</h2>
        <div className="row g-4">
          {matches.map((match, index) => (
            <div key={index} className="col-md-6">
              <div
                className="card h-100 shadow"
                style={{ borderRadius: "15px", overflow: "hidden" }}
              >
                <img
                  src={match.image}
                  className="card-img-top"
                  alt={match.teams}
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-primary">{match.teams}</h5>
                  <p className="card-text mb-1">
                    <strong>التاريخ:</strong> {match.date}
                  </p>
                  <p className="card-text mb-1">
                    <strong>الساعة:</strong> {match.time}
                  </p>
                  <p className="card-text">
                    <strong>الاستاد:</strong> {match.stadium}
                  </p>
                  <a
                    href="#"
                    className="btn btn-warning w-100 mt-3"
                    style={{
                      borderRadius: "5px",
                      fontWeight: "bold",
                      padding: "12px",
                    }}
                    onClick={() => navigate("/booking", { state: { match } })}
                    >
                    احجز الآن
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>







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
