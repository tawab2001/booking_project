import React from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const FristSection = () => {
  const handleContinue = () => {
    console.log("Save Event Details");
  };

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh" }}>
      <Container fluid="lg" className="py-4">
        <Row className="g-4">
          <Col lg={8}>
            <Card className="bg-black text-white border-secondary">
              <Card.Body className="p-4">
                <div className="border-bottom border-secondary pb-4 mb-4">
                  <h2 className="fw-semibold fs-4 mb-1">Create Event</h2>
                  <p className="text-secondary mb-0">
                    Fill in the details below to create your event.
                  </p>
                </div>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Event Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. Music Concert"
                      className="bg-black text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Event Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Describe your event here"
                      className="bg-black text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="e.g. 01012345678"
                      className="bg-black text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="example@email.com"
                      className="bg-black text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Full address"
                      className="bg-black text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Venue Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. City Hall"
                      className="bg-black text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Category</Form.Label>
                    <Form.Select className="bg-black text-white border-secondary">
                      <option>Select category</option>
                      <option>Music</option>
                      <option>Sports</option>
                      <option>Conference</option>
                      <option>Other</option>
                    </Form.Select>
                  </Form.Group>

                  <div className="d-flex justify-content-end mt-4">
                    <Button
                      variant="warning"
                      onClick={handleContinue}
                    >
                      Save Event Details
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FristSection;