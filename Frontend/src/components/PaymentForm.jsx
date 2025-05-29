import React, { useEffect } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Container, Alert } from 'react-bootstrap';
import paymentApi from '../apiConfig/paymentApi';

function PaymentForm({ ticketId, amount, onSuccess, onError }) {
  const handlePayPalApprove = async (data, actions) => {
    try {
      // Create payment in our backend
      const createResponse = await paymentApi.createPayment({
        ticket_id: ticketId
      });

      // Execute payment
      const executeResponse = await paymentApi.executePayment({
        payment_id: createResponse.payment_id,
        paypal_payment_id: data.paymentID,
        payer_id: data.payerID
      });

      onSuccess(executeResponse.ticket);
    } catch (error) {
      onError(error.message || 'Payment failed');
    }
  };

  return (
    <Container className="py-3">
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount.toString()
                }
              }
            ]
          });
        }}
        onApprove={handlePayPalApprove}
        onError={(err) => {
          onError('PayPal payment failed. Please try again.');
        }}
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal'
        }}
      />
    </Container>
  );
}

export default PaymentForm; 