// import React, { useState } from 'react';
// import { Container, Row, Col, Image, Nav, Card } from 'react-bootstrap';
// import "bootstrap/dist/css/bootstrap.min.css";

// const Profile = () => {
//     const [activeTab, setActiveTab] = useState('details');

//     const UserDetails = () => (
//         <Card className="bg-dark text-light">
//             <Card.Body>
//                 <Card.Title className="text-warning mb-4">Personal Information</Card.Title>
//                 <div className="mt-3">
//                     <p><strong className="text-warning">Name:</strong> ahmed</p>
//                     <p><strong className="text-warning">Email:</strong> ahmed@gmail.com</p>
//                     <p><strong className="text-warning">Phone:</strong> +1234567890</p>
//                     <p><strong className="text-warning">Location:</strong> qena</p>
//                 </div>
//             </Card.Body>
//         </Card>
//     );

//     const BookingList = () => (
//         <Card className="bg-dark text-light">
//             <Card.Body>
//                 <Card.Title className="text-warning mb-4">My Bookings</Card.Title>
//                 <div className="mt-3">
//                     <p className="text-muted">No bookings found.</p>
//                 </div>
//             </Card.Body>
//         </Card>
//     );

//     return (
//         <Container fluid className="py-4 bg-light min-vh-100">
//             <Row>
//                 {/* Left Sidebar */}
//                 <Col md={3}>
//                     <Card className="bg-dark text-light">
//                         <Card.Body className="text-center">
//                             <Image 
//                                 // src=""
//                                 roundedCircle
//                                 width={150}
//                                 height={150}
//                                 className="mb-3 border border-warning"
//                             />
//                             <h4 className="text-warning mb-4">ahmed</h4>
//                             <Nav className="flex-column">
//                                 <Nav.Link 
//                                     className={`text-light ${activeTab === 'details' ? 'bg-warning text-dark' : ''}`}
//                                     onClick={() => setActiveTab('details')}
//                                     style={{ borderRadius: '5px', marginBottom: '10px' }}
//                                 >
//                                     Personal Details
//                                 </Nav.Link>
//                                 <Nav.Link 
//                                     className={`text-light ${activeTab === 'bookings' ? 'bg-warning text-dark' : ''}`}
//                                     onClick={() => setActiveTab('bookings')}
//                                     style={{ borderRadius: '5px' }}
//                                 >
//                                     Booking List
//                                 </Nav.Link>
//                             </Nav>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 {/* Main Content */}
//                 <Col md={9}>
//                     {activeTab === 'details' ? <UserDetails /> : <BookingList />}
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default Profile;


import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Nav, Image } from 'react-bootstrap';
// import axiosInstance from '../../apiConfig/axiosConfig';
import axiosInstance  from '../../apiConfig/axiosConfig';
import { ENDPOINTS, API_BASE_URL } from '../../apiConfig/api';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('details');
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to view your profile');
            navigate('/login');
            return;
        }

        // Change axios.get to axiosInstance.get
        const response = await axiosInstance.get(ENDPOINTS.PROFILE);
        setUserData(response.data);
    } catch (error) {
        setError('Failed to load profile data');
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_data');
            navigate('/login');
        }
        console.error('Profile Error:', error.response?.data || error.message);
    }
};

const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to update your profile');
            navigate('/login');
            return;
        }

        const formData = new FormData(e.target);
        const updateData = Object.fromEntries(formData.entries());

        // Change axios.put to axiosInstance.put
        await axiosInstance.put(ENDPOINTS.PROFILE, updateData);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        fetchUserData();
    } catch (error) {
        setError(error.response?.data?.message || 'Failed to update profile');
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_data');
            navigate('/login');
        }
        console.error('Update Error:', error.response?.data || error.message);
    }
};

    const UserDetails = () => (
        <Card className="bg-dark text-light">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Card.Title className="text-warning">Personal Information</Card.Title>
                    <Button 
                        variant={isEditing ? "danger" : "warning"}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                {isEditing ? (
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                name="username"
                                defaultValue={userData?.username}
                                className="bg-dark text-light border-secondary"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                name="email"
                                defaultValue={userData?.email}
                                className="bg-dark text-light border-secondary"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                name="mobile_number"
                                defaultValue={userData?.mobile_number}
                                className="bg-dark text-light border-secondary"
                            />
                        </Form.Group>
                        {userData?.company_name && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Company Name</Form.Label>
                                    <Form.Control
                                        name="company_name"
                                        defaultValue={userData?.company_name}
                                        className="bg-dark text-light border-secondary"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        name="country"
                                        defaultValue={userData?.country}
                                        className="bg-dark text-light border-secondary"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        defaultValue={userData?.description}
                                        className="bg-dark text-light border-secondary"
                                        rows={3}
                                    />
                                </Form.Group>
                            </>
                        )}
                        <Button variant="warning" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                ) : (
                    <div>
                        <p><strong className="text-warning">Username:</strong> {userData?.username}</p>
                        <p><strong className="text-warning">Email:</strong> {userData?.email}</p>
                        <p><strong className="text-warning">Phone:</strong> {userData?.mobile_number}</p>
                        {userData?.company_name && (
                            <>
                                <p><strong className="text-warning">Company:</strong> {userData?.company_name}</p>
                                <p><strong className="text-warning">Country:</strong> {userData?.country}</p>
                                <p><strong className="text-warning">Description:</strong> {userData?.description}</p>
                            </>
                        )}
                    </div>
                )}
            </Card.Body>
        </Card>
    );

    return (
        <Container fluid className="py-4 bg-dark min-vh-100">
            <Row>
                <Col md={3}>
                    <Card className="bg-dark text-light border-secondary">
                        <Card.Body>
                            <div className="text-center">
                                <Image
                                    src="/default-avatar.png"
                                    roundedCircle
                                    width={150}
                                    height={150}
                                    className="mb-3 border border-warning"
                                />
                                <h4 className="text-warning">{userData?.username}</h4>
                                <p className="text-muted">{userData?.company_name || 'User'}</p>
                            </div>
                            <Nav className="flex-column mt-4">
                                <Nav.Link 
                                    className={`text-light ${activeTab === 'details' ? 'bg-warning text-dark' : ''}`}
                                    onClick={() => setActiveTab('details')}
                                >
                                    Profile Details
                                </Nav.Link>
                            </Nav>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={9}>
                    <UserDetails />
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;