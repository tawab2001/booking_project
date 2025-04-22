import React, { useState } from 'react';
import { Container, Row, Col, Image, Nav, Card } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
    const [activeTab, setActiveTab] = useState('details');

    const UserDetails = () => (
        <Card className="bg-dark text-light">
            <Card.Body>
                <Card.Title className="text-warning mb-4">Personal Information</Card.Title>
                <div className="mt-3">
                    <p><strong className="text-warning">Name:</strong> ahmed</p>
                    <p><strong className="text-warning">Email:</strong> ahmed@gmail.com</p>
                    <p><strong className="text-warning">Phone:</strong> +1234567890</p>
                    <p><strong className="text-warning">Location:</strong> qena</p>
                </div>
            </Card.Body>
        </Card>
    );

    const BookingList = () => (
        <Card className="bg-dark text-light">
            <Card.Body>
                <Card.Title className="text-warning mb-4">My Bookings</Card.Title>
                <div className="mt-3">
                    <p className="text-muted">No bookings found.</p>
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <Container fluid className="py-4 bg-light min-vh-100">
            <Row>
                {/* Left Sidebar */}
                <Col md={3}>
                    <Card className="bg-dark text-light">
                        <Card.Body className="text-center">
                            <Image 
                                // src=""
                                roundedCircle
                                width={150}
                                height={150}
                                className="mb-3 border border-warning"
                            />
                            <h4 className="text-warning mb-4">ahmed</h4>
                            <Nav className="flex-column">
                                <Nav.Link 
                                    className={`text-light ${activeTab === 'details' ? 'bg-warning text-dark' : ''}`}
                                    onClick={() => setActiveTab('details')}
                                    style={{ borderRadius: '5px', marginBottom: '10px' }}
                                >
                                    Personal Details
                                </Nav.Link>
                                <Nav.Link 
                                    className={`text-light ${activeTab === 'bookings' ? 'bg-warning text-dark' : ''}`}
                                    onClick={() => setActiveTab('bookings')}
                                    style={{ borderRadius: '5px' }}
                                >
                                    Booking List
                                </Nav.Link>
                            </Nav>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Main Content */}
                <Col md={9}>
                    {activeTab === 'details' ? <UserDetails /> : <BookingList />}
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;