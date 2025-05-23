import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { Users, Calendar, Ticket, DollarSign, RefreshCw } from 'lucide-react';
import axiosInstance from '../apiConfig/axiosConfig';

// Styles object
const styles = {
  card: {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)'
    }
  },
  refreshIcon: {
    animation: 'spin 1s linear infinite'
  },
  cardIcon: {
    width: '24px',
    height: '24px'
  }
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalTickets: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axiosInstance.get('/admin/stats/');
            
            if (response?.data?.status === 'success') {
                setStats({
                    totalUsers: response.data.data?.totalUsers || 0,
                    totalEvents: response.data.data?.totalEvents || 0,
                    totalTickets: response.data.data?.totalTickets || 0,
                    revenue: response.data.data?.revenue || 0
                });
            } else {
                throw new Error('Invalid data received from server');
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            setError(error.message || 'Failed to load statistics');
            // Reset stats on error
            setStats({
                totalUsers: 0,
                totalEvents: 0,
                totalTickets: 0,
                revenue: 0
            });
        } finally {
            setLoading(false);
        }
    };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card 
      className="bg-white shadow-sm h-100" 
      style={styles.card}
    >
      <Card.Body>
        <h6 className="text-muted mb-2">{title}</h6>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <h3 className="mb-0">{value}</h3>
            )}
          </div>
          <Icon 
            className={`text-${color}`} 
            style={styles.cardIcon}
          />
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Dashboard</h2>
        <Button 
          variant="outline-primary"
          onClick={fetchStats}
          disabled={loading}
        >
          <RefreshCw 
            size={16} 
            className="me-2"
            style={loading ? styles.refreshIcon : {}}
          />
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <Alert.Heading>Error Loading Data</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}
      
      <Row className="g-4">
        <Col md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers || 0}
            icon={Users}
            color="primary"
          />
        </Col>
        
        <Col md={3}>
          <StatCard
            title="Total Events"
            value={stats.totalEvents || 0}
            icon={Calendar}
            color="success"
          />
        </Col>
        
        <Col md={3}>
          <StatCard
            title="Total Tickets"
            value={stats.totalTickets || 0}
            icon={Ticket}
            color="warning"
          />
        </Col>
        
        <Col md={3}>
          <StatCard
            title="Revenue"
            value={`$${(stats.revenue || 0).toLocaleString()}`}
            icon={DollarSign}
            color="info"
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;