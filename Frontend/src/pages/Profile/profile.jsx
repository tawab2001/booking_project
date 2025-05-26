// // import React, { useState } from 'react';
// // import { Container, Row, Col, Image, Nav, Card } from 'react-bootstrap';
// // import "bootstrap/dist/css/bootstrap.min.css";

// // const Profile = () => {
// //     const [activeTab, setActiveTab] = useState('details');

// //     const UserDetails = () => (
// //         <Card className="bg-dark text-light">
// //             <Card.Body>
// //                 <Card.Title className="text-warning mb-4">Personal Information</Card.Title>
// //                 <div className="mt-3">
// //                     <p><strong className="text-warning">Name:</strong> ahmed</p>
// //                     <p><strong className="text-warning">Email:</strong> ahmed@gmail.com</p>
// //                     <p><strong className="text-warning">Phone:</strong> +1234567890</p>
// //                     <p><strong className="text-warning">Location:</strong> qena</p>
// //                 </div>
// //             </Card.Body>
// //         </Card>
// //     );

// //     const BookingList = () => (
// //         <Card className="bg-dark text-light">
// //             <Card.Body>
// //                 <Card.Title className="text-warning mb-4">My Bookings</Card.Title>
// //                 <div className="mt-3">
// //                     <p className="text-muted">No bookings found.</p>
// //                 </div>
// //             </Card.Body>
// //         </Card>
// //     );

// //     return (
// //         <Container fluid className="py-4 bg-light min-vh-100">
// //             <Row>
// //                 {/* Left Sidebar */}
// //                 <Col md={3}>
// //                     <Card className="bg-dark text-light">
// //                         <Card.Body className="text-center">
// //                             <Image 
// //                                 // src=""
// //                                 roundedCircle
// //                                 width={150}
// //                                 height={150}
// //                                 className="mb-3 border border-warning"
// //                             />
// //                             <h4 className="text-warning mb-4">ahmed</h4>
// //                             <Nav className="flex-column">
// //                                 <Nav.Link 
// //                                     className={`text-light ${activeTab === 'details' ? 'bg-warning text-dark' : ''}`}
// //                                     onClick={() => setActiveTab('details')}
// //                                     style={{ borderRadius: '5px', marginBottom: '10px' }}
// //                                 >
// //                                     Personal Details
// //                                 </Nav.Link>
// //                                 <Nav.Link 
// //                                     className={`text-light ${activeTab === 'bookings' ? 'bg-warning text-dark' : ''}`}
// //                                     onClick={() => setActiveTab('bookings')}
// //                                     style={{ borderRadius: '5px' }}
// //                                 >
// //                                     Booking List
// //                                 </Nav.Link>
// //                             </Nav>
// //                         </Card.Body>
// //                     </Card>
// //                 </Col>

// //                 {/* Main Content */}
// //                 <Col md={9}>
// //                     {activeTab === 'details' ? <UserDetails /> : <BookingList />}
// //                 </Col>
// //             </Row>
// //         </Container>
// //     );
// // };

// // export default Profile;


// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Form, Button, Alert, Card, Nav, Image } from 'react-bootstrap';
// import { Facebook, Instagram, Phone } from 'lucide-react';
// import axiosInstance from '../../apiConfig/axiosConfig';
// import { ENDPOINTS, API_BASE_URL } from '../../apiConfig/api';
// import { useNavigate } from 'react-router-dom';
// import './profile.css';



// const Profile = () => {
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState('details');
//     const [userData, setUserData] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     useEffect(() => {
//         fetchUserData();
//     }, []);

//     const fetchUserData = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 setError('Please log in to view your profile');
//                 navigate('/login');
//                 return;
//             }

//             // Change axios.get to axiosInstance.get
//             const response = await axiosInstance.get(ENDPOINTS.PROFILE);
//             setUserData(response.data);
//         } catch (error) {
//             setError('Failed to load profile data');
//             if (error.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('userType');
//                 localStorage.removeItem('user_id');
//                 localStorage.removeItem('user_data');
//                 navigate('/login');
//             }
//             console.error('Profile Error:', error.response?.data || error.message);
//         }

//     };

//     const SocialAccounts = ({ userData, isEditing }) => (
//         <Card className="bg-dark text-light mt-4 border-secondary">
//             <Card.Body>
//                 <div className="d-flex justify-content-between align-items-center mb-4">
//                     <Card.Title className="text-warning">Social Accounts</Card.Title>
//                 </div>

//                 {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
//                 {success && <Alert variant="success" className="mb-3">{success}</Alert>}

//                 {isEditing ? (
//                     <Form onSubmit={handleUpdate}>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="d-flex align-items-center">
//                                 <Facebook className="text-primary me-2" size={20} />
//                                 Facebook Profile
//                             </Form.Label>
//                             <Form.Control
//                                 name="facebook_url"
//                                 type="url"
//                                 placeholder="https://facebook.com/your.profile"
//                                 defaultValue={userData?.facebook_url}
//                                 className="bg-dark text-light border-secondary"
//                             />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="d-flex align-items-center">
//                                 <Instagram className="text-danger me-2" size={20} />
//                                 Instagram Profile
//                             </Form.Label>
//                             <Form.Control
//                                 name="instagram_url"
//                                 type="url"
//                                 placeholder="https://instagram.com/your.profile"
//                                 defaultValue={userData?.instagram_url}
//                                 className="bg-dark text-light border-secondary"
//                             />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="d-flex align-items-center">
//                                 <Phone className="text-success me-2" size={20} />
//                                 WhatsApp Number
//                             </Form.Label>
//                             <Form.Control
//                                 name="whatsapp_number"
//                                 type="tel"
//                                 placeholder="+1234567890"
//                                 defaultValue={userData?.whatsapp_number}
//                                 className="bg-dark text-light border-secondary"
//                             />
//                         </Form.Group>
//                         <Button variant="warning" type="submit">
//                             Save Social Links
//                         </Button>
//                     </Form>
//                 ) : (
//                     <div className="social-links">
//                         {userData?.facebook_url && (
//                             <a
//                                 href={userData.facebook_url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="d-flex align-items-center mb-3 text-decoration-none text-light hover-effect"
//                                 onClick={(e) => {
//                                     if (!userData.facebook_url.startsWith('http')) {
//                                         e.preventDefault();
//                                         window.open(`https://${userData.facebook_url}`, '_blank');
//                                     }
//                                 }}
//                             >
//                                 <Facebook className="text-primary me-2" size={20} />
//                                 <span>Facebook Profile</span>
//                             </a>
//                         )}

//                         {userData?.instagram_url && (
//                             <a
//                                 href={userData.instagram_url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="d-flex align-items-center mb-3 text-decoration-none text-light hover-effect"
//                             >
//                                 <Instagram className="text-danger me-2" size={20} />
//                                 <span>Instagram Profile</span>
//                             </a>
//                         )}

//                         {userData?.whatsapp_number && (
//                             <a
//                                 href={`https://wa.me/${userData.whatsapp_number}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="d-flex align-items-center mb-3 text-decoration-none text-light hover-effect"
//                             >
//                                 <Phone className="text-success me-2" size={20} />
//                                 <span>WhatsApp: {userData.whatsapp_number}</span>
//                             </a>
//                         )}

//                         {!userData?.facebook_url && !userData?.instagram_url && !userData?.whatsapp_number && (
//                             <p className="text-muted">No social accounts linked yet.</p>
//                         )}
//                     </div>
//                 )}
//             </Card.Body>
//         </Card>
//     );

//     // const handleUpdate = async (e) => {
//     //     e.preventDefault();
//     //     try {
//     //         const token = localStorage.getItem('token');
//     //         if (!token) {
//     //             setError('Please log in to update your profile');
//     //             navigate('/login');
//     //             return;
//     //         }

//     //         const formData = new FormData(e.target);
//     //         const updateData = Object.fromEntries(formData.entries());


//     //         // Change axios.put to axiosInstance.put
//     //         await axiosInstance.put(ENDPOINTS.PROFILE, updateData);
//     //         setSuccess('Profile updated successfully!');
//     //         setIsEditing(false);
//     //         fetchUserData();
//     //     } catch (error) {
//     //         setError(error.response?.data?.message || 'Failed to update profile');
//     //         if (error.response?.status === 401) {
//     //             localStorage.removeItem('token');
//     //             localStorage.removeItem('userType');
//     //             localStorage.removeItem('user_id');
//     //             localStorage.removeItem('user_data');
//     //             navigate('/login');
//     //         }
//     //         console.error('Update Error:', error.response?.data || error.message);
//     //     }
//     // };


//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 setError('Please log in to update your profile');
//                 navigate('/login');
//                 return;
//             }

//             const formData = new FormData(e.target);
//             const updateData = {
//                 // Keep existing profile data
//                 username: formData.get('username') || userData?.username,
//                 email: formData.get('email') || userData?.email,
//                 mobile_number: formData.get('mobile_number') || userData?.mobile_number,

//                 // Handle social media fields
//                 facebook_url: formData.get('facebook_url') || userData?.facebook_url || '',
//                 instagram_url: formData.get('instagram_url') || userData?.instagram_url || '',
//                 whatsapp_number: formData.get('whatsapp_number') || userData?.whatsapp_number || ''
//             };

//             // Add company fields if they exist
//             if (userData?.company_name) {
//                 updateData.company_name = formData.get('company_name') || userData?.company_name;
//                 updateData.country = formData.get('country') || userData?.country;
//                 updateData.description = formData.get('description') || userData?.description;
//             }

//             // Validate URLs
//             if (updateData.facebook_url && !updateData.facebook_url.includes('facebook.com')) {
//                 setError('Please enter a valid Facebook URL');
//                 return;
//             }
//             if (updateData.instagram_url && !updateData.instagram_url.includes('instagram.com')) {
//                 setError('Please enter a valid Instagram URL');
//                 return;
//             }
//             if (updateData.whatsapp_number && !/^\+?\d{10,}$/.test(updateData.whatsapp_number)) {
//                 setError('Please enter a valid WhatsApp number');
//                 return;
//             }

//             const response = await axiosInstance.put(ENDPOINTS.PROFILE, updateData);

//             if (response.data) {
//                 // Update local state immediately
//                 setUserData(prev => ({
//                     ...prev,
//                     ...updateData
//                 }));
//                 setSuccess('Profile updated successfully!');
//                 setIsEditing(false);

//                 // Fetch fresh data from server
//                 await fetchUserData();
//             }
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || 'Failed to update profile';
//             setError(errorMessage);
//             console.error('Update Error:', {
//                 message: errorMessage,
//                 details: error.response?.data || error.message
//             });
//         }
//     };
//     const UserDetails = () => (
//         <Card className="bg-dark text-light">
//             <Card.Body>
//                 <div className="d-flex justify-content-between align-items-center mb-4">
//                     <Card.Title className="text-warning">Personal Information</Card.Title>
//                     <Button
//                         variant={isEditing ? "danger" : "warning"}
//                         onClick={() => setIsEditing(!isEditing)}
//                     >
//                         {isEditing ? "Cancel" : "Edit Profile"}
//                     </Button>
//                 </div>

//                 {error && <Alert variant="danger">{error}</Alert>}
//                 {success && <Alert variant="success">{success}</Alert>}

//                 {isEditing ? (
//                     <Form onSubmit={handleUpdate}>
//                         <Form.Group className="mb-3">
//                             <Form.Label>Username</Form.Label>
//                             <Form.Control
//                                 name="username"
//                                 defaultValue={userData?.username}
//                                 className="bg-dark text-light border-secondary"
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3">
//                             <Form.Label>Email</Form.Label>
//                             <Form.Control
//                                 name="email"
//                                 defaultValue={userData?.email}
//                                 className="bg-dark text-light border-secondary"
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3">
//                             <Form.Label>Phone Number</Form.Label>
//                             <Form.Control
//                                 name="mobile_number"
//                                 defaultValue={userData?.mobile_number}
//                                 className="bg-dark text-light border-secondary"
//                             />
//                         </Form.Group>
//                         {userData?.company_name && (
//                             <>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Company Name</Form.Label>
//                                     <Form.Control
//                                         name="company_name"
//                                         defaultValue={userData?.company_name}
//                                         className="bg-dark text-light border-secondary"
//                                     />
//                                 </Form.Group>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Country</Form.Label>
//                                     <Form.Control
//                                         name="country"
//                                         defaultValue={userData?.country}
//                                         className="bg-dark text-light border-secondary"
//                                     />
//                                 </Form.Group>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Description</Form.Label>
//                                     <Form.Control
//                                         as="textarea"
//                                         name="description"
//                                         defaultValue={userData?.description}
//                                         className="bg-dark text-light border-secondary"
//                                         rows={3}
//                                     />
//                                 </Form.Group>
//                             </>
//                         )}
//                         <Button variant="warning" type="submit">
//                             Save Changes
//                         </Button>
//                     </Form>
//                 ) : (
//                     <div>
//                         <p><strong className="text-warning">Username:</strong> {userData?.username}</p>
//                         <p><strong className="text-warning">Email:</strong> {userData?.email}</p>
//                         <p><strong className="text-warning">Phone:</strong> {userData?.mobile_number}</p>
//                         {userData?.company_name && (
//                             <>
//                                 <p><strong className="text-warning">Company:</strong> {userData?.company_name}</p>
//                                 <p><strong className="text-warning">Country:</strong> {userData?.country}</p>
//                                 <p><strong className="text-warning">Description:</strong> {userData?.description}</p>
//                             </>
//                         )}
//                     </div>
//                 )}
//             </Card.Body>
//         </Card>
//     );

//     return (
//         <Container fluid className="py-4 bg-dark min-vh-100">
//             <Row>
//                 <Col md={3}>
//                     <Card className="bg-dark text-light border-secondary">
//                         <Card.Body>
//                             <div className="text-center">
//                                 <Image
//                                     src="/default-avatar.png"
//                                     roundedCircle
//                                     width={150}
//                                     height={150}
//                                     className="mb-3 border border-warning"
//                                 />
//                                 <h4 className="text-warning">{userData?.username}</h4>
//                                 <p className="text-muted">{userData?.company_name || 'User'}</p>
//                             </div>
//                             <Nav className="flex-column mt-4">
//                                 <Nav.Link
//                                     className={`text-light ${activeTab === 'details' ? 'bg-warning text-dark' : ''}`}
//                                     onClick={() => setActiveTab('details')}
//                                 >
//                                     Profile Details
//                                 </Nav.Link>
//                             </Nav>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col md={9}>
//                     <UserDetails />
//                     <SocialAccounts userData={userData} isEditing={isEditing} />
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default Profile;


import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Nav, Image } from 'react-bootstrap';
import { Facebook, Instagram, Phone } from 'lucide-react';
import axiosInstance from '../../apiConfig/axiosConfig';
import { ENDPOINTS } from '../../apiConfig/api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [userData, setUserData] = useState(null);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your profile');
        navigate('/login');
        return;
      }

      const response = await axiosInstance.get(ENDPOINTS.PROFILE);
      console.log('Profile API Response:', JSON.stringify(response.data, null, 2));
      if (!response.data || !response.data.id) {
        throw new Error('Invalid profile data received');
      }
      setUserData(response.data);
      setError('');
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailsUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to update your profile');
        navigate('/login');
        return;
      }

      const formData = new FormData(e.target);
      const updateData = {
        username: formData.get('username') || userData?.username || '',
        email: formData.get('email') || '',
        mobile_number: formData.get('mobile_number') || userData?.mobile_number || '',
      };

      if (userType === 'organizer') {
        updateData.company_name = formData.get('company_name') || userData?.company_name || '';
        updateData.country = formData.get('country') || userData?.country || '';
        updateData.description = formData.get('description') || userData?.description || '';
      }

      // Remove empty fields
      Object.keys(updateData).forEach((key) => {
        if (!updateData[key]) {
          delete updateData[key];
        }
      });

      console.log('Sending Details Update Data:', JSON.stringify(updateData, null, 2));
      const response = await axiosInstance.put(ENDPOINTS.PROFILE, updateData);
      if (response.data) {
        setUserData((prev) => ({ ...prev, ...response.data.data }));
        toast.success(userType === 'organizer' ? 'Company Details updated successfully!' : 'Personal Information updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
        setIsEditingDetails(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile details';
      setError(errorMessage);
      console.error('Details Update Error:', { message: errorMessage, details: error.response?.data || error.message });
    }
  };

  const handleSocialUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to update your profile');
        navigate('/login');
        return;
      }

      const formData = new FormData(e.target);
      const updateData = {
        mobile_number: userData?.mobile_number || '',
        facebook_url: formData.get('facebook_url')?.trim() || '',
        instagram_url: formData.get('instagram_url')?.trim() || '',
        whatsapp_number: formData.get('whatsapp_number')?.trim() || '',
      };

      // Validate URLs and phone number
      if (updateData.facebook_url && !updateData.facebook_url.includes('facebook.com')) {
        setError('Please enter a valid Facebook URL');
        return;
      }
      if (updateData.instagram_url && !updateData.instagram_url.includes('instagram.com')) {
        setError('Please enter a valid Instagram URL');
        return;
      }
      if (updateData.whatsapp_number && !/^\+?\d{10,}$/.test(updateData.whatsapp_number)) {
        setError('Please enter a valid WhatsApp number');
        return;
      }

      // Remove empty fields
      Object.keys(updateData).forEach((key) => {
        if (!updateData[key]) {
          delete updateData[key];
        }
      });

      console.log('Sending Social Update Data:', JSON.stringify(updateData, null, 2));
      const response = await axiosInstance.put(ENDPOINTS.PROFILE, updateData);

      if (response.data) {
        setUserData((prev) => ({ ...prev, ...response.data.data }));
        toast.success('Social Accounts updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
        setIsEditingSocial(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update social accounts';
      setError(errorMessage);
      console.error('Social Update Error:', { message: errorMessage, details: error.response?.data || error.message });
    }
  };

  const CompanyProfile = () => (
    <Card className="profile-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Card.Title className="profile-card-title">Company Details</Card.Title>
          <Button
            variant={isEditingDetails ? 'danger' : 'warning'}
            className="profile-button"
            onClick={() => setIsEditingDetails(!isEditingDetails)}
          >
            {isEditingDetails ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {error && <Alert variant="danger" className="profile-alert">{error}</Alert>}

        {isLoading ? (
          <p>Loading company details...</p>
        ) : isEditingDetails ? (
          <Form onSubmit={handleDetailsUpdate} className="profile-form">
            <Form.Group className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="company_name"
                defaultValue={userData?.company_name}
                className="profile-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                defaultValue={userData?.description}
                className="profile-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                defaultValue={userData?.country}
                className="profile-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                defaultValue={userData?.email}
                className="profile-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="mobile_number"
                defaultValue={userData?.mobile_number}
                className="profile-input"
              />
            </Form.Group>
            <Button variant="warning" type="submit" className="profile-button">
              Save Company Details
            </Button>
          </Form>
        ) : (
          <div className="profile-details">
            <p><strong className="text-warning">Company Name:</strong> {userData?.company_name || 'N/A'}</p>
            <p><strong className="text-warning">Description:</strong> {userData?.description || 'N/A'}</p>
            <p><strong className="text-warning">Country:</strong> {userData?.country || 'N/A'}</p>
            <p><strong className="text-warning">Email:</strong> {userData?.email || 'N/A'}</p>
            <p><strong className="text-warning">Phone:</strong> {userData?.mobile_number || 'N/A'}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  const UserDetails = () => (
    <Card className="profile-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Card.Title className="profile-card-title">Personal Information</Card.Title>
          <Button
            variant={isEditingDetails ? 'danger' : 'warning'}
            className="profile-button"
            onClick={() => setIsEditingDetails(!isEditingDetails)}
          >
            {isEditingDetails ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {error && <Alert variant="danger" className="profile-alert">{error}</Alert>}

        {isLoading ? (
          <p>Loading personal information...</p>
        ) : isEditingDetails ? (
          <Form onSubmit={handleDetailsUpdate} className="profile-form">
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                defaultValue={userData?.username}
                className="profile-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                defaultValue={userData?.email}
                className="profile-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                name="mobile_number"
                defaultValue={userData?.mobile_number}
                className="profile-input"
              />
            </Form.Group>
            <Button variant="warning" type="submit" className="profile-button">
              Save Personal Details
            </Button>
          </Form>
        ) : (
          <div className="profile-details">
            <p><strong className="text-warning">Username:</strong> {userData?.username || 'N/A'}</p>
            <p><strong className="text-warning">Email:</strong> {userData?.email || 'N/A'}</p>
            <p><strong className="text-warning">Phone:</strong> {userData?.mobile_number || 'N/A'}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  const SocialAccounts = ({ userData }) => (
    <Card className="profile-card mt-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Card.Title className="profile-card-title">Social Accounts</Card.Title>
          <Button
            variant={isEditingSocial ? 'danger' : 'warning'}
            className="profile-button"
            onClick={() => setIsEditingSocial(!isEditingSocial)}
          >
            {isEditingSocial ? 'Cancel' : 'Edit Social Accounts'}
          </Button>
        </div>

        {error && <Alert variant="danger" className="profile-alert">{error}</Alert>}

        {isLoading ? (
          <p>Loading social accounts...</p>
        ) : isEditingSocial ? (
          <Form onSubmit={handleSocialUpdate} className="profile-form">
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <Facebook className="text-primary me-2" size={20} />
                Facebook Profile
              </Form.Label>
              <Form.Control
                name="facebook_url"
                type="url"
                placeholder="https://facebook.com/your.profile"
                defaultValue={userData?.social_accounts?.facebook_url || ''}
                className="profile-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <Instagram className="text-danger me-2" size={20} />
                Instagram Profile
              </Form.Label>
              <Form.Control
                name="instagram_url"
                type="url"
                placeholder="https://instagram.com/your.profile"
                defaultValue={userData?.social_accounts?.instagram_url || ''}
                className="profile-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <Phone className="text-success me-2" size={20} />
                WhatsApp Number
              </Form.Label>
              <Form.Control
                name="whatsapp_number"
                type="tel"
                placeholder="+1234567890"
                defaultValue={userData?.social_accounts?.whatsapp_number || ''}
                className="profile-input"
              />
            </Form.Group>
            <Button variant="warning" type="submit" className="profile-button">
              Save Social Accounts
            </Button>
          </Form>
        ) : (
          <div className="social-links">
            {userData?.social_accounts?.facebook_url ? (
              <a
                href={userData.social_accounts.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link facebook-link"
                onClick={(e) => {
                  if (!userData.social_accounts.facebook_url.startsWith('http')) {
                    e.preventDefault();
                    window.open(`https://${userData.social_accounts.facebook_url}`, '_blank');
                  }
                }}
              >
                <Facebook className="text-primary me-2" size={20} />
                <span>Facebook Profile</span>
              </a>
            ) : null}
            {userData?.social_accounts?.instagram_url ? (
              <a
                href={userData.social_accounts.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link instagram-link"
              >
                <Instagram className="text-danger me-2" size={20} />
                <span>Instagram Profile</span>
              </a>
            ) : null}
            {userData?.social_accounts?.whatsapp_number ? (
              <a
                href={`https://wa.me/${userData.social_accounts.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link whatsapp-link"
              >
                <Phone className="text-success me-2" size={20} />
                <span>WhatsApp: {userData.social_accounts.whatsapp_number}</span>
              </a>
            ) : null}
            {!userData?.social_accounts?.facebook_url &&
              !userData?.social_accounts?.instagram_url &&
              !userData?.social_accounts?.whatsapp_number && (
                <p className="text-muted">No social accounts linked yet.</p>
              )}
          </div>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="profile-container">
      <ToastContainer />
      <Row>
        <Col md={3}>
          <Card className="profile-sidebar">
            <Card.Body className="text-center">
              <Image
                src={userData?.avatar_url || '/default-avatar.png'}
                roundedCircle
                width={150}
                height={150}
                className="profile-avatar"
              />
              <h4 className="profile-username">{userData?.username || 'Loading...'}</h4>
              <p className="profile-role">{userData?.company_name || 'User'}</p>
              <Nav className="flex-column mt-4">
                <Nav.Link
                  className={`profile-nav-link ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  {userType === 'organizer' ? 'Company Details' : 'Profile Details'}
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          {userType === 'organizer' ? (
            <>
              <CompanyProfile />
              <SocialAccounts userData={userData} />
            </>
          ) : (
            <>
              <UserDetails />
              <SocialAccounts userData={userData} />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;