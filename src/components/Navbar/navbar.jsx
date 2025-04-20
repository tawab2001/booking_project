import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

function Header() {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home" className="text-warning fw-bold">EasyTicket</Navbar.Brand>

        <Nav className="mx-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Host Events</Nav.Link>
          <Nav.Link href="#pricing">Events</Nav.Link>
          <Nav.Link href="#profile">Profile</Nav.Link>
          <Nav.Link href="#contact">Contact Us</Nav.Link>
          <Button variant="outline-light" size="sm">EN</Button>
        </Nav>

        <div className="d-flex gap-2 align-items-center">
          <Button variant="warning">Login</Button>
          <Button variant="outline-warning">Sign up</Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
