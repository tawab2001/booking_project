import React, { useRef, useEffect, useState } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { uploadToCloudinary } from '../../apiConfig/cloudinaryConfig';
import styles from './EventFormStyles.module.css';

const SecondSection = ({ data, setData }) => {
  const [errors, setErrors] = useState({});

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const today = getTodayString();
    setData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        dates: prev.schedule.dates.map((date) => ({
          ...date,
          startDate: date.startDate && date.startDate < today ? '' : date.startDate,
          endDate: date.endDate && date.endDate < today ? '' : date.endDate,
        })),
      },
    }));
  }, []);

  const handleDateChange = (index, field, value) => {
    const today = getTodayString();
    const newDates = [...data.schedule.dates];
    const newErrors = { ...errors };

    const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (isValidDateFormat) {
      if (field === 'startDate' || field === 'endDate') {
        if (value < today) {
          newErrors[`${field}-${index}`] = 'Cannot select a date before today.';
          setErrors(newErrors);
          return;
        }
        if (field === 'endDate' && newDates[index].startDate && value < newDates[index].startDate) {
          newErrors[`endDate-${index}`] = 'End date cannot be before start date.';
          setErrors(newErrors);
          return;
        }
        if (field === 'startDate' && newDates[index].endDate && newDates[index].endDate < value) {
          newDates[index].endDate = value;
          newErrors[`endDate-${index}`] = '';
        }
        newErrors[`${field}-${index}`] = '';
      }
    }

    newDates[index] = { ...newDates[index], [field]: value };
    setData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        dates: newDates,
      },
    }));
    setErrors(newErrors);
  };

  const addNewDate = () => {
    const newDate = {
      id: `date-${Date.now()}`,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    };

    setData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        dates: [...prev.schedule.dates, newDate],
      },
    }));
  };

  const removeDate = (index) => {
    setData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        dates: prev.schedule.dates.filter((_, i) => i !== index),
      },
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`startDate-${index}`];
      delete newErrors[`endDate-${index}`];
      return newErrors;
    });
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

    const handleImageUpload = async (type, file) => {
      try {
        if (file) {
          const imageUrl = await uploadToCloudinary(file);
          setData((prev) => ({
            ...prev,
            schedule: {
              ...prev.schedule,
              [type]: imageUrl,
            },
          }));
        } else {
          setData((prev) => ({
            ...prev,
            schedule: {
              ...prev.schedule,
              [type]: null,
            },
          }));
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload image. Please try again.');
      }
    };

    return (
      <div className="mb-4">
        <Form.Group>
          <Form.Label className={styles.label}>{label}</Form.Label>
          <Form.Text className={styles.formText}>{description}</Form.Text>
          {!imageUrl ? (
            <div
              className={styles.imageUploader}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={32} className={styles.imageUploaderText} />
              <div>
                <span className={styles.imageUploaderHighlight}>Upload a file</span>
                <span className={styles.imageUploaderText}> or drag and drop</span>
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
            <div className={styles.imagePreview}>
              <img
                src={imageUrl}
                alt={`${type} preview`}
                className={`${styles.imagePreviewImg} ${type === 'social_image' ? styles.socialImage : styles.coverImage}`}
              />
              <Button
                className={styles.removeImageButton}
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
    <div className={styles.container}>
      <Container fluid="lg" className="py-4">
        <Card className={styles.card}>
          <Card.Body className="p-4">
            <div className={styles.sectionDivider}>
              <h2 className={styles.heading}>Schedule & Media</h2>
              <p className={styles.descriptionText}>Set your event schedule and upload media.</p>
            </div>

            {/* Dates Section */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fs-sectionTitle">Event Dates</h3>
                <Button className={styles.button} size="sm" onClick={addNewDate}>
                  <Plus size={16} className="me-1" />
                  Add Date
                </Button>
              </div>

              {data.schedule.dates.map((date, index) => (
                <Card key={date.id} className={styles.firstSectionCard}>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className={styles.label}>Start Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={date.startDate}
                            min={getTodayString()}
                            onChange={(e) => handleDateChange(index, 'startDate', e.target.value)}
                            onInvalid={(e) => e.target.setCustomValidity('Please select a date today or in the future.')}
                            onInput={(e) => e.target.setCustomValidity('')}
                            className={styles.firstSectionInput}
                            required
                          />
                          {errors[`startDate-${index}`] && (
                            <Form.Text className={styles.errorText}>{errors[`startDate-${index}`]}</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className={styles.label}>Start Time</Form.Label>
                          <Form.Control
                            type="time"
                            value={date.startTime || ''}
                            onChange={(e) => handleDateChange(index, 'startTime', e.target.value)}
                            className={styles.firstSectionInput}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className={styles.label}>End Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={date.endDate}
                            min={date.startDate || getTodayString()}
                            onChange={(e) => handleDateChange(index, 'endDate', e.target.value)}
                            onInvalid={(e) => e.target.setCustomValidity('Please select a date today or after the start date.')}
                            onInput={(e) => e.target.setCustomValidity('')}
                            className={styles.firstSectionInput}
                            required
                          />
                          {errors[`endDate-${index}`] && (
                            <Form.Text className="text-danger">{errors[`endDate-${index}`]}</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className={styles.label}>End Time</Form.Label>
                          <Form.Control
                            type="time"
                            value={date.endTime || ''}
                            onChange={(e) => handleDateChange(index, 'endTime', e.target.value)}
                            className={styles.firstSectionInput}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    {index > 0 && (
                      <Button
                        className={styles.removeButton}
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
            <div className={styles.sectionDivider}>
              <Row className="g-4">
                <Col md={6}>
                  <ImageUploader
                    type="social_image"
                    label="Social Media Image"
                    description="Used for sharing on social media (1200x630 pixels recommended)"
                  />
                </Col>
                <Col md={6}>
                  <ImageUploader
                    type="cover_image"
                    label="Event Cover Image"
                    description="Displayed at the top of your event page (1920x1080px recommended)"
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