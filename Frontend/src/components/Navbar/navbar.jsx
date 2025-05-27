// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import Button from 'react-bootstrap/Button';
// import { Link, useNavigate } from 'react-router-dom';

// function Header() {
//   const navigate = useNavigate();
//   const isLoggedIn = localStorage.getItem('token');
//   const userType = localStorage.getItem('userType');

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userType');
//     localStorage.removeItem('user_id');
//     localStorage.removeItem('user_data');
//     navigate('/');
//     window.location.reload();
//   };

//   return (
//     <Navbar bg="dark" expand="lg" data-bs-theme="dark">
//       <Container>
//         <Navbar.Brand as={Link} to="/home" className="text-warning fw-bold">
//           EasyTicket
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="navbar-nav" />
//         <Navbar.Collapse id="navbar-nav">
//           <Nav className="mx-auto">
//             <Nav.Link as={Link} to="/home">Home</Nav.Link>
//             <Nav.Link as={Link} to="/events">Events</Nav.Link>
//             {isLoggedIn && (
//               <>
//                 {userType === 'organizer' ? (
//                   <>
//                     <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
//                     <Nav.Link as={Link} to="/addEvent">Add Event</Nav.Link>
//                   </>
//                 ) : (
//                   <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
//                 )}
//               </>
//             )}
//             <Nav.Link as={Link} to="/contactus">Contact Us</Nav.Link>
//           </Nav>
//           <div className="d-flex gap-2 align-items-center">
//             {isLoggedIn ? (
//               <Button 
//                 variant="warning" 
//                 onClick={handleLogout}
//               >
//                 Sign Out
//               </Button>
//             ) : (
//               <>
//                 <Button 
//                   variant="warning" 
//                   onClick={() => navigate('/login')}
//                 >
//                   Login
//                 </Button>
//                 <Button 
//                   variant="outline-warning"
//                   onClick={() => navigate('/signup')}
//                 >
//                   Sign up
//                 </Button>
//               </>
//             )}
//           </div>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default Header;



import React from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css'; // Import the separate CSS file

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token'); // Fallback for safety
  const userType = localStorage.getItem('userType') || 'guest'; // Fallback for safety

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_data');
    navigate('/');
    window.location.reload();
  };

  // Array of nav links for dynamic indexing (for animation delay)
    const navLinks = [
    { to: '/home', label: 'Home', ariaLabel: 'Home page' },
    { to: '/events', label: 'Events', ariaLabel: 'Events page' },
    ...(isLoggedIn
      ? userType === 'organizer'
        ? [
            { to: '/admindashboard', label: 'Dashboard', ariaLabel: 'Dashboard page' },
            { to: '/addEvent', label: 'Add Event', ariaLabel: 'Add Event page' },
            { to: '/profile', label: 'Company Profile', ariaLabel: 'Company Profile page' }, // Added profile for organizers
          ]
        : [{ to: '/profile', label: 'Profile', ariaLabel: 'Profile page' }]
      : []),
    { to: '/contactus', label: 'Contact Us', ariaLabel: 'Contact Us page' },
  ];

  return (
    <Navbar expand="lg" className="navbar" aria-label="Main navigation">
      <Container>
        <Navbar.Brand as={Link} to="/home" className="navbar-brand">
          EasyTicket
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" className="navbar-toggle" />
        <Navbar.Collapse id="navbar-nav" className="navbar-collapse">
          <Nav className="nav-container mx-auto">
            {navLinks.map((link, index) => (
              <Nav.Link
                key={link.to}
                as={Link}
                to={link.to}
                className="nav-link"
                style={{ animationDelay: `${index * 0.1}s` }}
                aria-label={link.ariaLabel}
              >
                {link.label}
              </Nav.Link>
            ))}
          </Nav>
          <div className="button-container">
            {isLoggedIn ? (
              <Button
                variant="warning"
                className="navbar-button"
                onClick={handleLogout}
                aria-label="Sign out"
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Button
                  variant="warning"
                  className="navbar-button"
                  onClick={() => navigate('/login')}
                  aria-label="Log in"
                >
                  Login
                </Button>
                <Button
                  variant="outline-warning"
                  className="navbar-button navbar-button-outline"
                  onClick={() => navigate('/signup')}
                  aria-label="Sign up"
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