import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../../apiConfig/api';

const RequestReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await axios.post(ENDPOINTS.REQUEST_RESET_PASSWORD, { email });
      setSuccess('Password reset instructions sent to your email');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="justify-content-center w-100">
        <Col xs={11} sm={8} md={6} lg={4}>
          <div className="p-4 shadow rounded bg-dark text-light">
            <h2 className="text-warning text-center mb-4">Reset Password</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleRequestReset}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-dark text-light border-secondary"
                />
              </Form.Group>
              <Button
                variant="warning"
                type="submit"
                className="w-100"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </Form>

            <p className="text-center text-muted mt-3">
              <a href="/login" className="text-warning text-decoration-none">
                Back to Login
              </a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RequestReset;