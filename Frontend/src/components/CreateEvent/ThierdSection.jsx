import React from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const ThierdSection = ({ data, setData }) => {
  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      tickets: {
        ...prev.tickets,
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
                  <h2 className="fw-semibold fs-4 mb-1">Ticket Details</h2>
                  <p className="text-secondary mb-0">
                    Fill in the details below to configure your tickets.
                  </p>
                </div>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Ticket Type</Form.Label>
                    <Form.Select
                      name="ticketType"
                      className="bg-black text-white border-secondary"
                      value={data.tickets.ticketType}
                      onChange={handleTicketChange}
                    >
                      <option value="">Select Ticket Type</option>
                      <option value="VIP">VIP</option>
                      <option value="Regular">Regular</option>
                    </Form.Select>
                  </Form.Group>

                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Ticket Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="ticketName"
                          value={data.tickets.ticketName}
                          onChange={handleTicketChange}
                          className="bg-black text-white border-secondary"
                          placeholder="e.g. VIP Ticket"
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                          type="number"
                          name="quantity"
                          value={data.tickets.quantity}
                          onChange={handleTicketChange}
                          className="bg-black text-white border-secondary"
                          placeholder="e.g. 100"
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          value={data.tickets.price}
                          onChange={handleTicketChange}
                          className="bg-black text-white border-secondary"
                          placeholder="e.g. 50"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Start Sales</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="startSales"
                          value={data.tickets.startSales}
                          onChange={handleTicketChange}
                          className="bg-black text-white border-secondary"
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>End Sales</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="endSales"
                          value={data.tickets.endSales}
                          onChange={handleTicketChange}
                          className="bg-black text-white border-secondary"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Select
                      name="paymentMethod"
                      className="bg-black text-white border-secondary"
                      value={data.tickets.paymentMethod}
                      onChange={handleTicketChange}
                    >
                      <option value="">Select Payment Method</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Cash">Cash</option>
                    </Form.Select>
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

export default ThierdSection;