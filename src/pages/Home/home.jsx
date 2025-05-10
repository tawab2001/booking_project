
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