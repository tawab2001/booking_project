import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/home" className="text-warning fw-bold">
          EasyTicket
        </Navbar.Brand>

        <Nav className="mx-auto">
          <Nav.Link as={Link} to="/home">Home</Nav.Link>
          <Nav.Link as={Link} to="/events">Host Events</Nav.Link>
          <Nav.Link as={Link} to="/events">Events</Nav.Link>
          <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
          <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
          <Button variant="outline-light" size="sm">EN</Button>
        </Nav>

        <div className="d-flex gap-2 align-items-center">
          <Button 
            variant="warning" 
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button 
            variant="outline-warning"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
