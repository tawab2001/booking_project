import React from "react";
import { Form, Button, Container } from "react-bootstrap";

const FristSection = () => {
  return (
    <Container className="d-flex justify-content-center">
      <div className="p-4 bg-light rounded" style={{ width: "100%", maxWidth: "700px" }}>
        <h1 className="text-2xl font-bold text-warning text-center">Create Event</h1>
        <p className="text-muted text-center mb-4">
          Fill in the details below to create your event.
        </p>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="text-dark">Event Name</Form.Label>
            <Form.Control type="text" placeholder="e.g. Music Concert" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-dark">Event Description</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Describe your event here" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-dark">Phone Number</Form.Label>
            <Form.Control type="tel" placeholder="e.g. 01012345678" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-dark">Email</Form.Label>
            <Form.Control type="email" placeholder="example@email.com" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-dark">Address</Form.Label>
            <Form.Control type="text" placeholder="Full address" />
          </Form.Group>



          <Form.Group className="mb-3">
            <Form.Label className="text-dark">Venue Name</Form.Label>
            <Form.Control type="text" placeholder="e.g. City Hall" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-dark">Location Map</Form.Label>
            <div style={{ border: "1px solid #ccc", borderRadius: "5px", overflow: "hidden" }}>
              <iframe
                title="event-map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.4187109941093!2d31.235711!3d30.044420!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c6dc4cf8e3%3A0x6e59d49d5a66b62a!2z2KfZhNio2KfZhiDYp9mE2YXYp9mF2Kkg2YTZhNi52YTZiNmF!5e0!3m2!1sar!2seg!4v1683036794045!5m2!1sar!2seg"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-dark">Category</Form.Label>
            <Form.Select>
              <option>Select category</option>
              <option>Music</option>
              <option>Sports</option>
              <option>Conference</option>
              <option>Other</option>
            </Form.Select>
          </Form.Group>

          <div className="text-center">
            <Button variant="warning" className="text-black px-4">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default FristSection;
