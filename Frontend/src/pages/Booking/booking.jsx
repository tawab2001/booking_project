import React, { useState } from 'react';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';
import { Minus, Plus, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TICKET_TYPES = [
  { id: 1, name: 'General Admission', price: 50, description: 'Basic entry to the event', max: 10 },
  { id: 2, name: 'VIP Access', price: 120, description: 'Priority access with exclusive areas', max: 4 },
  { id: 3, name: 'Premium Package', price: 200, description: 'All-inclusive experience with meet & greet', max: 2 }
];

function Booking() {
  const [bookingData, setBookingData] = useState({
    tickets: TICKET_TYPES.map(type => ({
      id: type.id,
      name: type.name,
      price: type.price,
      quantity: 0
    })),
    totalAmount: 0,
    paymentMethod: 'creditCard',
  });
  const [validated, setValidated] = useState(false);

  const handleQuantityChange = (ticketId, change) => {
    const updatedTickets = bookingData.tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const ticketType = TICKET_TYPES.find(t => t.id === ticketId);
        const max = ticketType ? ticketType.max : 10;
        const newQuantity = Math.max(0, Math.min(ticket.quantity + change, max));
        return { ...ticket, quantity: newQuantity };
      }
      return ticket;
    });

    const totalAmount = updatedTickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0);
    setBookingData({ ...bookingData, tickets: updatedTickets, totalAmount });
  };

  const handlePaymentMethodChange = (method) => {
    setBookingData({ ...bookingData, paymentMethod: method });
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    alert('Booking confirmed!');
  };

  const hasSelectedTickets = bookingData.tickets.some(ticket => ticket.quantity > 0);

  return (
    <div className="min-vh-100 bg-light py-4">
      <Container>
        <div className="bg-white rounded-3 shadow-sm overflow-hidden">
          <div className="bg-dark text-white p-4 text-center mb-4">
            <h1>Event Booking</h1>
          </div>

          <Form noValidate validated={validated} onSubmit={handleConfirmBooking}>
            <div className="p-4">

              {/* Ticket Selection Section */}
              <section className="mb-5">
                <h2 className="mb-4">Select Tickets</h2>
                {TICKET_TYPES.map((ticketType) => (
                  <div key={ticketType.id} className="mb-3">
                    <Row>
                      <Col md={7}>
                        <h5>{ticketType.name}</h5>
                        <p className="text-muted">{ticketType.description}</p>
                        <h6>${ticketType.price.toFixed(2)}</h6>
                      </Col>
                      <Col md={5} className="d-flex align-items-center justify-content-end">
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-warning"
                            onClick={() => handleQuantityChange(ticketType.id, -1)}
                            disabled={!bookingData.tickets.find(t => t.id === ticketType.id)?.quantity}
                            className="rounded-circle"
                          >
                            <Minus />
                          </Button>
                          <Form.Control
                            type="number"
                            min="0"
                            max={ticketType.max}
                            value={bookingData.tickets.find(t => t.id === ticketType.id)?.quantity || 0}
                            onChange={(e) => handleQuantityChange(ticketType.id, parseInt(e.target.value) || 0)}
                            className="mx-2 text-center"
                            style={{ width: '60px' }}
                          />
                          <Button
                            variant="outline-warning"
                            onClick={() => handleQuantityChange(ticketType.id, 1)}
                            disabled={
                              (bookingData.tickets.find(t => t.id === ticketType.id)?.quantity || 0) >= ticketType.max
                            }
                            className="rounded-circle"
                          >
                            <Plus />
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
              </section>

              {/* Payment Options Section */}
              <section className="mb-5">
                <h2 className="mb-4">Payment Options</h2>
                <div
                  className={`border rounded-3 p-3 mb-3 ${bookingData.paymentMethod === 'creditCard' ? 'border-warning bg-warning bg-opacity-10' : ''}`}
                  onClick={() => handlePaymentMethodChange('creditCard')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      id="creditCard"
                      name="paymentMethod"
                      value="creditCard"
                      checked={bookingData.paymentMethod === 'creditCard'}
                      onChange={(e) => handlePaymentMethodChange(e.target.value)}
                      label=""
                    />
                    <CreditCard size={24} className="me-2 text-warning" />
                    <h5 className="mb-0">Credit Card</h5>
                  </div>
                </div>
              </section>

              <div className="d-flex justify-content-end">
                <Button variant="warning" type="submit" disabled={!hasSelectedTickets}>
                  Confirm Booking
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Booking;