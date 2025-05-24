import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';
import axiosInstance from '../../apiConfig/axiosConfig';

// Contact Info Item Component
const ContactInfoItem = ({ icon, title, content }) => (
  <div className="d-flex">
    <div className="bg-warning rounded-circle p-2 me-3">
      {icon}
    </div>
    <div>
      <h5 className="fs-6 fw-bold mb-1">{title}</h5>
      <p className="text-muted mb-0">{content}</p>
    </div>
  </div>
);

// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError('');
      
      try {
        // Fixed the API endpoint URL - removed duplicate /api/
        const response = await axiosInstance.post('/contact/', formData);
        
        if (response.data.status === 'success') {
          setShowSuccess(true);
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
          });
          
          setTimeout(() => {
            setShowSuccess(false);
          }, 5000);
        }
      } catch (error) {
        console.error('Contact form error:', error);
        setSubmitError(
          error.response?.data?.message || 
          'Failed to send message. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    }
};

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <Card.Title className="mb-4 fs-4">Send Us a Message</Card.Title>
        
        {showSuccess && (
          <Alert variant="success" className="mb-4" dismissible>
            Thank you for your message! We'll get back to you soon.
          </Alert>
        )}
        
        {submitError && (
          <Alert variant="danger" className="mb-4" dismissible onClose={() => setSubmitError('')}>
            {submitError}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Your Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter message subject"
              isInvalid={!!errors.subject}
            />
            <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message"
              rows={5}
              isInvalid={!!errors.message}
            />
            <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
          </Form.Group>
          
          <Button 
            variant="warning" 
            type="submit" 
            className="d-flex align-items-center justify-content-center gap-2"
            disabled={isSubmitting}
            style={{ width: '180px' }}
          >
            {isSubmitting ? 'Sending...' : (
              <>
                <Send size={18} />
                <span>Send Message</span>
              </>
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

// Contact Info Component
const ContactInfo = () => (
  <div className="h-100 d-flex flex-column">
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body className="p-4">
        <Card.Title className="mb-4 fs-4">Contact Information</Card.Title>
        
        <div className="d-flex flex-column gap-4">
          <ContactInfoItem 
            icon={<MapPin />} 
            title="Our Location"
            content="123 Tahrir Square, Cairo, Egypt"
          />
          
          <ContactInfoItem 
            icon={<Phone />} 
            title="Phone Number"
            content="+20 102 200 2204"
          />
          
          <ContactInfoItem 
            icon={<Mail />} 
            title="Email Address"
            content="contact@easyticket.com"
          />
          
          <ContactInfoItem 
            icon={<Clock />} 
            title="Working Hours"
            content="Sunday - Thursday: 9:00 AM - 5:00 PM"
          />
        </div>
      </Card.Body>
    </Card>
    
    <Card className="border-0 shadow-sm mt-auto">
      <Card.Body className="p-0">
        <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
          <div 
            className="bg-light w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ 
              backgroundImage: 'url(https://images.pexels.com/photos/16013312/pexels-photo-16013312/free-photo-of-smartphone-with-google-maps.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="bg-dark bg-opacity-50 text-white p-3 rounded">
              <p className="m-0">Map view of our location</p>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  </div>
);

// Page Title Component
const PageTitle = ({ title, subtitle }) => (
  <Row className="mb-4">
    <Col>
      <h1 className="fw-bold mb-3 display-5">
        <span className="text-warning">•</span> {title}
      </h1>
      {subtitle && <p className="lead text-muted">{subtitle}</p>}
      <hr className="my-4" />
    </Col>
  </Row>
);

// Main Contact Component
function Contact() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="flex-grow-1 py-5">
        <PageTitle 
          title="Contact Us" 
          subtitle="We'd love to hear from you. Please fill out the form below or use our contact information."
        />
        <Row className="mt-5 g-4">
          <Col lg={7}>
            <ContactForm />
          </Col>
          <Col lg={5}>
            <ContactInfo />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Contact;