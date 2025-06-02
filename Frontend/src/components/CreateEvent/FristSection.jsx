const FirstSection = ({ data, setData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [name]: value,
      },
    }));
  };

  return (
    <div className={styles.container}>
      <Container fluid="lg" className="py-4">
        <Row className="g-4">
          <Col lg={12}>
            <Card className={styles.firstSectionCard}>
              <Card.Body className="p-4">
                <div className={styles.sectionDivider}>
                  <h2 className={styles.heading}>Create Event</h2>
                  <p className={styles.descriptionText}>
                    Fill in the details below to create your event.
                  </p>
                </div>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>Event Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="eventName"
                      value={data.basicInfo.eventName || ''}
                      onChange={handleChange}
                      placeholder="e.g. Music Concert"
                      className={styles.firstSectionInput}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>Event Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={data.basicInfo.description || ''}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe your event here"
                      className={styles.firstSectionInput}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={data.basicInfo.phone || ''}
                      onChange={handleChange}
                      placeholder="e.g. 01012345678"
                      className={styles.firstSectionInput}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={data.basicInfo.email || ''}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className={styles.firstSectionInput}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={data.basicInfo.address || ''}
                      onChange={handleChange}
                      placeholder="Full address"
                      className={styles.firstSectionInput}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>Venue Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="venue"
                      value={data.basicInfo.venue || ''}
                      onChange={handleChange}
                      placeholder="Venue or location name"
                      className={styles.firstSectionInput}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={data.basicInfo.category || ''}
                      onChange={handleChange}
                      className={styles.firstSectionInput}
                    >
                      <option value="">Select Category</option>
                      <option value="music">Music</option>
                      <option value="art">Art</option>
                      <option value="sports">Sports</option>
                      <option value="technology">Technology</option>
                      <option value="education">Education</option>
                      <option value="business">Business</option>
                      <option value="health">Health</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FirstSection;