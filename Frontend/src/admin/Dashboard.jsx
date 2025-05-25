// import React, { useState, useEffect } from 'react';
// import { Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
// import { Users, Calendar, Ticket, DollarSign, RefreshCw } from 'lucide-react';
// import axiosInstance from '../apiConfig/axiosConfig';

// const styles = {
//   card: {
//     transition: 'all 0.3s ease',
//     '&:hover': {
//       transform: 'translateY(-5px)',
//       boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)'
//     }
//   },
//   refreshIcon: {
//     animation: 'spin 1s linear infinite'
//   },
//   cardIcon: {
//     width: '24px',
//     height: '24px'
//   }
// };

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalEvents: 0,
//     totalTickets: 0,
//     revenue: 0
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

// const fetchStats = async () => {
//     try {
//         setLoading(true);
//         setError(null);
        
//         const response = await axiosInstance.get('/admin/stats/');
        
//         if (response?.data?.status === 'success' && response?.data?.data) {
//             setStats(response.data.data);
//         } else {
//             throw new Error('Invalid data received from server');
//         }
//     } catch (error) {
//         console.error('Error fetching stats:', error);
//         setError(error.message);
        
//         // Reset stats on error
//         setStats({
//             totalUsers: 0,
//             totalEvents: 0,
//             totalTickets: 0,
//             revenue: 0
//         });
        
//         // Auto-retry after 5 seconds if it's a connection error
//         if (error.message.includes('Connection failed')) {
//             setTimeout(() => {
//                 fetchStats();
//             }, 5000);
//         }
//     } finally {
//         setLoading(false);
//     }
// };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const StatCard = ({ title, value, icon: Icon, color }) => (
//     <Card 
//       className="bg-white shadow-sm h-100" 
//       style={styles.card}
//     >
//       <Card.Body>
//         <h6 className="text-muted mb-2">{title}</h6>
//         <div className="d-flex align-items-center justify-content-between">
//           <div>
//             {loading ? (
//               <Spinner animation="border" size="sm" />
//             ) : (
//               <h3 className="mb-0">{value}</h3>
//             )}
//           </div>
//           <Icon 
//             className={`text-${color}`} 
//             style={styles.cardIcon}
//           />
//         </div>
//       </Card.Body>
//     </Card>
//   );

//   return (
//     <div className="p-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="mb-0">Dashboard</h2>
//         <Button 
//           variant="outline-primary"
//           onClick={fetchStats}
//           disabled={loading}
//         >
//           <RefreshCw 
//             size={16} 
//             className="me-2"
//             style={loading ? styles.refreshIcon : {}}
//           />
//           {loading ? 'Loading...' : 'Refresh'}
//         </Button>
//       </div>
      
//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError(null)}>
//           <Alert.Heading>Error Loading Data</Alert.Heading>
//           <p>{error}</p>
//         </Alert>
//       )}
      
//       <Row className="g-4">
//         <Col md={3}>
//           <StatCard
//             title="Total Users"
//             value={stats.totalUsers || 0}
//             icon={Users}
//             color="primary"
//           />
//         </Col>
        
//         <Col md={3}>
//           <StatCard
//             title="Total Events"
//             value={stats.totalEvents || 0}
//             icon={Calendar}
//             color="success"
//           />
//         </Col>
        
//         <Col md={3}>
//           <StatCard
//             title="Total Tickets"
//             value={stats.totalTickets || 0}
//             icon={Ticket}
//             color="warning"
//           />
//         </Col>
        
//         <Col md={3}>
//           <StatCard
//             title="Revenue"
//             value={`$${(stats.revenue || 0).toLocaleString()}`}
//             icon={DollarSign}
//             color="info"
//           />
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import { Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
// import { Users, Calendar, Ticket, DollarSign, RefreshCw } from 'lucide-react';
// import axiosInstance from '../apiConfig/axiosConfig';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js';

// // Register Chart.js components
// ChartJS.register(
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend
// );

// const styles = {
//   card: {
//     transition: 'all 0.3s ease',
//     '&:hover': {
//       transform: 'translateY(-5px)',
//       boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)'
//     }
//   },
//   refreshIcon: {
//     animation: 'spin 1s linear infinite'
//   },
//   cardIcon: {
//     width: '24px',
//     height: '24px'
//   }
// };

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalEvents: 0,
//     totalTickets: 0,
//     revenue: 0
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await axiosInstance.get('/admin/stats/');

//       if (response?.data?.status === 'success' && response?.data?.data) {
//         setStats(response.data.data);
//       } else {
//         throw new Error('Invalid data received from server');
//       }
//     } catch (error) {
//       console.error('Full error:', error.response?.data, error.message);
//       setError(error.response?.data?.message || error.message || 'Failed to load dashboard data');

//       setStats({
//         totalUsers: 0,
//         totalEvents: 0,
//         totalTickets: 0,
//         revenue: 0
//       });

//       if (error.message.includes('Connection failed')) {
//         setTimeout(() => {
//           fetchStats();
//         }, 5000);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const StatCard = ({ title, value, icon: Icon, color }) => (
//     <Card className="bg-white shadow-sm h-100" style={styles.card}>
//       <Card.Body>
//         <h6 className="text-muted mb-2">{title}</h6>
//         <div className="d-flex align-items-center justify-content-between">
//           <div>
//             {loading ? (
//               <Spinner animation="border" size="sm" />
//             ) : (
//               <h3 className="mb-0">{value}</h3>
//             )}
//           </div>
//           <Icon className={`text-${color}`} style={styles.cardIcon} />
//         </div>
//       </Card.Body>
//     </Card>
//   );

//   // Bar chart data
//   const chartData = {
//     labels: ['Users', 'Events', 'Tickets', 'Revenue ($)'],
//     datasets: [
//       {
//         label: 'Dashboard Metrics',
//         data: [
//           stats.totalUsers,
//           stats.totalEvents,
//           stats.totalTickets,
//           stats.revenue
//         ],
//         backgroundColor: [
//           'rgba(0, 123, 255, 0.6)', // Blue for Users
//           'rgba(40, 167, 69, 0.6)', // Green for Events
//           'rgba(255, 193, 7, 0.6)', // Yellow for Tickets
//           'rgba(23, 162, 184, 0.6)' // Cyan for Revenue
//         ],
//         borderColor: [
//           '#007bff',
//           '#28a745',
//           '#ffc107',
//           '#17a2b8'
//         ],
//         borderWidth: 1
//       }
//     ]
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: false // Hide legend since we have one dataset
//       },
//       tooltip: {
//         backgroundColor: '#fff',
//         titleColor: '#333',
//         bodyColor: '#333',
//         borderColor: '#007bff',
//         borderWidth: 1
//       },
//       title: {
//         display: true,
//         text: 'Dashboard Metrics',
//         color: '#333',
//         font: {
//           size: 16
//         }
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Value',
//           color: '#333'
//         },
//         grid: {
//           color: 'rgba(0, 0, 0, 0.1)'
//         },
//         ticks: {
//           color: '#333'
//         }
//       },
//       x: {
//         title: {
//           display: true,
//           text: 'Metrics',
//           color: '#333'
//         },
//         grid: {
//           display: false
//         },
//         ticks: {
//           color: '#333'
//         }
//       }
//     }
//   };

//   return (
//     <div className="p-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="mb-0">Dashboard</h2>
//         <Button
//           variant="outline-primary"
//           onClick={fetchStats}
//           disabled={loading}
//         >
//           <RefreshCw
//             size={16}
//             className="me-2"
//             style={loading ? styles.refreshIcon : {}}
//           />
//           {loading ? 'Loading...' : 'Refresh'}
//         </Button>
//       </div>

//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError(null)}>
//           <Alert.Heading>Error Loading Data</Alert.Heading>
//           <p>{error}</p>
//         </Alert>
//       )}

//       <Row className="g-4 mb-4">
//         <Col md={3}>
//           <StatCard
//             title="Total Users"
//             value={stats.totalUsers || 0}
//             icon={Users}
//             color="primary"
//           />
//         </Col>
//         <Col md={3}>
//           <StatCard
//             title="Total Events"
//             value={stats.totalEvents || 0}
//             icon={Calendar}
//             color="success"
//           />
//         </Col>
//         <Col md={3}>
//           <StatCard
//             title="Total Tickets"
//             value={stats.totalTickets || 0}
//             icon={Ticket}
//             color="warning"
//           />
//         </Col>
//         <Col md={3}>
//           <StatCard
//             title="Revenue"
//             value={`$${(stats.revenue || 0).toLocaleString()}`}
//             icon={DollarSign}
//             color="info"
//           />
//         </Col>
//       </Row>

//       <Card className="bg-white shadow-sm">
//         <Card.Body>
//           <h4 className="mb-4">Dashboard Metrics Overview</h4>
//           <Bar data={chartData} options={chartOptions} />
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;





// import React, { useState, useEffect } from 'react';
// import { Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
// import { Users, Calendar, Ticket, DollarSign, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
// import { Bar, Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js';
// import axiosInstance from '../apiConfig/axiosConfig';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const styles = {
//   card: {
//     transition: 'all 0.3s ease',
//     '&:hover': {
//       transform: 'translateY(-5px)',
//       boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)'
//     }
//   },
//   refreshIcon: {
//     animation: 'spin 1s linear infinite'
//   },
//   cardIcon: {
//     width: '24px',
//     height: '24px'
//   },
//   trendUp: {
//     color: '#28a745'
//   },
//   trendDown: {
//     color: '#dc3545'
//   }
// };

// const GrowthIndicator = ({ currentValue, previousValue, label }) => {
//   const growth = previousValue ? ((currentValue - previousValue) / previousValue) * 100 : 0;
//   const isPositive = growth >= 0;

//   return (
//     <div className="text-center">
//       <small className="text-muted d-block mb-1">{label}</small>
//       <div className="d-flex align-items-center justify-content-center">
//         <span className={`h5 mb-0 ${isPositive ? 'text-success' : 'text-danger'}`}>
//           {Math.abs(growth).toFixed(1)}%
//         </span>
//         {isPositive ? (
//           <TrendingUp size={20} style={styles.trendUp} className="ms-2" />
//         ) : (
//           <TrendingDown size={20} style={styles.trendDown} className="ms-2" />
//         )}
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon: Icon, color, growth }) => (
//   <Card className="bg-white shadow-sm h-100" style={styles.card}>
//     <Card.Body>
//       <h6 className="text-muted mb-2">{title}</h6>
//       <div className="d-flex align-items-center justify-content-between mb-3">
//         <div>
//           <h3 className="mb-0">{value}</h3>
//         </div>
//         <Icon className={`text-${color}`} style={styles.cardIcon} />
//       </div>
//       {growth && <GrowthIndicator {...growth} label="vs last month" />}
//     </Card.Body>
//   </Card>
// );

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     current: {
//       totalUsers: 0,
//       totalEvents: 0,
//       totalTickets: 0,
//       revenue: 0
//     },
//     previous: {
//       totalUsers: 0,
//       totalEvents: 0,
//       totalTickets: 0,
//       revenue: 0
//     },
//     monthly: {
//       labels: [],
//       users: [],
//       events: [],
//       tickets: [],
//       revenue: []
//     }
//   });
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await axiosInstance.get('/admin/stats/');
      
//       if (response?.data?.status === 'success') {
//         setStats(response.data.data);
//       } else {
//         throw new Error('Invalid data received from server');
//       }
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       setError(error.response?.data?.message || 'Failed to load statistics');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const chartData = {
//     labels: stats.monthly.labels,
//     datasets: [
//       {
//         label: 'Users',
//         data: stats.monthly.users,
//         borderColor: '#007bff',
//         backgroundColor: 'rgba(0, 123, 255, 0.1)',
//         fill: true
//       },
//       {
//         label: 'Events',
//         data: stats.monthly.events,
//         borderColor: '#28a745',
//         backgroundColor: 'rgba(40, 167, 69, 0.1)',
//         fill: true
//       },
//       {
//         label: 'Revenue',
//         data: stats.monthly.revenue,
//         borderColor: '#17a2b8',
//         backgroundColor: 'rgba(23, 162, 184, 0.1)',
//         fill: true,
//         yAxisID: 'revenue'
//       }
//     ]
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Count'
//         }
//       },
//       revenue: {
//         position: 'right',
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Revenue ($)'
//         }
//       }
//     }
//   };

//   return (
//     <div className="p-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="mb-0">Dashboard</h2>
//         <Button 
//           variant="outline-primary"
//           onClick={fetchStats}
//           disabled={loading}
//         >
//           <RefreshCw 
//             size={16} 
//             className="me-2"
//             style={loading ? styles.refreshIcon : {}}
//           />
//           {loading ? 'Loading...' : 'Refresh'}
//         </Button>
//       </div>

//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError(null)}>
//           <Alert.Heading>Error Loading Data</Alert.Heading>
//           <p>{error}</p>
//         </Alert>
//       )}

//       <Row className="g-4 mb-4">
//         <Col md={3}>
//           <StatCard
//             title="Total Users"
//             value={loading ? <Spinner size="sm" /> : stats.current.totalUsers}
//             icon={Users}
//             color="primary"
//             growth={{
//               currentValue: stats.current.totalUsers,
//               previousValue: stats.previous.totalUsers
//             }}
//           />
//         </Col>
//         <Col md={3}>
//           <StatCard
//             title="Total Events"
//             value={loading ? <Spinner size="sm" /> : stats.current.totalEvents}
//             icon={Calendar}
//             color="success"
//             growth={{
//               currentValue: stats.current.totalEvents,
//               previousValue: stats.previous.totalEvents
//             }}
//           />
//         </Col>
//         <Col md={3}>
//           <StatCard
//             title="Total Tickets"
//             value={loading ? <Spinner size="sm" /> : stats.current.totalTickets}
//             icon={Ticket}
//             color="warning"
//             growth={{
//               currentValue: stats.current.totalTickets,
//               previousValue: stats.previous.totalTickets
//             }}
//           />
//         </Col>
//         <Col md={3}>
//           <StatCard
//             title="Revenue"
//             value={loading ? <Spinner size="sm" /> : `$${stats.current.revenue.toLocaleString()}`}
//             icon={DollarSign}
//             color="info"
//             growth={{
//               currentValue: stats.current.revenue,
//               previousValue: stats.previous.revenue
//             }}
//           />
//         </Col>
//       </Row>

//       <Card className="bg-white shadow-sm">
//         <Card.Body>
//           <h4 className="mb-4">Monthly Trends</h4>
//           <div style={{ height: '400px' }}>
//             {loading ? (
//               <div className="h-100 d-flex align-items-center justify-content-center">
//                 <Spinner />
//               </div>
//             ) : (
//               <Line data={chartData} options={chartOptions} />
//             )}
//           </div>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;


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
        setStats(response.data.data);
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

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  const chartData = {
    labels: stats.monthly.labels,
    datasets: [
      {
        label: 'Users',
        data: stats.monthly.users,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Events',
        data: stats.monthly.events,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Revenue',
        data: stats.monthly.revenue,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        yAxisID: 'revenue',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 20, padding: 20, font: { size: 12 } },
      },
      tooltip: { backgroundColor: '#1f2937', bodyFont: { size: 12 } },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Count', font: { size: 12 } },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
      revenue: {
        position: 'right',
        beginAtZero: true,
        title: { display: true, text: 'Revenue ($)', font: { size: 12 } },
        grid: { display: false },
      },
      x: { grid: { display: false } },
    },
    animation: { duration: 1000, easing: 'easeOutQuart' },
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
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
          <div style={{ height: '400px' }}>
            {loading ? (
              <div className="h-100 d-flex align-items-center justify-content-center">
                <Spinner />
              </div>
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;