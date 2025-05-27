import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { BarChart, Users, Calendar, Settings, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={2} className="bg-dark min-vh-100">
          <div className="p-3">
            <h4 className="text-warning mb-4">Admin Panel</h4>
            <Nav className="flex-column gap-2">
              <Nav.Link as={Link} to="/admin" className="text-white d-flex align-items-center gap-2">
                <BarChart size={18} /> Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/users" className="text-white d-flex align-items-center gap-2">
                <Users size={18} /> Users
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/events" className="text-white d-flex align-items-center gap-2">
                <Calendar size={18} /> Events
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/settings" className="text-white d-flex align-items-center gap-2">
                <Settings size={18} /> Settings
              </Nav.Link>
              <button 
                onClick={handleLogout}
                className="btn btn-link text-white text-decoration-none d-flex align-items-center gap-2 ps-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </Nav>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={10} className="bg-light">
          <div className="p-4">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardLayout;