import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Modal, Button } from "react-bootstrap";
import FristSection from '../../components/CreateEvent/FristSection';
import SecondSection from '../../components/CreateEvent/SecondSection';
import ThierdSection from '../../components/CreateEvent/ThierdSection';
import eventApi from '../../apiConfig/eventApi';

const AddEvent = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdEventId, setCreatedEventId] = useState(null);

  const [eventData, setEventData] = useState({
    basicInfo: {
      eventName: "",
      description: "",
      phone: "",
      email: "",
      address: "",
      venue: "",
      category: "",
    },
    schedule: {
      dates: [{
        id: 'date-1',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
      }],
      social_image: null,
      cover_image: null
    },
    tickets: {
      vip: {
        enabled: false,
        name: "",
        quantity: "",
        price: ""
      },
      regular: {
        enabled: false,
        name: "",
        quantity: "",
        price: ""
      },
      startSales: "",
      endSales: "",
      paymentMethod: ""
    }
  });

  const validateSection = (section) => {
    switch (section) {
      case 1:
        const basicInfo = eventData.basicInfo;
        return (
          basicInfo.eventName?.trim() &&
          basicInfo.description?.trim() &&
          basicInfo.phone?.trim() &&
          basicInfo.email?.trim() &&
          basicInfo.address?.trim() &&
          basicInfo.venue?.trim()
        );

      case 2:
        const schedule = eventData.schedule;
        return schedule.dates.length > 0 && schedule.dates[0].startDate;

      case 3:
        const tickets = eventData.tickets;
        const hasVipTickets = tickets.vip.enabled &&
          tickets.vip.name &&
          tickets.vip.quantity &&
          tickets.vip.price;
        const hasRegularTickets = tickets.regular.enabled &&
          tickets.regular.name &&
          tickets.regular.quantity &&
          tickets.regular.price;
        return (hasVipTickets || hasRegularTickets) &&
          tickets.paymentMethod &&
          tickets.startSales &&
          tickets.endSales;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => prev + 1);
      setError(null);
    } else {
      setError('Please fill in all required fields before proceeding.');
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(prev => prev - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!validateSection(3)) {
        throw new Error('Please fill in all required information.');
      }

      const formData = new FormData();

      // Basic Info
      formData.append('title', eventData.basicInfo.eventName);
      formData.append('description', eventData.basicInfo.description);
      formData.append('phone', eventData.basicInfo.phone);
      formData.append('email', eventData.basicInfo.email);
      formData.append('address', eventData.basicInfo.address);
      formData.append('venue', eventData.basicInfo.venue);
      formData.append('category', eventData.basicInfo.category);

      // Schedule & Dates
      formData.append('dates', JSON.stringify(eventData.schedule.dates));

      // Images
      if (eventData.schedule.social_image) {
        formData.append('social_image', eventData.schedule.social_image);
      }
      if (eventData.schedule.cover_image) {
        formData.append('cover_image', eventData.schedule.cover_image);
      }

      // Ticket Information
      const ticketsData = {
        vip: eventData.tickets.vip.enabled ? {
          name: eventData.tickets.vip.name,
          quantity: parseInt(eventData.tickets.vip.quantity),
          price: parseFloat(eventData.tickets.vip.price)
        } : null,
        regular: eventData.tickets.regular.enabled ? {
          name: eventData.tickets.regular.name,
          quantity: parseInt(eventData.tickets.regular.quantity),
          price: parseFloat(eventData.tickets.regular.price)
        } : null,
      };

      formData.append('tickets', JSON.stringify(ticketsData));
      formData.append('startSales', eventData.tickets.startSales);
      formData.append('endSales', eventData.tickets.endSales);
      formData.append('paymentMethod', eventData.tickets.paymentMethod);

      localStorage.setItem("lastCreatedEvent", JSON.stringify(eventData));
      const userName = localStorage.getItem("userName"); 
      localStorage.setItem("eventCreatedBy", userName || "Unknown User");

      const response = await eventApi.createEvent(formData);
      console.log('Event created:', response);
      
      // Store event ID and show success modal
      setCreatedEventId(response.data.id);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Submit Error:', error);
      if (typeof error.response?.data === 'object') {
        const errorMessages = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
        setError(errorMessages);
      } else {
        setError(error.message || 'Failed to create event');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/home');
  };

  const handleViewEvent = () => {
    setShowSuccessModal(false);
    navigate(`/event/${createdEventId}`);
  };

  return (
    <div className="bg-dark min-vh-100 py-4">
      <div className="container">
        {error && (
          <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
            <pre className="mb-0">{error}</pre>
          </Alert>
        )}

        {currentSection === 1 && (
          <FristSection data={eventData} setData={setEventData} />
        )}
        {currentSection === 2 && (
          <SecondSection data={eventData} setData={setEventData} />
        )}
        {currentSection === 3 && (
          <ThierdSection data={eventData} setData={setEventData} />
        )}

        <div className="d-flex justify-content-between mt-4 px-4">
          {currentSection > 1 && (
            <button
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={isSubmitting}
            >
              Previous
            </button>
          )}
          {currentSection < 3 && (
            <button
              className="btn btn-warning"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next
            </button>
          )}
          {currentSection === 3 && (
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Submit'}
            </button>
          )}
        </div>

        {/* Success Modal */}
        <Modal show={showSuccessModal} onHide={handleSuccessModalClose} centered>
          <Modal.Header className="bg-success text-white">
            <Modal.Title>
              <i className="fas fa-check-circle me-2"></i>
              Event Created Successfully!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="mb-3">Your event "{eventData.basicInfo.eventName}" has been created successfully.</p>
            <p className="mb-0">What would you like to do next?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleSuccessModalClose}>
              Return to Home
            </Button>
            <Button variant="success" onClick={handleViewEvent}>
              View Event
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AddEvent;
