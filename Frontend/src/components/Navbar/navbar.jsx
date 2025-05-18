import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_data');
    navigate('/');
    window.location.reload();
  };

  return (
    <Navbar bg="dark" expand="lg" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/home" className="text-warning fw-bold">
          EasyTicket
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/events">Events</Nav.Link>
            {isLoggedIn && (
              <>
                {userType === 'organizer' ? (
                  <>
                    <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/addEvent">Add Event</Nav.Link>
                  </>
                ) : (
                  <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                )}
              </>
            )}
            <Nav.Link as={Link} to="/contactus">Contact Us</Nav.Link>
          </Nav>
          <div className="d-flex gap-2 align-items-center">
            {isLoggedIn ? (
              <Button 
                variant="warning" 
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;