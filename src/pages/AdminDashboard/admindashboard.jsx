import React from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";

const AdminDashboard = () => {
  const events = [
    { id: 1, name: "مهرجان الموسيقى", ticketsSold: 80, date: "25 مايو 2025" },
    { id: 2, name: "مباراة كرة قدم", ticketsSold: 45, date: "10 يونيو 2025" },
    { id: 3, name: "مؤتمر التقنية", ticketsSold: 120, date: "5 يوليو 2025" },
  ];

  return (
    <Container fluid className="py-5" style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <h2 className="text-warning mb-4 text-center">لوحة تحكم الأدمن</h2>

      <Row className="mb-4">
        <Col md={4} sm={12}>
          <Card bg="dark" text="white" className="shadow text-center">
            <Card.Body>
              <Card.Title className="text-warning">عدد الأحداث</Card.Title>
              <Card.Text style={{ fontSize: "2rem" }}>3</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="dark" text="white" className="shadow text-center">
            <Card.Body>
              <Card.Title className="text-warning">إجمالي التذاكر المباعة</Card.Title>
              <Card.Text style={{ fontSize: "2rem" }}>245</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="dark" text="white" className="shadow text-center">
            <Card.Body>
              <Card.Title className="text-warning">مبيعات اليوم</Card.Title>
              <Card.Text style={{ fontSize: "2rem" }}>25</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card bg="dark" text="white" className="shadow">
        <Card.Body>
          <Card.Title className="text-warning mb-3">إدارة الأحداث</Card.Title>
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>اسم الحدث</th>
                <th>التاريخ</th>
                <th>التذاكر المباعة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.name}</td>
                  <td>{event.date}</td>
                  <td>{event.ticketsSold}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2">
                      تعديل
                    </Button>
                    <Button variant="outline-light" size="sm">
                      حذف
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;