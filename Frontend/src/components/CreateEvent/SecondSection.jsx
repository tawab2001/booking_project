import React, { useRef } from 'react';
import { Calendar, Clock, Plus, Trash2, Image, X, Upload } from 'lucide-react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { uploadToCloudinary } from '../../apiConfig/cloudinaryConfig';

const SecondSection = ({ data, setData }) => {
  const handleImageUpload = async (type, file) => {
    try {
      if (file) {
        // رفع الصورة إلى Cloudinary
        const imageUrl = await uploadToCloudinary(file);
        setData(prev => ({
          ...prev,
          schedule: {
            ...prev.schedule,
            [type]: imageUrl
          }
        }));
      } else {
        // إزالة الصورة
        setData(prev => ({
          ...prev,
          schedule: {
            ...prev.schedule,
            [type]: null
          }
        }));
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleDateChange = (index, field, value) => {
    const newDates = [...data.schedule.dates];
    newDates[index] = { ...newDates[index], [field]: value };
    
    setData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        dates: newDates
      }
    }));
  };

  const addNewDate = () => {
    const newDate = {
      id: `date-${Date.now()}`,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };

    setData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        dates: [...prev.schedule.dates, newDate]
      }
    }));
  };

  const removeDate = (index) => {
    setData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        dates: prev.schedule.dates.filter((_, i) => i !== index)
      }
    }));
  };

  const ImageUploader = ({ type, label, description }) => {
    const fileInputRef = useRef(null);
    const imageUrl = data.schedule[type];

    const handleDrop = async (e) => {
      e.preventDefault();
      if (e.dataTransfer.files?.[0]) {
        await handleImageUpload(type, e.dataTransfer.files[0]);
      }
    };

    const handleFileChange = async (e) => {
      if (e.target.files?.[0]) {
        await handleImageUpload(type, e.target.files[0]);
      }
    };

    return (
      <div className="mb-4">
        <Form.Group>
          <Form.Label className="text-white">{label}</Form.Label>
          <Form.Text className="text-muted d-block mb-2">
            {description}
          </Form.Text>

          {!imageUrl ? (
            <div
              className="border border-secondary rounded p-4 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
            >
              <Upload className="mx-auto mb-2" style={{ width: '2rem', height: '2rem', color: '#6c757d' }} />
              <div>
                <span className="text-warning">Upload a file</span>
                <span className="text-muted"> or drag and drop</span>
                <Form.Control
                  type="file"
                  className="d-none"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          ) : (
            <div className="position-relative">
              <img
                src={imageUrl} // الآن نستخدم URL من Cloudinary مباشرة
                alt={`${type} preview`}
                className="img-fluid rounded"
                style={{
                  height: type === 'coverImage' ? '15rem' : '10rem',
                  width: '100%',
                  objectFit: type === 'coverImage' ? 'cover' : 'contain'
                }}
              />
              <Button 
                variant="light"
                size="sm"
                className="position-absolute top-0 end-0 m-2"
                onClick={() => handleImageUpload(type, null)}
              >
                <X size={18} />
              </Button>
            </div>
          )}
        </Form.Group>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
      <Container fluid="lg" className="py-4">
        <Card className="bg-black text-white border-secondary">
          <Card.Body className="p-4">
            <div className="border-bottom border-secondary pb-4 mb-4">
              <h2 className="fw-semibold fs-4 mb-1">Event Schedule & Images</h2>
              <p className="text-secondary mb-0">Set your event dates and upload promotional images.</p>
            </div>

            {/* Dates Section */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fs-5 text-white">Event Dates</h3>
                <Button variant="warning" size="sm" onClick={addNewDate}>
                  <Plus size={16} className="me-1" />
                  Add Date
                </Button>
              </div>

              {data.schedule.dates.map((date, index) => (
                <Card key={date.id} className="mb-3 bg-black border-secondary">
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="text-white">Start Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={date.startDate}
                            onChange={(e) => handleDateChange(index, 'startDate', e.target.value)}
                            className="bg-black text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="text-white">Start Time</Form.Label>
                          <Form.Control
                            type="time"
                            value={date.startTime}
                            onChange={(e) => handleDateChange(index, 'startTime', e.target.value)}
                            className="bg-black text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="text-white">End Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={date.endDate}
                            onChange={(e) => handleDateChange(index, 'endDate', e.target.value)}
                            className="bg-black text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="text-white">End Time</Form.Label>
                          <Form.Control
                            type="time"
                            value={date.endTime}
                            onChange={(e) => handleDateChange(index, 'endTime', e.target.value)}
                            className="bg-black text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    {index > 0 && (
                      <Button
                        variant="link"
                        className="text-danger mt-2 p-0"
                        onClick={() => removeDate(index)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Images Section */}
            <div className="border-top border-secondary pt-4">
              <Row className="g-4">
                <Col md={6}>
                  <ImageUploader
                    type="social_image"
                    label="Social Media Image"
                    description="Used for sharing on social media (1200×630 pixels recommended)"
                  />
                </Col>
                <Col md={6}>
                  <ImageUploader
                    type="cover_image"
                    label="Event Cover Image"
                    description="Displayed at the top of your event page (1920×1080 pixels recommended)"
                  />
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default SecondSection;