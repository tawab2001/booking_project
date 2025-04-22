import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Login successful:", { email, password });
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-0"
      style={{ width: "100%", height: "100%" }}
    >
      <Row className="justify-content-center m-0" style={{ width: "100%" }}>
        <Col
          xs={11}
          sm={8}
          md={6}
          lg={4}
          className="d-flex align-items-center justify-content-center"
        >
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
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-dark text-light border-secondary"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
