import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ENDPOINTS } from "../../apiConfig/api";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        ENDPOINTS.LOGIN,
        {
          email: formData.email.trim(),
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // Check for token in the correct response structure
      if (response.data?.access) {
        // Store auth data
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        localStorage.setItem("userType", response.data.user_type);

        if (response.data.user_data) {
          localStorage.setItem("user_id", response.data.user_data.id);
          localStorage.setItem("user_data", JSON.stringify(response.data.user_data));
        }

        console.log("Login successful");

        // Redirect based on user type
        if (response.data.user_type === 'organizer') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        throw new Error("Invalid response format");
      }

    } catch (err) {
      console.error("Login error:", err.response?.data || err);

      let errorMessage = "An error occurred during login";

      if (err.response) {
        if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (err.response.status === 404) {
          errorMessage = "This email is not registered.";
        } else if (err.response.status === 401) {
          errorMessage = "Invalid email or password.";
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        }
      }

      setError(errorMessage);
      // Clear password on error
      setFormData(prev => ({
        ...prev,
        password: ""
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-0"
    >
      <Row className="justify-content-center m-0" style={{ width: "100%" }}>
        <Col xs={11} sm={8} md={6} lg={4}>
          <div className="p-4 shadow rounded bg-dark text-light w-100">
            <div className="text-center mb-4">
              <h1 className="text-warning">easyTicket</h1>
              <p className="text-muted">Sign in to manage tickets</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-dark text-light border-secondary"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-dark text-light border-secondary"
                />
              </Form.Group>

              <Button
                variant="warning"
                type="submit"
                className="w-100 mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Sign In"}
              </Button>

              <p className="text-center text-muted mt-3">
                Don't have an account?{' '}
                <a href="/signup" className="text-warning text-decoration-none">
                  Sign up
                </a>
              </p>
              <p className="text-center text-muted mt-3">
                <a href="/reset-password" className="text-warning text-decoration-none">
                  Forgot Password?
                </a>
              </p>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;