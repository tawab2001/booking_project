// import React from "react";
// import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

// const ThierdSection = ({ data, setData }) => {
//   const handleTicketChange = (type, field, value) => {
//     setData(prev => ({
//       ...prev,
//       tickets: {
//         ...prev.tickets,
//         [type]: {
//           ...prev.tickets[type],
//           [field]: value
//         }
//       }
//     }));
//   };

//   const toggleTicketType = (type) => {
//     setData(prev => ({
//       ...prev,
//       tickets: {
//         ...prev.tickets,
//         [type]: {
//           ...prev.tickets[type],
//           enabled: !prev.tickets[type].enabled
//         }
//       }
//     }));
//   };

//   const handleSalesDateChange = (field, value) => {
//     setData(prev => ({
//       ...prev,
//       tickets: {
//         ...prev.tickets,
//         [field]: value
//       }
//     }));
//   };

//   const handlePaymentMethodChange = (value) => {
//     setData(prev => ({
//       ...prev,
//       tickets: {
//         ...prev.tickets,
//         paymentMethod: value
//       }
//     }));
//   };

//   return (
//     <div style={{ backgroundColor: "#000", minHeight: "100vh" }}>
//       <Container fluid="lg" className="py-4">
//         <Card className="bg-black text-white border-secondary">
//           <Card.Body className="p-4">
//             <h2 className="fw-semibold fs-4 mb-4">Ticket Information</h2>

//             {/* Sales Period */}
//             <Card className="bg-dark border-warning mb-4">
//               <Card.Body>
//                 <h5 className="mb-3">Sales Period</h5>
//                 <Row className="g-3">
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Start Sales Date</Form.Label>
//                       <Form.Control
//                         type="datetime-local"
//                         value={data.tickets.startSales}
//                         onChange={(e) => handleSalesDateChange('startSales', e.target.value)}
//                         className="bg-black text-white border-secondary"
//                       />
//                       <Form.Text className="text-muted">
//                         When will ticket sales begin?
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>End Sales Date</Form.Label>
//                       <Form.Control
//                         type="datetime-local"
//                         value={data.tickets.endSales}
//                         onChange={(e) => handleSalesDateChange('endSales', e.target.value)}
//                         className="bg-black text-white border-secondary"
//                       />
//                       <Form.Text className="text-muted">
//                         When will ticket sales end?
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>
            
//             {/* VIP Tickets */}
//             <div className="mb-4">
//               <Form.Check
//                 type="switch"
//                 id="vip-switch"
//                 label="VIP Tickets"
//                 checked={data.tickets.vip.enabled}
//                 onChange={() => toggleTicketType('vip')}
//                 className="mb-3"
//               />
              
//               {data.tickets.vip.enabled && (
//                 <Card className="bg-dark border-warning mb-4">
//                   <Card.Body>
//                     <Row className="g-3">
//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label>Ticket Name</Form.Label>
//                           <Form.Control
//                             type="text"
//                             value={data.tickets.vip.name}
//                             onChange={(e) => handleTicketChange('vip', 'name', e.target.value)}
//                             className="bg-black text-white border-secondary"
//                             placeholder="e.g. VIP Access Pass"
//                           />
//                           <Form.Text className="text-muted">
//                             Give your VIP ticket a descriptive name
//                           </Form.Text>
//                         </Form.Group>
//                       </Col>
//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label>Quantity</Form.Label>
//                           <Form.Control
//                             type="number"
//                             value={data.tickets.vip.quantity}
//                             onChange={(e) => handleTicketChange('vip', 'quantity', e.target.value)}
//                             className="bg-black text-white border-secondary"
//                             placeholder="e.g. 100"
//                             min="1"
//                           />
//                           <Form.Text className="text-muted">
//                             Number of VIP tickets available
//                           </Form.Text>
//                         </Form.Group>
//                       </Col>
//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label>Price ($)</Form.Label>
//                           <Form.Control
//                             type="number"
//                             value={data.tickets.vip.price}
//                             onChange={(e) => handleTicketChange('vip', 'price', e.target.value)}
//                             className="bg-black text-white border-secondary"
//                             placeholder="e.g. 199.99"
//                             min="0"
//                             step="0.01"
//                           />
//                           <Form.Text className="text-muted">
//                             Price per VIP ticket
//                           </Form.Text>
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               )}
//             </div>

//             {/* Regular Tickets */}
//             <div className="mb-4">
//               <Form.Check
//                 type="switch"
//                 id="regular-switch"
//                 label="Regular Tickets"
//                 checked={data.tickets.regular.enabled}
//                 onChange={() => toggleTicketType('regular')}
//                 className="mb-3"
//               />
              
//               {data.tickets.regular.enabled && (
//                 <Card className="bg-dark border-warning">
//                   <Card.Body>
//                     <Row className="g-3">
//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label>Ticket Name</Form.Label>
//                           <Form.Control
//                             type="text"
//                             value={data.tickets.regular.name}
//                             onChange={(e) => handleTicketChange('regular', 'name', e.target.value)}
//                             className="bg-black text-white border-secondary"
//                             placeholder="e.g. General Admission"
//                           />
//                           <Form.Text className="text-muted">
//                             Give your regular ticket a descriptive name
//                           </Form.Text>
//                         </Form.Group>
//                       </Col>
//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label>Quantity</Form.Label>
//                           <Form.Control
//                             type="number"
//                             value={data.tickets.regular.quantity}
//                             onChange={(e) => handleTicketChange('regular', 'quantity', e.target.value)}
//                             className="bg-black text-white border-secondary"
//                             placeholder="e.g. 500"
//                             min="1"
//                           />
//                           <Form.Text className="text-muted">
//                             Number of regular tickets available
//                           </Form.Text>
//                         </Form.Group>
//                       </Col>
//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label>Price ($)</Form.Label>
//                           <Form.Control
//                             type="number"
//                             value={data.tickets.regular.price}
//                             onChange={(e) => handleTicketChange('regular', 'price', e.target.value)}
//                             className="bg-black text-white border-secondary"
//                             placeholder="e.g. 49.99"
//                             min="0"
//                             step="0.01"
//                           />
//                           <Form.Text className="text-muted">
//                             Price per regular ticket
//                           </Form.Text>
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               )}
//             </div>

//             {/* Payment Method */}
//             <Form.Group className="mb-4">
//               <Form.Label>Payment Method</Form.Label>
//               <Form.Select
//                 value={data.tickets.paymentMethod}
//                 onChange={(e) => handlePaymentMethodChange(e.target.value)}
//                 className="bg-black text-white border-secondary"
//               >
//                 <option value="">Select Payment Method</option>
//                 <option value="Credit Card">Credit Card</option>
//                 <option value="PayPal">PayPal</option>
//                 <option value="Cash">Cash</option>
//               </Form.Select>
//               <Form.Text className="text-muted">
//                 Choose how customers will pay for tickets
//               </Form.Text>
//             </Form.Group>

//             {!data.tickets.vip.enabled && !data.tickets.regular.enabled && (
//               <div className="text-warning mt-3">
//                 Please add at least one ticket type
//               </div>
//             )}
//           </Card.Body>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default ThierdSection;


import React from 'react';
import { Form, Container, Row, Col, Card } from 'react-bootstrap';
import styles from './EventFormStyles.module.css';

const ThierdSection = ({ data, setData }) => {
  const handleTicketChange = (type, field, value) => {
    setData((prev) => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        [type]: {
          ...prev.tickets[type],
          [field]: value,
        },
      },
    }));
  };

  const toggleTicketType = (type) => {
    setData((prev) => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        [type]: {
          ...prev.tickets[type],
          enabled: !prev.tickets[type].enabled,
        },
      },
    }));
  };

  const handleSalesDateChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        [field]: value,
      },
    }));
  };

  const handlePaymentMethodChange = (value) => {
    setData((prev) => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        paymentMethod: value,
      },
    }));
  };

  return (
    <div className={styles.container}>
      <Container fluid="lg" className="py-5">
        <Card className={styles.card}>
          <Card.Body>
            <h2 className={styles.heading}>Ticket Details</h2>

            {/* Sales Period */}
            <Card className={styles.subCard}>
              <Card.Body>
                <h4 className={styles.subHeading}>Sales Period</h4>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="startSalesDate">
                      <Form.Label className={styles.label}>Start Sales Date</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={data.tickets.startSales || ''}
                        onChange={(e) => handleSalesDateChange('startSales', e.target.value)}
                        className={styles.input}
                        required
                      />
                      <Form.Text className={styles.formText}>When will ticket sales begin?</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="endSalesDate">
                      <Form.Label className={styles.label}>End Sales Date</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={data.tickets.endSales || ''}
                        onChange={(e) => handleSalesDateChange('endSales', e.target.value)}
                        className={styles.input}
                        required
                      />
                      <Form.Text className={styles.formText}>When will ticket sales end?</Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* VIP Tickets */}
            <div className="mb-4">
              <Form.Check
                type="switch"
                id="vip-switch"
                label="VIP Tickets"
                checked={data.tickets.vip.enabled || false}
                onChange={() => toggleTicketType('vip')}
                className={styles.switch}
              />
              {data.tickets.vip.enabled && (
                <Card className={styles.subCard}>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group controlId="vipName">
                          <Form.Label className={styles.label}>Ticket Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={data.tickets.vip.name || ''}
                            onChange={(e) => handleTicketChange('vip', 'name', e.target.value)}
                            className={styles.input}
                            placeholder="e.g. VIP Access Pass"
                            required
                          />
                          <Form.Text className={styles.formText}>
                            Give your VIP ticket a descriptive name
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group controlId="vipQuantity">
                          <Form.Label className={styles.label}>Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            value={data.tickets.vip.quantity || ''}
                            onChange={(e) => handleTicketChange('vip', 'quantity', parseInt(e.target.value))}
                            className={styles.input}
                            placeholder="e.g. 100"
                            min="1"
                            required
                          />
                          <Form.Text className={styles.formText}>Number of VIP tickets available</Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group controlId="vipPrice">
                          <Form.Label className={styles.label}>Price ($)</Form.Label>
                          <Form.Control
                            type="number"
                            value={data.tickets.vip.price || ''}
                            onChange={(e) => handleTicketChange('vip', 'price', parseFloat(e.target.value))}
                            className={styles.input}
                            placeholder="e.g. 199.99"
                            min="0"
                            step="0.01"
                            required
                          />
                          <Form.Text className={styles.formText}>Price per VIP ticket</Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </div>

            {/* Regular Tickets */}
            <div className="mb-4">
              <Form.Check
                type="switch"
                id="regular-switch"
                label="Regular Tickets"
                checked={data.tickets.regular.enabled || false}
                onChange={() => toggleTicketType('regular')}
                className={styles.switch}
              />
              {data.tickets.regular.enabled && (
                <Card className={styles.subCard}>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group controlId="regularName">
                          <Form.Label className={styles.label}>Ticket Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={data.tickets.regular.name || ''}
                            onChange={(e) => handleTicketChange('regular', 'name', e.target.value)}
                            className={styles.input}
                            placeholder="e.g. General Admission"
                            required
                          />
                          <Form.Text className={styles.formText}>
                            Give your regular ticket a descriptive name
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group controlId="regularQuantity">
                          <Form.Label className={styles.label}>Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            value={data.tickets.regular.quantity || ''}
                            onChange={(e) => handleTicketChange('regular', 'quantity', parseInt(e.target.value))}
                            className={styles.input}
                            placeholder="e.g. 500"
                            min="1"
                            required
                          />
                          <Form.Text className={styles.formText}>
                            Number of regular tickets available
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group controlId="regularPrice">
                          <Form.Label className={styles.label}>Price ($)</Form.Label>
                          <Form.Control
                            type="number"
                            value={data.tickets.regular.price || ''}
                            onChange={(e) => handleTicketChange('regular', 'price', parseFloat(e.target.value))}
                            className={styles.input}
                            placeholder="e.g. 49.99"
                            min="0"
                            step="0.01"
                            required
                          />
                          <Form.Text className={styles.formText}>Price per regular ticket</Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </div>

            {/* Payment Method */}
            <Form.Group controlId="paymentMethod" className="mb-4">
              <Form.Label className={styles.label}>Payment Method</Form.Label>
              <Form.Select
                value={data.tickets.paymentMethod || ''}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Select Payment Method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Cash">Cash</option>
              </Form.Select>
              <Form.Text className={styles.formText}>Choose how customers will pay for tickets</Form.Text>
            </Form.Group>

            {!data.tickets.vip.enabled && !data.tickets.regular.enabled && (
              <div className={styles.warningText}>Please enable at least one ticket type (VIP or Regular)</div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ThierdSection;