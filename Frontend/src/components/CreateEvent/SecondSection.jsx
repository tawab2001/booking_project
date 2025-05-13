import React, { useState, useRef } from 'react';
import { Calendar, Clock, Plus, Trash2, Image, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

function SecondSection() {
  const navigate = useNavigate(); 
  const [dates, setDates] = useState([
    {
      id: 'date-1',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    },
  ]);

  const [images, setImages] = useState({
    socialImage: '',
    coverImage: '',
  });

  const [formData, setFormData] = useState(null);
  
  const handleDateChange = (index, field, value) => {
    const newDates = [...dates];
    newDates[index] = { ...newDates[index], [field]: value };
    setDates(newDates);
  };

  const addNewDate = () => {
    const newDate = {
      id: `date-${Date.now()}`,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    };
    setDates([...dates, newDate]);
  };

  const removeDate = (index) => {
    const newDates = [...dates];
    newDates.splice(index, 1);
    setDates(newDates);
  };

  const handleImageChange = (type, url) => {
    setImages(prev => ({
      ...prev,
      [type]: url,
    }));
  };

  const handleSaveForm = () => {
    const data = {
      dates,
      ...images,
    };
    setFormData(data);
    console.log('Form data saved:', data);
  };

  const ImageUploader = ({ type, imageUrl, onChange, label, description }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    };

    const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    };

    const handleFile = (file) => {
      const localUrl = URL.createObjectURL(file);
      onChange(localUrl);
    };

    const triggerFileInput = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const dragAreaStyle = {
      border: `2px dashed ${isDragging ? '#ffc107' : '#dee2e6'}`,
      borderRadius: '0.375rem',
      padding: '2rem',
      backgroundColor: isDragging ? 'rgba(255, 193, 7, 0.05)' : '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    };

    return (
      <div className="mb-4">
        <Form.Group>
          <Form.Label className="fw-medium">{label}</Form.Label>
          <Form.Text className="text-muted d-block mb-2">
            {description}
          </Form.Text>

          {!imageUrl ? (
            <div
              style={dragAreaStyle}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <div className="text-center">
                <Upload className="mx-auto" style={{ width: '3rem', height: '3rem', color: '#6c757d' }} />
                <div className="mt-2 d-flex justify-content-center">
                  <div className="text-warning fw-medium">
                    Upload a file
                    <Form.Control
                      id={`${type}-image`}
                      name={`${type}-image`}
                      type="file"
                      className="d-none"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                  <span className="ms-1">or drag and drop</span>
                </div>
                <p className="text-muted small">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          ) : (
            <div className="position-relative">
              <div style={{ overflow: 'hidden', borderRadius: '0.375rem' }}>
                <img
                  src={imageUrl}
                  alt={`${type} preview`}
                  style={{
                    height: type === 'coverImage' ? '15rem' : '10rem',
                    objectFit: type === 'coverImage' ? 'cover' : 'contain',
                    width: '100%',
                    borderRadius: '0.375rem'
                  }}
                  className="img-fluid"
                />
              </div>
              <Button 
                variant="light" 
                size="sm" 
                style={{
                  position: 'absolute',
                  top: type === 'coverImage' ? '1rem' : '0.5rem',
                  right: type === 'coverImage' ? '1rem' : '0.5rem',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  padding: '0.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}
                onClick={() => onChange('')}
                className="d-flex align-items-center justify-content-center p-1"
              >
                <X size={18} />
              </Button>
              <Button
                variant="light"
                size="sm"
                className="position-absolute bottom-0 end-0 m-2 d-flex align-items-center"
                onClick={triggerFileInput}
              >
                <Image size={16} className="me-1" />
                <span>Change</span>
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
        <Row className="g-4">
          <Col lg={8}>
            <Card className="bg-black text-white border-secondary">
              <Card.Body className="p-4">
                <div className="border-bottom border-secondary pb-4 mb-4">
                  <h2 className="fw-semibold fs-4 mb-1">Event Schedule & Images</h2>
                  <p className="text-secondary mb-0">
                    Set your event dates and upload promotional images.
                  </p>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="fs-5 fw-medium text-white">Event Dates</h3>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={addNewDate}
                      className="d-flex align-items-center"
                    >
                      <Plus size={16} className="me-1" />
                      Add Date
                    </Button>
                  </div>

                  {dates.map((date, index) => (
                    <Card 
                      key={date.id} 
                      className={`mb-3 bg-black ${index === 0 ? 'border-warning' : 'border-secondary'}`}
                    >
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4 className="fs-6 fw-medium mb-0 text-white">
                            {index === 0 ? 'Main Event Date' : `Additional Date ${index}`}
                          </h4>
                          {index > 0 && (
                            <Button
                              variant="link"
                              className="text-danger p-0"
                              onClick={() => removeDate(index)}
                            >
                              <Trash2 size={18} />
                            </Button>
                          )}
                        </div>

                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="text-white">Start Date</Form.Label>
                              <div className="position-relative">
                                <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                                  <Calendar size={18} className="text-secondary" />
                                </div>
                                <Form.Control
                                  type="date"
                                  value={date.startDate}
                                  onChange={(e) => handleDateChange(index, 'startDate', e.target.value)}
                                  className="bg-black text-white border-secondary ps-5"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="text-white">Start Time</Form.Label>
                              <div className="position-relative">
                                <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                                  <Clock size={18} className="text-secondary" />
                                </div>
                                <Form.Control
                                  type="time"
                                  value={date.startTime}
                                  onChange={(e) => handleDateChange(index, 'startTime', e.target.value)}
                                  className="bg-black text-white border-secondary ps-5"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="text-white">End Date</Form.Label>
                              <div className="position-relative">
                                <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                                  <Calendar size={18} className="text-secondary" />
                                </div>
                                <Form.Control
                                  type="date"
                                  value={date.endDate}
                                  onChange={(e) => handleDateChange(index, 'endDate', e.target.value)}
                                  className="bg-black text-white border-secondary ps-5"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="text-white">End Time</Form.Label>
                              <div className="position-relative">
                                <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                                  <Clock size={18} className="text-secondary" />
                                </div>
                                <Form.Control
                                  type="time"
                                  value={date.endTime}
                                  onChange={(e) => handleDateChange(index, 'endTime', e.target.value)}
                                  className="bg-black text-white border-secondary ps-5"
                                />
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>

                <hr className="border-secondary my-4" />

                <Row className="g-4">
                  <Col lg={6}>
                    <ImageUploader
                      type="socialImage"
                      imageUrl={images.socialImage}
                      onChange={(url) => handleImageChange('socialImage', url)}
                      label="Social Media Image"
                      description="This image will be used when sharing on social media (1200 × 630 pixels recommended)."
                    />
                  </Col>
                  
                  <Col lg={6}>
                    <ImageUploader
                      type="coverImage"
                      imageUrl={images.coverImage}
                      onChange={(url) => handleImageChange('coverImage', url)}
                      label="Event Cover Image"
                      description="This image will appear as the header of your event page (1920 × 1080 pixels recommended)."
                    />
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4">
                  <Button
                    variant="warning"
                    onClick={handleSaveForm}
                  >
                    Save Schedule & Images
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="bg-black text-white border-secondary">
              <Card.Body className="p-4">
                <h2 className="fs-4 fw-semibold mb-3">Preview</h2>
                
                {formData ? (
                  <div>
                    <div className="mb-4">
                      <h3 className="fs-6 text-secondary mb-2">Event Dates</h3>
                      <div className="border-top border-secondary">
                        {formData.dates.map((date) => (
                          <div key={date.id} className="py-3 border-bottom border-secondary">
                            <p className="fw-medium mb-1 text-white">
                              {date.startDate} • {date.startTime}
                            </p>
                            <p className="text-secondary mb-0 small">
                              to {date.endDate} • {date.endTime}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {formData.coverImage && (
                      <div className="mb-4">
                        <h3 className="fs-6 text-secondary mb-2">Cover Image</h3>
                        <div className="rounded overflow-hidden" style={{ height: '8rem' }}>
                          <img 
                            src={formData.coverImage} 
                            alt="Cover preview" 
                            className="img-fluid w-100 h-100"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {formData.socialImage && (
                      <div>
                        <h3 className="fs-6 text-secondary mb-2">Social Image</h3>
                        <div className="rounded overflow-hidden" style={{ height: '6rem' }}>
                          <img 
                            src={formData.socialImage} 
                            alt="Social preview" 
                            className="img-fluid w-100 h-100"
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-secondary fst-italic">
                    Fill out the form to see a preview of your event here.
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="d-flex justify-content-end mt-4">
          <Button
            variant="warning"
            size="lg"
            onClick={() => navigate('/thirdsection')} 
          >
            Next Step
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default SecondSection;