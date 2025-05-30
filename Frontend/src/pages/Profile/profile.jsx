import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Nav, Image } from 'react-bootstrap';
import { Facebook, Instagram, Phone, Upload } from 'lucide-react';
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
  const [uploadingImage, setUploadingImage] = useState(false);
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

      // Get stored social accounts from localStorage
      const storedSocialAccounts = JSON.parse(localStorage.getItem('social_accounts'));
      const storedUserData = JSON.parse(localStorage.getItem('user_data'));

      const updatedUserData = {
        ...response.data,
        social_accounts: storedSocialAccounts || storedUserData?.social_accounts || response.data.social_accounts || {}
      };

      setUserData(updatedUserData);
      // Update localStorage with full user data
      localStorage.setItem('user_data', JSON.stringify(updatedUserData));
      
      setError('');
    } catch (error) {
      setError('Failed to load profile data');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('user_id');
        // Don't remove user_data and social_accounts here to persist them
      }
      console.error('Profile Error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload an image file (JPEG, PNG, GIF)');
        return;
      }

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setUploadingImage(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axiosInstance.post(ENDPOINTS.UPLOAD_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.avatar) {
        setUserData(prev => ({
          ...prev,
          avatar: response.data.avatar
        }));
        toast.success('Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Image Upload Error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
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
        social_accounts: {
          facebook_url: formData.get('facebook_url')?.trim() || '',
          instagram_url: formData.get('instagram_url')?.trim() || '',
          whatsapp_number: formData.get('whatsapp_number')?.trim() || '',
        }
      };

      if (updateData.social_accounts.facebook_url && !updateData.social_accounts.facebook_url.includes('facebook.com')) {
        setError('Please enter a valid Facebook URL');
        return;
      }
      if (updateData.social_accounts.instagram_url && !updateData.social_accounts.instagram_url.includes('instagram.com')) {
        setError('Please enter a valid Instagram URL');
        return;
      }
      if (updateData.social_accounts.whatsapp_number && !/^\+?\d{10,}$/.test(updateData.social_accounts.whatsapp_number)) {
        setError('Please enter a valid WhatsApp number');
        return;
      }

      // Store social accounts in localStorage
      localStorage.setItem('social_accounts', JSON.stringify(updateData.social_accounts));

      console.log('Sending Social Update Data:', JSON.stringify(updateData, null, 2));
      const response = await axiosInstance.put(ENDPOINTS.PROFILE, updateData);

      if (response.data) {
        const updatedUserData = {
          ...userData,
          ...response.data.data,
          social_accounts: updateData.social_accounts
        };
        setUserData(updatedUserData);
        // Update localStorage with full user data
        localStorage.setItem('user_data', JSON.stringify(updatedUserData));
        
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
              <div className="position-relative avatar-container">
                <Image
                  src={userData?.avatar || '/default-avatar.png'}
                  roundedCircle
                  width={150}
                  height={150}
                  className="profile-avatar"
                />
                <label className="upload-btn" role="button" htmlFor="avatar-upload">
                  <Upload size={20} />
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  className="d-none"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <div className="upload-overlay">
                    <div className="spinner-border text-warning" role="status">
                      <span className="visually-hidden">Uploading...</span>
                    </div>
                  </div>
                )}
              </div>
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