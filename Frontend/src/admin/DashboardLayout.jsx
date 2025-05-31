import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  LogOut, 
  Menu, 
  X,
  Briefcase
} from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false);
    }
  }, [location, isMobile]);
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const Logo = () => (
    <div className="sidebar-title">
      <Briefcase />
      <span>Admin Panel</span>
    </div>
  );

  const NavLinks = () => (
    <Nav className="flex-column">
      <Nav.Link 
        as={Link} 
        to="/admin" 
        className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
        onClick={() => isMobile && setShowSidebar(false)}
      >
        <LayoutDashboard />
        <span>Dashboard</span>
      </Nav.Link>
      <Nav.Link 
        as={Link} 
        to="/admin/users" 
        className={`nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`}
        onClick={() => isMobile && setShowSidebar(false)}
      >
        <Users />
        <span>Users</span>
      </Nav.Link>
      <Nav.Link 
        as={Link} 
        to="/admin/events" 
        className={`nav-link ${location.pathname === '/admin/events' ? 'active' : ''}`}
        onClick={() => isMobile && setShowSidebar(false)}
      >
        <Calendar />
        <span>Events</span>
      </Nav.Link>
    </Nav>
  );

  return (
    <div className="dashboard-wrapper">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-title">
          <Briefcase />
          <span>Admin Panel</span>
        </div>
        <button 
          className="toggle-button"
          onClick={toggleSidebar}
          aria-label="Toggle navigation"
        >
          {showSidebar ? <X /> : <Menu />}
        </button>
      </header>

        {/* Sidebar */}
      <aside className={`sidebar ${showSidebar ? 'show' : ''}`}>
        <div className="sidebar-content">
          <Logo />
          <NavLinks />
              <button 
                onClick={handleLogout}
            className="logout-button"
              >
            <LogOut />
            <span>Logout</span>
              </button>
          </div>
      </aside>

      {/* Overlay */}
      <div 
        className={`sidebar-overlay ${showSidebar ? 'show' : ''}`}
        onClick={() => setShowSidebar(false)}
      />

        {/* Main Content */}
      <div className="dashboard-container">
        <main className="main-content">
            <Outlet />
        </main>
      </div>
          </div>
  );
};

export default DashboardLayout;