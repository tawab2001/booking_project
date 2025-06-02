import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Form, Alert, Spinner, Image } from 'react-bootstrap';
import { Minus, Plus, CreditCard, Wallet, Building } from 'lucide-react';
import { FaPaypal } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import ticketApi from '../../apiConfig/ticketApi';
import eventApi from '../../apiConfig/eventApi';
import { placeholderImage } from '../../assets/placeholder';
import PaymentForm from '../../components/PaymentForm';

const PAYMENT_ICONS = {
  'Credit Card': CreditCard,
  'PayPal': FaPaypal,
  'Debit Card': Wallet,
  'Bank Transfer': Building,
};

function Booking() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [event, setEvent] = useState(null);
  const [bookingData, setBookingData] = useState({
    tickets: [],
    totalAmount: 0,
    paymentMethod: '',
  });
  const [validated, setValidated] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedTickets, setBookedTickets] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchEventAndTickets();
  }, [eventId]);

  const fetchEventAndTickets = async () => {
    try {
      const [eventData, ticketTypesData] = await Promise.all([
        eventApi.getEventById(eventId),
        ticketApi.getTicketTypes(eventId)
      ]);

      setEvent(eventData);
      setBookingData(prev => ({
        ...prev,
        paymentMethod: eventData.paymentMethod
      }));

      // Group and combine similar ticket types
      const groupedTickets = ticketTypesData.reduce((acc, ticket) => {
        const key = ticket.name.toLowerCase();
        if (!acc[key]) {
          acc[key] = {
            ...ticket,
            price: parseFloat(ticket.price || 0),
            final_price: parseFloat(ticket.final_price || ticket.price || 0) + parseFloat(ticket.surcharge || 2.00),
            surcharge: parseFloat(ticket.surcharge || 2.00),
            available_quantity: parseInt(ticket.available_quantity || 0),
            max_per_person: parseInt(ticket.max_per_person || 1)
          };
        } else {
          // Combine quantities for same ticket types
          acc[key].available_quantity += parseInt(ticket.available_quantity || 0);
        }
        return acc;
      }, {});

      const uniqueTicketTypes = Object.values(groupedTickets);
      
      setTicketTypes(uniqueTicketTypes);
      setBookingData(prev => ({
        ...prev,
        tickets: uniqueTicketTypes.map(type => ({
          id: type.id,
          name: type.name,
          price: type.price,
          final_price: type.final_price,
          quantity: 0
        }))
      }));
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load event details. Please try again later.');
      setLoading(false);
    }
  };

  const handleQuantityChange = (ticketId, change) => {
    const updatedTickets = bookingData.tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const ticketType = ticketTypes.find(t => t.id === ticketId);
        const newQuantity = Math.max(0, Math.min(
          ticket.quantity + (typeof change === 'number' ? change : parseInt(change) || 0),
          Math.min(ticketType.max_per_person, ticketType.available_quantity)
        ));
        return { ...ticket, quantity: newQuantity };
      }
      return ticket;
    });

    const totalAmount = updatedTickets.reduce((sum, ticket) => {
      const ticketType = ticketTypes.find(t => t.id === ticket.id);
      return sum + (ticketType.final_price * ticket.quantity);
    }, 0);

    setBookingData({ ...bookingData, tickets: updatedTickets, totalAmount });
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const ticketsToBook = bookingData.tickets.filter(t => t.quantity > 0);
      
      const bookedTicketsResponses = await Promise.all(
        ticketsToBook.map(ticket =>
          ticketApi.bookTickets({
            event: parseInt(eventId),
            ticket_type: parseInt(ticket.id),
            quantity: parseInt(ticket.quantity),
            payment_method: bookingData.paymentMethod
          })
        )
      );

      const allBookedTickets = bookedTicketsResponses.flatMap(response => response);
      
      if (allBookedTickets.length > 0) {
        setBookedTickets(allBookedTickets);
        // Show ticket preview instead of payment
        setBookingSuccess(true);
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to book tickets. Please try again.');
    }
  };

  const handlePaymentSuccess = (ticketData) => {
    setBookingSuccess(true);
    setShowPayment(false);
  };

  const handlePaymentError = (errorMessage) => {
    setError(`Payment failed: ${errorMessage}`);
    setShowPayment(false);
  };

  const handlePrintTicket = async (ticketId) => {
    try {
      const ticket = await ticketApi.printTicket(ticketId);
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Event Ticket</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
              body {
                font-family: 'Poppins', sans-serif;
                padding: 20px;
                margin: 0;
                background: #f5f5f5;
              }
              .ticket-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                overflow: hidden;
                page-break-inside: avoid;
              }
              .ticket-header {
                background: linear-gradient(135deg, #ffd700, #ffa500);
                color: white;
                padding: 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
              }
              .ticket-header h1 {
                margin: 0;
                font-size: 28px;
                text-transform: uppercase;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
                position: relative;
                z-index: 1;
              }
              .ticket-header-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 0.3;
              }
              .event-logo {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                object-fit: cover;
                z-index: 2;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              }
              .ticket-body {
                padding: 30px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                align-items: start;
              }
              .ticket-info {
                border-right: 2px dashed #eee;
                padding-right: 30px;
              }
              .qr-section {
                text-align: center;
                padding: 30px;
                background: #f8f9fa;
                border-radius: 15px;
              }
              .qr-code {
                background: white;
                padding: 25px;
                border-radius: 10px;
                display: inline-block;
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .qr-code img {
                width: 200px;
                height: 200px;
                display: block;
              }
              .info-row {
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
              }
              .info-label {
                color: #666;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
              }
              .info-value {
                color: #333;
                font-size: 16px;
                font-weight: 600;
              }
              .ticket-footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #eee;
              }
              .ticket-status {
                display: inline-block;
                padding: 5px 15px;
                border-radius: 20px;
                background: #ffd700;
                color: #000;
                font-weight: 600;
                font-size: 14px;
                margin-top: 10px;
              }
              .ticket-id {
                font-family: monospace;
                background: #f8f9fa;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 14px;
              }
              @media print {
                body {
                  background: white;
                  padding: 0;
                }
                .ticket-container {
                  box-shadow: none;
                }
                .qr-section {
                  background: white;
                }
                .ticket-status {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            <div class="ticket-container">
              <div class="ticket-header">
                <img 
                  src="${event?.cover_image || placeholderImage}" 
                  alt="${event?.title}"
                  class="ticket-header-bg"
                />
                ${event?.social_image ? `
                  <img 
                    src="${event.social_image}" 
                    alt="${event?.title} logo"
                    class="event-logo"
                  />
                ` : ''}
                <h1>${event?.title || 'Event Ticket'}</h1>
              </div>
              <div class="ticket-body">
                <div class="ticket-info">
                  <div class="info-row">
                    <div class="info-label">Ticket Type</div>
                    <div class="info-value">${ticket.ticket_type_details.name}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Event Date & Time</div>
                    <div class="info-value">
                      ${new Date(event?.dates?.[0]?.startDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                      <br/>
                      ${event?.dates?.[0]?.startTime || 'TBA'}
                    </div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Venue</div>
                    <div class="info-value">${event?.venue || 'TBA'}</div>
                    <div class="info-value" style="font-size: 14px; color: #666; margin-top: 5px;">
                      ${event?.address || ''}
                    </div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Price</div>
                    <div class="info-value">$${Number(ticket.final_price).toFixed(2)}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Status</div>
                    <div class="ticket-status">${ticket.status}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Ticket ID</div>
                    <div class="ticket-id">${ticket.id}</div>
                  </div>
                </div>
                <div class="qr-section">
                  <div class="qr-code">
                    <img src="data:image/png;base64,${ticket.ticket_qr}" alt="Ticket QR Code" />
                  </div>
                  <div style="margin-bottom: 15px;">
                    <h4 style="color: #333; margin: 0 0 5px 0;">Scan QR Code at Event Entry</h4>
                    <p style="color: #666; margin: 0; font-size: 14px;">
                      Present this QR code at the venue entrance for validation
                    </p>
                  </div>
                </div>
              </div>
              <div class="ticket-footer">
                <p style="margin: 0;">
                  This ticket is valid only for the specified event and is non-transferable.<br/>
                  Keep this ticket safe and present it at the venue entrance.
                </p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } catch (err) {
      setError('Failed to print ticket. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <Container className="py-4">
        <Card>
          <Card.Body>
            <h2 className="text-warning mb-4">Ticket Preview</h2>
            <div className="mb-4">
              {bookedTickets.map((ticket) => (
                <div key={ticket.id} className="mb-3 p-3 border rounded">
                  <h5>{ticket.ticket_type_details.name}</h5>
                  <p className="mb-2">Status: {ticket.status}</p>
                  <p className="mb-2">Price: ${ticket.final_price}</p>
                  <div className="d-flex gap-2">
                    <Button variant="warning" onClick={() => handlePrintTicket(ticket.id)}>
                      Print Ticket
                    </Button>
                    <Button 
                      variant="success" 
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setShowPayment(true);
                        setBookingSuccess(false);
                      }}
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={() => navigate('/')}>
                Back to Home
              </Button>
              <Button 
                variant="outline-warning" 
                onClick={() => navigate(`/event/${eventId}`)}
              >
                Back to Event
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (showPayment) {
    return (
      <Container className="py-4">
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Complete Payment</h2>
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setShowPayment(false);
                  setBookingSuccess(true);
                }}
              >
                Back to Tickets
              </Button>
            </div>
            <div className="mb-4">
              <h5>Ticket Details:</h5>
              <p className="mb-1">Type: {selectedTicket.ticket_type_details.name}</p>
              <p className="mb-1">Price: ${selectedTicket.final_price}</p>
            </div>
            <PaymentForm
              ticketId={selectedTicket.id}
              amount={selectedTicket.final_price}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <Container>
        <div className="bg-white rounded-3 shadow-sm overflow-hidden">
            <div 
              className="position-relative text-white text-center py-5"
              style={{
                background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image
                src={event?.cover_image || placeholderImage}
                alt={event?.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: -1
                }}
              />
              {event?.social_image && (
                <Image
                  src={event.social_image}
                  alt={`${event.title} logo`}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    border: '3px solid white',
                    objectFit: 'cover',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    zIndex: 1
                  }}
                />
              )}
              <div className="position-relative">
                <h1 className="display-4 fw-bold mb-3">{event?.title}</h1>
                <p className="lead mb-0">{event?.venue}</p>
                <p className="mb-0">{event?.dates?.[0]?.startDate} at {event?.dates?.[0]?.startTime}</p>
              </div>
          </div>

            {error && (
              <Alert variant="danger" className="mx-4 mt-4" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}

          <Form noValidate validated={validated} onSubmit={handleConfirmBooking}>
            <div className="p-4">
              <section className="mb-5">
                <h2 className="mb-4">Select Tickets</h2>
                  {ticketTypes.map((ticketType) => (
                  <div key={ticketType.id} className="mb-3">
                    <Row>
                      <Col md={7}>
                        <h5>{ticketType.name}</h5>
                        <p className="text-muted">{ticketType.description}</p>
                          <h6>
                            ${Number(ticketType.price).toFixed(2)}
                            <span className="text-muted"> + ${Number(ticketType.surcharge).toFixed(2)} surcharge</span>
                          </h6>
                          <small className="text-muted">
                            Available: {ticketType.available_quantity} | Max per person: {ticketType.max_per_person}
                          </small>
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
                              max={Math.min(ticketType.max_per_person, ticketType.available_quantity)}
                            value={bookingData.tickets.find(t => t.id === ticketType.id)?.quantity || 0}
                              onChange={(e) => handleQuantityChange(ticketType.id, e.target.value)}
                            className="mx-2 text-center"
                            style={{ width: '60px' }}
                          />
                          <Button
                            variant="outline-warning"
                            onClick={() => handleQuantityChange(ticketType.id, 1)}
                            disabled={
                                (bookingData.tickets.find(t => t.id === ticketType.id)?.quantity || 0) >= 
                                Math.min(ticketType.max_per_person, ticketType.available_quantity)
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

                {event?.paymentMethod && (
              <section className="mb-5">
                    <h2 className="mb-4">Payment Method</h2>
                <div
                      className="border rounded-3 p-3 mb-3 border-warning bg-warning bg-opacity-10"
                >
                  <div className="d-flex align-items-center">
                        {PAYMENT_ICONS[event.paymentMethod] && (
                          <span className="me-2">
                            {React.createElement(PAYMENT_ICONS[event.paymentMethod], {
                              size: 24,
                              className: 'text-warning',
                              style: { verticalAlign: 'middle' },
                            })}
                          </span>
                        )}
                        <h5 className="mb-0">{event.paymentMethod}</h5>
                  </div>
                    </div>
                  </section>
                )}

                <section className="mb-4">
                  <div className="border-top pt-3">
                    <Row>
                      <Col>
                        <h4>Total Amount:</h4>
                      </Col>
                      <Col className="text-end">
                        <h4>${Number(bookingData.totalAmount).toFixed(2)}</h4>
                      </Col>
                    </Row>
                </div>
              </section>

              <div className="d-flex justify-content-end">
                  <Button 
                    variant="warning" 
                    type="submit" 
                    disabled={!bookingData.tickets.some(ticket => ticket.quantity > 0)}
                  >
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