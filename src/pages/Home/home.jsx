import React, { useEffect, useState } from "react";
import "./home.module.css";
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
  ];

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
      {/* Hero Section */}
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
            <Button
              variant="warning"
              className="px-4 py-3 rounded-pill"
              style={{ fontSize: "1.2rem" }}
            >
              Search
            </Button>
          </Form>
        </div>
      </div>

      {/* Special Offers Section */}
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
                  style={{ borderRadius: "15px", overflow: "hidden" }}
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

      {/* Upcoming Matches Section */}
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
    </div>
  );
};

export default Home;