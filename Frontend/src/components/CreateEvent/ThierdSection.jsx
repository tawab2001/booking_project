import React, { useState } from "react";
import { Form, Container, Row, Col, Card } from "react-bootstrap";
import styles from './EventFormStyles.module.css';

const ThierdSection = ({ data, setData }) => {
  const [errors, setErrors] = useState({});

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().slice(0, 16); // Returns YYYY-MM-DDTHH:mm
  };

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
    const today = getTodayString();
    const newErrors = { ...errors };

    // Clear previous errors
    newErrors[field] = '';

    // Validate that date is not before today
    if (value < today) {
      newErrors[field] = 'Cannot select a date before today';
      setErrors(newErrors);
      return;
    }

    // For end date, validate it's after start date
    if (field === 'endSales' && data.tickets.startSales && value < data.tickets.startSales) {
      newErrors[field] = 'End date must be after start date';
      setErrors(newErrors);
      return;
    }

    // For start date, if end date exists and becomes invalid, clear end date
    if (field === 'startSales' && data.tickets.endSales && data.tickets.endSales < value) {
      setData(prev => ({
        ...prev,
        tickets: {
          ...prev.tickets,
          endSales: ''
        }
      }));
    }

    setData(prev => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        [field]: value
      }
    }));
    setErrors(newErrors);
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
                        min={getTodayString()}
                        onChange={(e) => handleSalesDateChange('startSales', e.target.value)}
                        className={styles.input}
                        required
                      />
                      {errors.startSales && (
                        <Form.Text className={styles.errorText}>
                          {errors.startSales}
                        </Form.Text>
                      )}
                      <Form.Text className={styles.formText}>When will ticket sales begin?</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="endSalesDate">
                      <Form.Label className={styles.label}>End Sales Date</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={data.tickets.endSales || ''}
                        min={data.tickets.startSales || getTodayString()}
                        onChange={(e) => handleSalesDateChange('endSales', e.target.value)}
                        className={styles.input}
                        required
                      />
                      {errors.endSales && (
                        <Form.Text className={styles.errorText}>
                          {errors.endSales}
                        </Form.Text>
                      )}
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