import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const ThierdSection = () => {
  const [ticketType, setTicketType] = useState("");
  const [ticketDetails, setTicketDetails] = useState({
    name: "",
    quantity: "",
    price: "",
  });
  const [salesDates, setSalesDates] = useState({
    startSales: "",
    endSales: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalesDateChange = (e) => {
    const { name, value } = e.target;
    setSalesDates((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log({
      ticketType,
      ticketDetails,
      salesDates,
      paymentMethod,
    });
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
                  {/* اختيار نوع التذكرة */}
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Ticket Type</Form.Label>
                    <Form.Select
                      className="bg-black text-white border-secondary"
                      value={ticketType}
                      onChange={(e) => setTicketType(e.target.value)}
                    >
                      <option value="">Select Ticket Type</option>
                      <option value="VIP">VIP</option>
                      <option value="Regular">Regular</option>
                    </Form.Select>
                  </Form.Group>

                  {/* تفاصيل التذكرة */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label className="text-white">Ticket Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={ticketDetails.name}
                          onChange={handleInputChange}
                          className="bg-black text-white border-secondary"
                          placeholder="e.g. VIP Ticket"
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label className="text-white">Quantity</Form.Label>
                        <Form.Control
                          type="number"
                          name="quantity"
                          value={ticketDetails.quantity}
                          onChange={handleInputChange}
                          className="bg-black text-white border-secondary"
                          placeholder="e.g. 100"
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label className="text-white">Price</Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          value={ticketDetails.price}
                          onChange={handleInputChange}
                          className="bg-black text-white border-secondary"
                          placeholder="e.g. 50"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* تواريخ المبيعات */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label className="text-white">Start Sales</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="startSales"
                          value={salesDates.startSales}
                          onChange={handleSalesDateChange}
                          className="bg-black text-white border-secondary"
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label className="text-white">End Sales</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="endSales"
                          value={salesDates.endSales}
                          onChange={handleSalesDateChange}
                          className="bg-black text-white border-secondary"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* طريقة الدفع */}
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Payment Method</Form.Label>
                    <Form.Select
                      className="bg-black text-white border-secondary"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="">Select Payment Method</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Cash">Cash</option>
                    </Form.Select>
                  </Form.Group>

                  {/* زر الحفظ */}
                  <div className="d-flex justify-content-end mt-4">
                    <Button variant="warning" onClick={handleSubmit}>
                      Save Ticket
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

export default ThierdSection;