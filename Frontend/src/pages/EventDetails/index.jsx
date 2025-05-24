import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { Calendar, MapPin, Clock, Phone, Mail, Award } from 'lucide-react';
import eventApi from '../../apiConfig/eventApi';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            const data = await eventApi.getEventById(id);
            setEvent(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch event details:', err);
            setError('Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (!event) {
        return (
            <Container className="py-5">
                <Alert variant="info">Event not found</Alert>
            </Container>
        );
    }

    return (
        <div className="bg-light min-vh-100">
            {/* Hero Section with Cover Image */}
            <div 
                className="position-relative" 
                style={{ 
                    height: '50vh',
                    backgroundImage: `url(${event.cover_image || 'https://via.placeholder.com/1200x400'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                <Container className="h-100 position-relative">
                    <div className="d-flex flex-column justify-content-end h-100 text-white pb-5">
                        <Badge bg="warning" className="mb-2 align-self-start">
                            {event.category}
                        </Badge>
                        <h1 className="display-4 fw-bold mb-3">{event.title}</h1>
                    </div>
                </Container>
            </div>

            {/* Event Details */}
            <Container className="py-5">
                <Row>
                    {/* Main Content */}
                    <Col lg={8}>
                        <div className="bg-white rounded shadow-sm p-4 mb-4">
                            <h3 className="mb-4">Event Details</h3>
                            <p className="text-muted">{event.description}</p>

                            {/* Date and Time */}
                            {event.dates?.map((date, index) => (
                                <div key={index} className="mb-3 d-flex align-items-center">
                                    <Calendar className="me-2 text-warning" size={20} />
                                    <div>
                                        <div>Start: {date.startDate} at {date.startTime}</div>
                                        <div>End: {date.endDate} at {date.endTime}</div>
                                    </div>
                                </div>
                            ))}

                            {/* Location */}
                            <div className="mb-3 d-flex align-items-center">
                                <MapPin className="me-2 text-warning" size={20} />
                                <span>{event.venue}, {event.address}</span>
                            </div>
                        </div>

                        {/* Organizer Info */}
                        <div className="bg-white rounded shadow-sm p-4">
                            <h4 className="mb-4">Contact Information</h4>
                            <div className="d-flex align-items-center mb-3">
                                <Phone className="me-2 text-warning" size={20} />
                                <span>{event.phone}</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <Mail className="me-2 text-warning" size={20} />
                                <span>{event.email}</span>
                            </div>
                        </div>
                    </Col>

                    {/* Sidebar */}
                    <Col lg={4}>
                        {/* Booking Card */}
                        <div className="bg-white rounded shadow-sm p-4 sticky-top" style={{ top: '2rem' }}>
                            <h4 className="mb-3">Ticket Information</h4>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Price:</span>
                                    <span className="fw-bold">${event.tickets?.price}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Available:</span>
                                    <span>{event.tickets?.quantity} tickets</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Sales End:</span>
                                    <span>{event.tickets?.endSales}</span>
                                </div>
                            </div>
                            <Button variant="warning" className="w-100">
                                Book Now
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default EventDetails;