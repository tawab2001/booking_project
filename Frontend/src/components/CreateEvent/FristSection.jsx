import React from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const FirstSection = ({ data, setData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [name]: value
      }
    }));
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
                      name="eventName"
                      value={data.basicInfo.eventName}
                      onChange={handleChange}
                      placeholder="e.g. Music Concert"
                      className="bg-black text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Event Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={data.basicInfo.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe your event here"
                      className="bg-black text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={data.basicInfo.phone}
                      onChange={handleChange}
                      placeholder="e.g. 01012345678"
                      className="bg-black text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={data.basicInfo.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="bg-black text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={data.basicInfo.address}
                      onChange={handleChange}
                      placeholder="Full address"
                      className="bg-black text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Venue Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="venue"
                      value={data.basicInfo.venue}
                      onChange={handleChange}
                      placeholder="Venue or location name"
                      className="bg-black text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Category</Form.Label>
                    <Form.Control
                      as="select"
                      name="category"
                      value={data.basicInfo.category}
                      onChange={handleChange}
                      className="bg-black text-white border-secondary"
                    >
                      <option value="">Select Category</option>
                      <option value="music">Music</option>
                      <option value="art">Art</option>
                      <option value="sports">Sports</option>
                      <option value="education">Education</option>
                    </Form.Control>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FirstSection;