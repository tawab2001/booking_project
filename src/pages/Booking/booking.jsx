// import React, { useState } from 'react';
// import { Container, Card, Button, Row, Col, Form, Alert } from 'react-bootstrap';
// import { Calendar, MapPin, Clock, Users, Minus, Plus, CreditCard, Smartphone, Wallet, CheckCircle } from 'lucide-react';

// const EVENT_DATA = {
//   id: '1',
//   title: 'Summer Music Festival 2023',
//   image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
//   date: 'June 15-17, 2023',
//   time: '12:00 PM - 11:00 PM',
//   location: 'Central Park, New York',
//   description: 'Join us for the biggest music festival of the summer featuring top artists from around the world. Three days of non-stop music, food, and fun!',
//   capacity: 'Limited to 5,000 attendees'
// };

// const TICKET_TYPES = [
//   { id: 1, name: 'General Admission', price: 50, description: 'Basic entry to the event', max: 10 },
//   { id: 2, name: 'VIP Access', price: 120, description: 'Priority access with exclusive areas', max: 4 },
//   { id: 3, name: 'Premium Package', price: 200, description: 'All-inclusive experience with meet & greet', max: 2 }
// ];

// function Booking() {
//   const [bookingData, setBookingData] = useState({
//     eventId: '1',
//     tickets: TICKET_TYPES.map(type => ({
//       id: type.id,
//       name: type.name,
//       price: type.price,
//       quantity: 0
//     })),
//     totalAmount: 0,
//     customer: {
//       firstName: '',
//       lastName: '',
//       email: '',
//       phone: '',
//     },
//     paymentMethod: 'creditCard',
//     cardDetails: {
//       number: '',
//       name: '',
//       expiry: '',
//       cvv: '',
//     }
//   });
//   const [isConfirmed, setIsConfirmed] = useState(false);
//   const [bookingReference, setBookingReference] = useState('');
//   const [validated, setValidated] = useState(false);

//   const handleQuantityChange = (ticketId, change) => {
//     const updatedTickets = bookingData.tickets.map(ticket => {
//       if (ticket.id === ticketId) {
//         const ticketType = TICKET_TYPES.find(t => t.id === ticketId);
//         const max = ticketType ? ticketType.max : 10;
//         const newQuantity = Math.max(0, Math.min(ticket.quantity + change, max));
//         return { ...ticket, quantity: newQuantity };
//       }
//       return ticket;
//     });

//     const totalAmount = updatedTickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0);
//     setBookingData({ ...bookingData, tickets: updatedTickets, totalAmount });
//   };

//   const handleCustomerChange = (e) => {
//     const { name, value } = e.target;
//     setBookingData({
//       ...bookingData,
//       customer: {
//         ...bookingData.customer,
//         [name]: value
//       }
//     });
//   };

//   const handlePaymentMethodChange = (method) => {
//     setBookingData({
//       ...bookingData,
//       paymentMethod: method
//     });
//   };

//   const handleCardDetailsChange = (e) => {
//     const { name, value } = e.target;
//     setBookingData({
//       ...bookingData,
//       cardDetails: {
//         ...bookingData.cardDetails,
//         [name]: value
//       }
//     });
//   };

//   const handleConfirmBooking = (e) => {
//     e.preventDefault();
//     const form = e.currentTarget;
    
//     if (form.checkValidity() === false) {
//       e.stopPropagation();
//       setValidated(true);
//       return;
//     }

//     const reference = `BK${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
//     setBookingReference(reference);
//     setIsConfirmed(true);
//     window.scrollTo(0, 0);
//   };

//   const hasSelectedTickets = bookingData.tickets.some(ticket => ticket.quantity > 0);
//   const totalTickets = bookingData.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);

//   return (
//     <div className="min-vh-100 bg-light py-4">
//       <Container>
//         <div className="bg-white rounded-3 shadow-sm overflow-hidden">
//           <div className="bg-dark text-white p-4 text-center mb-4">
//             <h1>Event Booking</h1>
//           </div>

//           {!isConfirmed ? (
//             <Form noValidate validated={validated} onSubmit={handleConfirmBooking}>
//               <div className="p-4">
//                 {/* Payment Options Section */}
//                 <section className="mb-5">
//                   <h2 className="mb-4">Payment Options</h2>
//                   <div 
//                     className={`border rounded-3 p-3 mb-3 ${bookingData.paymentMethod === 'creditCard' ? 'border-warning bg-warning bg-opacity-10' : ''}`}
//                     onClick={() => handlePaymentMethodChange('creditCard')}
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className="d-flex align-items-center">
//                       <Form.Check
//                         type="radio"
//                         id="creditCard"
//                         name="paymentMethod"
//                         value="creditCard"
//                         checked={bookingData.paymentMethod === 'creditCard'}
//                         onChange={(e) => handlePaymentMethodChange(e.target.value)}
//                         label=""
//                       />
//                       <CreditCard size={24} className="me-2 text-warning" />
//                       <h5 className="mb-0">Credit Card</h5>
//                     </div>
                    
//                     {bookingData.paymentMethod === 'creditCard' && (
//                       <div className="mt-3 pt-3 border-top">
//                         <Row>
//                           <Col md={12} className="mb-3">
//                             <Form.Group>
//                               <Form.Label>Card Number</Form.Label>
//                               <Form.Control
//                                 type="text"
//                                 name="number"
//                                 value={bookingData.cardDetails?.number}
//                                 onChange={handleCardDetailsChange}
//                                 placeholder="1234 5678 9012 3456"
//                                 required
//                               />
//                               <Form.Control.Feedback type="invalid">
//                                 Please provide a valid card number.
//                               </Form.Control.Feedback>
//                             </Form.Group>
//                           </Col>
//                         </Row>
//                       </div>
//                     )}
//                   </div>
//                 </section>
//               </div>
//             </Form>
//           ) : (
//             <div className="text-center p-4">
//               <div className="mb-4">
//                 <CheckCircle size={80} className="text-warning mb-3" />
//                 <h2>Booking Confirmed!</h2>
//                 <p className="lead">Your reservation has been successfully processed.</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </Container>
//     </div>
//   );
// }

// export default Booking;

import React, { useState } from 'react';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';
import { CreditCard, CheckCircle } from 'lucide-react';

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
    customer: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    paymentMethod: 'creditCard',
    cardDetails: {
      number: '',
      name: '',
      expiry: '',
      cvv: '',
    }
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
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

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      customer: {
        ...bookingData.customer,
        [name]: value
      }
    });
  };

  const handlePaymentMethodChange = (method) => {
    setBookingData({
      ...bookingData,
      paymentMethod: method
    });
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      cardDetails: {
        ...bookingData.cardDetails,
        [name]: value
      }
    });
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const reference = `BK${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
    setBookingReference(reference);
    setIsConfirmed(true);
    window.scrollTo(0, 0);
  };

  const hasSelectedTickets = bookingData.tickets.some(ticket => ticket.quantity > 0);

  return (
    <div className="min-vh-100 bg-light py-4">
      <Container>
        <div className="bg-white rounded-3 shadow-sm overflow-hidden">
          <div className="bg-dark text-white p-4 text-center mb-4">
            <h1>Event Booking</h1>
          </div>

          {!isConfirmed ? (
            <Form noValidate validated={validated} onSubmit={handleConfirmBooking}>
              <div className="p-4">
                {/* Ticket Selection Section */}
                <section className="mb-5">
                  <h2 className="mb-4">Select Tickets</h2>
                  {TICKET_TYPES.map((ticketType) => (
                    <div key={ticketType.id} className="border rounded-3 p-3 mb-3">
                      <Row>
                        <Col md={7}>
                          <h5>{ticketType.name}</h5>
                          <p className="text-muted">{ticketType.description}</p>
                          <h6>${ticketType.price.toFixed(2)}</h6>
                        </Col>
                        <Col md={5} className="d-flex align-items-center justify-content-end">
                          <div className="d-flex align-items-center">
                            <Button
                              variant="light"
                              size="sm"
                              onClick={() => handleQuantityChange(ticketType.id, -1)}
                              disabled={!bookingData.tickets.find(t => t.id === ticketType.id)?.quantity}
                              className="rounded-circle"
                            >
                              -
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
                              variant="light"
                              size="sm"
                              onClick={() => handleQuantityChange(ticketType.id, 1)}
                              disabled={
                                (bookingData.tickets.find(t => t.id === ticketType.id)?.quantity || 0) >= ticketType.max
                              }
                              className="rounded-circle"
                            >
                              +
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
          ) : (
            <div className="text-center p-4">
              <div className="mb-4">
                <CheckCircle size={80} className="text-warning mb-3" />
                <h2>Booking Confirmed!</h2>
                <p>Your booking reference is: {bookingReference}</p>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Booking;