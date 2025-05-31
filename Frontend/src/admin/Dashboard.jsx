import React, { useState, useEffect, memo } from 'react';
import { Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { Users, Calendar, Ticket, DollarSign, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axiosInstance from '../apiConfig/axiosConfig';
import './dashboard.css'; // Updated CSS file

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GrowthIndicator = memo(({ currentValue, previousValue, label }) => {
  const growth = previousValue ? ((currentValue - previousValue) / previousValue) * 100 : 0;
  const isPositive = growth >= 0;

  return (
    <div className={`growth-indicator ${isPositive ? 'growth-positive' : 'growth-negative'}`}>
      <small>{label}</small>
      <div className="d-flex align-items-center gap-2">
        <span className="h6 mb-0">{Math.abs(growth).toFixed(1)}%</span>
        {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
      </div>
    </div>
  );
});

const StatCard = memo(({ title, value, icon: Icon, color, growth }) => (
  <Card className="stats-card">
    <Card.Body className="d-flex flex-column justify-content-between">
      <div className="d-flex align-items-center justify-content-between">
        <h6 className="text-muted mb-0">{title}</h6>
        <div className={`card-icon-wrapper ${color}`}>
          <Icon size={24} />
        </div>
      </div>
      <h3 className="mt-2 mb-3">{value}</h3>
      {growth && <GrowthIndicator {...growth} label="vs last period" />}
    </Card.Body>
  </Card>
));

const Dashboard = () => {
  const [stats, setStats] = useState({
    current: { totalUsers: 0, totalEvents: 0, totalTickets: 0, revenue: 0 },
    previous: { totalUsers: 0, totalEvents: 0, totalTickets: 0, revenue: 0 },
    monthly: { labels: [], users: [], events: [], tickets: [], revenue: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30d'); // New state for period selection

  const fetchStats = async (selectedPeriod = '30d') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/admin/stats/?period=${selectedPeriod}`);
      
      if (response?.data?.status === 'success') {
        // Ensure data is properly formatted
        const formattedData = {
          current: {
            totalUsers: parseInt(response.data.data.current.totalUsers) || 0,
            totalEvents: parseInt(response.data.data.current.totalEvents) || 0,
            totalTickets: parseInt(response.data.data.current.totalTickets) || 0,
            revenue: parseFloat(response.data.data.current.revenue) || 0
          },
          previous: {
            totalUsers: parseInt(response.data.data.previous.totalUsers) || 0,
            totalEvents: parseInt(response.data.data.previous.totalEvents) || 0,
            totalTickets: parseInt(response.data.data.previous.totalTickets) || 0,
            revenue: parseFloat(response.data.data.previous.revenue) || 0
          },
          monthly: {
            labels: response.data.data.monthly.labels || [],
            users: response.data.data.monthly.users?.map(v => parseInt(v)) || [],
            events: response.data.data.monthly.events?.map(v => parseInt(v)) || [],
            tickets: response.data.data.monthly.tickets?.map(v => parseInt(v)) || [],
            revenue: response.data.data.monthly.revenue?.map(v => parseFloat(v)) || []
          }
        };

        setStats(formattedData);
      } else {
        throw new Error('Invalid data received from server');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // Add auto-refresh every 5 minutes
  useEffect(() => {
    fetchStats(period);
    
    const intervalId = setInterval(() => {
      fetchStats(period);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [period]);

  const chartData = React.useMemo(() => ({
    labels: stats.monthly.labels,
    datasets: [
      {
        label: 'Users',
        data: stats.monthly.users,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#3b82f6',
        borderWidth: 2
      },
      {
        label: 'Events',
        data: stats.monthly.events,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#22c55e',
        borderWidth: 2
      },
      {
        label: 'Revenue',
        data: stats.monthly.revenue,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        yAxisID: 'revenue',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#06b6d4',
        borderWidth: 2
      },
    ],
  }), [stats.monthly]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { 
          boxWidth: 20, 
          padding: 20, 
          font: { size: 12 },
          usePointStyle: true
        },
      },
      tooltip: { 
        backgroundColor: '#1f2937',
        bodyFont: { size: 12 },
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label === 'Revenue') {
                label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(context.parsed.y);
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { 
          display: true, 
          text: 'Count', 
          font: { size: 12 } 
        },
        grid: { 
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          padding: 8,
          stepSize: 1
        }
      },
      revenue: {
        position: 'right',
        beginAtZero: true,
        title: { 
          display: true, 
          text: 'Revenue ($)', 
          font: { size: 12 } 
        },
        grid: { 
          display: false 
        },
        ticks: {
          padding: 8,
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
      x: { 
        grid: { 
          display: false 
        },
        ticks: {
          padding: 8
        }
      },
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 0.8,
        to: 0.4,
        loop: false
      },
      numbers: {
        type: 'number',
        duration: 1000,
        delay: (ctx) => ctx.dataIndex * 100
      }
    },
    transitions: {
      active: {
        animation: {
          duration: 300
        }
      }
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    fetchStats(newPeriod);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Analytics Dashboard</h2>
          <p className="dashboard-subtitle">Real-time insights and trends</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="period-selector">
            {['7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                className={`period-button ${period === p ? 'active' : ''}`}
                onClick={() => handlePeriodChange(p)}
                aria-label={`Select ${p} period`}
              >
                {p === '7d' ? 'Last 7 Days' : p === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
          </div>
          <Button
            variant="outline-primary"
            className="refresh-button"
            onClick={() => fetchStats(period)}
            disabled={loading}
            aria-label="Refresh dashboard data"
          >
            <RefreshCw size={16} className={loading ? 'spin-animation' : ''} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <Alert.Heading>Error Loading Data</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      <Row className="g-4 mb-4">
        <Col xs={12} md={6} lg={3}>
          <StatCard
            title="Total Users"
            value={loading ? <Spinner size="sm" /> : stats.current.totalUsers}
            icon={Users}
            color="primary"
            growth={{ currentValue: stats.current.totalUsers, previousValue: stats.previous.totalUsers }}
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard
            title="Total Events"
            value={loading ? <Spinner size="sm" /> : stats.current.totalEvents}
            icon={Calendar}
            color="success"
            growth={{ currentValue: stats.current.totalEvents, previousValue: stats.previous.totalEvents }}
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard
            title="Total Tickets"
            value={loading ? <Spinner size="sm" /> : stats.current.totalTickets}
            icon={Ticket}
            color="warning"
            growth={{ currentValue: stats.current.totalTickets, previousValue: stats.previous.totalTickets }}
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard
            title="Revenue"
            value={loading ? <Spinner size="sm" /> : `$${stats.current.revenue.toLocaleString()}`}
            icon={DollarSign}
            color="info"
            growth={{ currentValue: stats.current.revenue, previousValue: stats.previous.revenue }}
          />
        </Col>
      </Row>

      <Card className="chart-container">
        <Card.Body>
          <div className="chart-header">
            <h4 className="chart-title">Monthly Trends</h4>
          </div>
          <div className="chart-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
            {loading ? (
              <div className="h-100 d-flex align-items-center justify-content-center">
                <Spinner />
              </div>
            ) : (
              <Line 
                data={chartData} 
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false,
                  responsive: true
                }} 
              />
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;