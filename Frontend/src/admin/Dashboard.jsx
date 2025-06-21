// import React, { useState, useEffect, memo } from 'react';
// import { Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
// import { Users, Calendar, Ticket, DollarSign, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import axiosInstance from '../apiConfig/axiosConfig';
// import './dashboard.css'; // Updated CSS file

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const GrowthIndicator = memo(({ currentValue, previousValue, label }) => {
//   const growth = previousValue ? ((currentValue - previousValue) / previousValue) * 100 : 0;
//   const isPositive = growth >= 0;

//   return (
//     <div className={`growth-indicator ${isPositive ? 'growth-positive' : 'growth-negative'}`}>
//       <small>{label}</small>
//       <div className="d-flex align-items-center gap-2">
//         <span className="h6 mb-0">{Math.abs(growth).toFixed(1)}%</span>
//         {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
//       </div>
//     </div>
//   );
// });

// const StatCard = memo(({ title, value, icon: Icon, color, growth }) => (
//   <Card className="stats-card">
//     <Card.Body className="d-flex flex-column justify-content-between">
//       <div className="d-flex align-items-center justify-content-between">
//         <h6 className="text-muted mb-0">{title}</h6>
//         <div className={`card-icon-wrapper ${color}`}>
//           <Icon size={24} />
//         </div>
//       </div>
//       <h3 className="mt-2 mb-3">{value}</h3>
//       {growth && <GrowthIndicator {...growth} label="vs last period" />}
//     </Card.Body>
//   </Card>
// ));

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     current: { totalUsers: 0, totalEvents: 0, totalTickets: 0, revenue: 0 },
//     previous: { totalUsers: 0, totalEvents: 0, totalTickets: 0, revenue: 0 },
//     monthly: { labels: [], users: [], events: [], tickets: [], revenue: [] },
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [period, setPeriod] = useState('30d'); // New state for period selection

//   const fetchStats = async (selectedPeriod = '30d') => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await axiosInstance.get(`/admin/stats/?period=${selectedPeriod}`);
      
//       if (response?.data?.status === 'success' && response.data.data) {
//         const data = response.data.data;
//         const parseNumber = (value) => {
//           const num = Number(value);
//           return isNaN(num) ? 0 : num;
//         };

//         const formattedData = {
//           current: {
//             totalUsers: parseNumber(data.current?.totalUsers),
//             totalEvents: parseNumber(data.current?.totalEvents),
//             totalTickets: parseNumber(data.current?.totalTickets),
//             revenue: parseFloat(parseNumber(data.current?.revenue).toFixed(2))
//           },
//           previous: {
//             totalUsers: parseNumber(data.previous?.totalUsers),
//             totalEvents: parseNumber(data.previous?.totalEvents),
//             totalTickets: parseNumber(data.previous?.totalTickets),
//             revenue: parseFloat(parseNumber(data.previous?.revenue).toFixed(2))
//           },
//           monthly: {
//             labels: Array.isArray(data.monthly?.labels) ? data.monthly.labels : [],
//             users: Array.isArray(data.monthly?.users) ? data.monthly.users.map(parseNumber) : [],
//             events: Array.isArray(data.monthly?.events) ? data.monthly.events.map(parseNumber) : [],
//             tickets: Array.isArray(data.monthly?.tickets) ? data.monthly.tickets.map(parseNumber) : [],
//             revenue: Array.isArray(data.monthly?.revenue) ? data.monthly.revenue.map(v => parseFloat(parseNumber(v).toFixed(2))) : []
//           }
//         };

//         console.log('Formatted data:', formattedData);
//         setStats(formattedData);
//       } else {
//         throw new Error(response?.data?.message || 'Invalid data format received from server');
//       }
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       setError(error.response?.data?.message || 'Failed to load statistics. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add auto-refresh every 5 minutes
//   useEffect(() => {
//     fetchStats(period);
    
//     const intervalId = setInterval(() => {
//       fetchStats(period);
//     }, 5 * 60 * 1000); // 5 minutes

//     return () => clearInterval(intervalId);
//   }, [period]);

//   const chartData = React.useMemo(() => {
//     // Ensure we have valid data before rendering chart
//     if (!stats.monthly.labels?.length) {
//       return {
//         labels: [],
//         datasets: []
//       };
//     }

//     return {
//       labels: stats.monthly.labels,
//       datasets: [
//         {
//           label: 'Users',
//           data: stats.monthly.users,
//           borderColor: '#3b82f6',
//           backgroundColor: 'rgba(59, 130, 246, 0.1)',
//           fill: true,
//           tension: 0.4,
//           pointRadius: 4,
//           pointHoverRadius: 6,
//           pointBackgroundColor: '#3b82f6',
//           borderWidth: 2,
//           yAxisID: 'y'
//         },
//         {
//           label: 'Events',
//           data: stats.monthly.events,
//           borderColor: '#22c55e',
//           backgroundColor: 'rgba(34, 197, 94, 0.1)',
//           fill: true,
//           tension: 0.4,
//           pointRadius: 4,
//           pointHoverRadius: 6,
//           pointBackgroundColor: '#22c55e',
//           borderWidth: 2,
//           yAxisID: 'y'
//         },
//         {
//           label: 'Revenue',
//           data: stats.monthly.revenue,
//           borderColor: '#8b5cf6',
//           backgroundColor: 'rgba(139, 92, 246, 0.1)',
//           fill: true,
//           yAxisID: 'revenue',
//           tension: 0.4,
//           pointRadius: 4,
//           pointHoverRadius: 6,
//           pointBackgroundColor: '#8b5cf6',
//           borderWidth: 2
//         },
//       ],
//     };
//   }, [stats.monthly]);

//   const chartOptions = React.useMemo(() => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     interaction: {
//       mode: 'index',
//       intersect: false,
//     },
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: { 
//           boxWidth: 20, 
//           padding: 20, 
//           font: { size: 12 },
//           usePointStyle: true,
//           color: '#64748b'
//         },
//       },
//       tooltip: { 
//         backgroundColor: '#1f2937',
//         titleFont: { 
//           size: 13,
//           weight: '600'
//         },
//         bodyFont: { 
//           size: 13 
//         },
//         padding: 12,
//         cornerRadius: 8,
//         displayColors: true,
//         boxPadding: 6,
//         callbacks: {
//           label: function(context) {
//             let label = context.dataset.label || '';
//             if (context.parsed.y !== null) {
//               if (label) label += ': ';
//               if (context.dataset.label === 'Revenue') {
//                 label += new Intl.NumberFormat('en-US', {
//                   style: 'currency',
//                   currency: 'USD',
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2
//                 }).format(context.parsed.y);
//               } else {
//                 label += context.parsed.y.toLocaleString();
//               }
//             }
//             return label;
//           }
//         }
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: { 
//           display: true, 
//           text: 'Count',
//           color: '#64748b',
//           font: { 
//             size: 12,
//             weight: '500'
//           } 
//         },
//         grid: { 
//           color: 'rgba(0, 0, 0, 0.05)',
//           drawBorder: false
//         },
//         ticks: {
//           padding: 8,
//           stepSize: 1,
//           color: '#64748b',
//           font: {
//             size: 11
//           }
//         }
//       },
//       revenue: {
//         position: 'right',
//         beginAtZero: true,
//         title: { 
//           display: true, 
//           text: 'Revenue ($)',
//           color: '#8b5cf6',
//           font: { 
//             size: 12,
//             weight: '500'
//           } 
//         },
//         grid: { 
//           display: false 
//         },
//         ticks: {
//           padding: 8,
//           color: '#8b5cf6',
//           font: {
//             size: 11
//           },
//           callback: function(value) {
//             return new Intl.NumberFormat('en-US', {
//               style: 'currency',
//               currency: 'USD',
//               minimumFractionDigits: 0,
//               maximumFractionDigits: 0
//             }).format(value);
//           }
//         }
//       },
//       x: { 
//         grid: { 
//           display: false 
//         },
//         ticks: {
//           padding: 8,
//           maxRotation: 45,
//           minRotation: 45,
//           color: '#64748b',
//           font: {
//             size: 11
//           }
//         }
//       },
//     },
//     animation: {
//       duration: 1000,
//       easing: 'easeOutQuart'
//     },
//     elements: {
//       line: {
//         tension: 0.4
//       },
//       point: {
//         radius: 0,
//         hoverRadius: 6
//       }
//     }
//   }), []);

//   const handlePeriodChange = (newPeriod) => {
//     setPeriod(newPeriod);
//     fetchStats(newPeriod);
//   };

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <div>
//           <h2 className="dashboard-title">Analytics Dashboard</h2>
//           <p className="dashboard-subtitle">Real-time insights and trends</p>
//         </div>
//         <div className="d-flex align-items-center gap-3">
//           <div className="period-selector">
//             {['7d', '30d', '90d'].map((p) => (
//               <button
//                 key={p}
//                 className={`period-button ${period === p ? 'active' : ''}`}
//                 onClick={() => handlePeriodChange(p)}
//                 aria-label={`Select ${p} period`}
//               >
//                 {p === '7d' ? 'Last 7 Days' : p === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
//               </button>
//             ))}
//           </div>
//           <Button
//             variant="outline-primary"
//             className="refresh-button"
//             onClick={() => fetchStats(period)}
//             disabled={loading}
//             aria-label="Refresh dashboard data"
//           >
//             <RefreshCw size={16} className={loading ? 'spin-animation' : ''} />
//             {loading ? 'Loading...' : 'Refresh'}
//           </Button>
//         </div>
//       </div>

//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError(null)}>
//           <Alert.Heading>Error Loading Data</Alert.Heading>
//           <p>{error}</p>
//         </Alert>
//       )}

// <Row className="g-4 mb-4">
//   <Col xs={12} md={6} lg={3}>
//     <StatCard
//       title="Total Users"
//       value={loading ? <Spinner size="sm" /> : stats.current.totalUsers}
//       icon={Users}
//       color="primary"
//       growth={{ currentValue: stats.current.totalUsers, previousValue: stats.previous.totalUsers }}
//     />
//   </Col>
//   <Col xs={12} md={6} lg={3}>
//     <StatCard
//       title="Total Events"
//       value={loading ? <Spinner size="sm" /> : stats.current.totalEvents}
//       icon={Calendar}
//       color="success"
//       growth={{ currentValue: stats.current.totalEvents, previousValue: stats.previous.totalEvents }}
//     />
//   </Col>
//   <Col xs={12} md={6} lg={3}>
//     <StatCard
//       title="Total Tickets"
//       value={loading ? <Spinner size="sm" /> : stats.current.totalTickets}
//       icon={Ticket}
//       color="warning"
//       growth={{ currentValue: stats.current.totalTickets, previousValue: stats.previous.totalTickets }}
//     />
//   </Col>
//   <Col xs={12} md={6} lg={3}>
//     <StatCard
//       title="Your Earnings"
//       value={
//         loading ? (
//           <Spinner size="sm" />
//         ) : (
//           `$${(
//             stats.current.totalTickets > 0
//               ? stats.current.revenue - 2 * stats.current.totalTickets
//               : 0
//           ).toLocaleString()}`
//         )
//       }
//       icon={DollarSign}
//       color="info"
//       growth={{
//         currentValue:
//           stats.current.totalTickets > 0 ? stats.current.revenue - 2 * stats.current.totalTickets : 0,
//         previousValue:
//           stats.previous.totalTickets > 0
//             ? stats.previous.revenue - 2 * stats.previous.totalTickets
//             : 0,
//       }}
//     />
//   </Col>
// </Row>

//       <Card className="chart-container">
//         <Card.Body>
//           <div className="chart-header">
//             <h4 className="chart-title">Monthly Trends</h4>
//           </div>
//           <div className="chart-wrapper" style={{ position: 'relative', width: '100%', minHeight: '400px' }}>
//             {loading ? (
//               <div className="h-100 d-flex align-items-center justify-content-center">
//                 <Spinner animation="border" variant="primary" />
//               </div>
//             ) : !chartData.labels?.length ? (
//               <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
//                 <span>No data available for the selected period</span>
//               </div>
//             ) : (
//               <Line 
//                 data={chartData} 
//                 options={chartOptions}
//                 redraw={false}
//                 updateMode='resize'
//                 style={{ width: '100%', height: '100%' }}
//               />
//             )}
//           </div>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;


// import React, { useState, useEffect, memo } from 'react';
// import { Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
// import { Users, Calendar, Ticket, DollarSign, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler // Added Filler plugin
// } from 'chart.js';
// import axiosInstance from '../apiConfig/axiosConfig';
// import './dashboard.css';

// // Register Chart.js components, including Filler
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// const GrowthIndicator = memo(({ currentValue, previousValue, label }) => {
//   const growth = previousValue ? ((currentValue - previousValue) / previousValue) * 100 : 0;
//   const isPositive = growth >= 0;

//   return (
//     <div className={`growth-indicator ${isPositive ? 'growth-positive' : 'growth-negative'}`}>
//       <small>{label}</small>
//       <div className="d-flex align-items-center gap-2">
//         <span className="h6 mb-0">{Math.abs(growth).toFixed(1)}%</span>
//         {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
//       </div>
//     </div>
//   );
// });

// const StatCard = memo(({ title, value, icon: Icon, color, growth }) => (
//   <Card className="stats-card">
//     <Card.Body className="d-flex flex-column justify-content-between">
//       <div className="d-flex align-items-center justify-content-between">
//         <h6 className="text-muted mb-0">{title}</h6>
//         <div className={`card-icon-wrapper ${color}`}>
//           <Icon size={24} />
//         </div>
//       </div>
//       <h3 className="mt-2 mb-3">{value}</h3>
//       {growth && <GrowthIndicator {...growth} label="vs last period" />}
//     </Card.Body>
//   </Card>
// ));

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     current: { totalUsers: 0, totalEvents: 0, totalTickets: 0, revenue: 0 },
//     previous: { totalUsers: 0, totalEvents: 0, totalTickets: 0, revenue: 0 },
//     monthly: { labels: [], users: [], events: [], tickets: [], revenue: [] },
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [period, setPeriod] = useState('30d');

//   const fetchStats = async (selectedPeriod = '30d') => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await axiosInstance.get(`/admin/stats/?period=${selectedPeriod}`);
      
//       if (response?.data?.status === 'success' && response.data.data) {
//         const data = response.data.data;
//         const parseNumber = (value) => {
//           const num = Number(value);
//           return isNaN(num) ? 0 : num;
//         };

//         const formattedData = {
//           current: {
//             totalUsers: parseNumber(data.current?.totalUsers),
//             totalEvents: parseNumber(data.current?.totalEvents),
//             totalTickets: parseNumber(data.current?.totalTickets),
//             revenue: parseFloat(parseNumber(data.current?.revenue).toFixed(2))
//           },
//           previous: {
//             totalUsers: parseNumber(data.previous?.totalUsers),
//             totalEvents: parseNumber(data.previous?.totalEvents),
//             totalTickets: parseNumber(data.previous?.totalTickets),
//             revenue: parseFloat(parseNumber(data.previous?.revenue).toFixed(2))
//           },
//           monthly: {
//             labels: Array.isArray(data.monthly?.labels) ? data.monthly.labels : [],
//             users: Array.isArray(data.monthly?.users) ? data.monthly.users.map(parseNumber) : [],
//             events: Array.isArray(data.monthly?.events) ? data.monthly.events.map(parseNumber) : [],
//             tickets: Array.isArray(data.monthly?.tickets) ? data.monthly.tickets.map(parseNumber) : [],
//             revenue: Array.isArray(data.monthly?.revenue) ? data.monthly.revenue.map(v => parseFloat(parseNumber(v).toFixed(2))) : []
//           }
//         };

//         console.log('Formatted data:', formattedData);
//         setStats(formattedData);
//       } else {
//         throw new Error(response?.data?.message || 'Invalid data format received from server');
//       }
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       setError(error.response?.data?.message || 'Failed to load statistics. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats(period);
    
//     const intervalId = setInterval(() => {
//       fetchStats(period);
//     }, 5 * 60 * 1000);

//     return () => clearInterval(intervalId);
//   }, [period]);

//   const chartData = React.useMemo(() => {
//     if (!stats.monthly.labels?.length) {
//       return {
//         labels: [],
//         datasets: []
//       };
//     }

//     return {
//       labels: stats.monthly.labels,
//       datasets: [
//         {
//           label: 'Users',
//           data: stats.monthly.users,
//           borderColor: '#3b82f6',
//           backgroundColor: 'rgba(59, 130, 246, 0.1)',
//           fill: true,
//           tension: 0.4,
//           pointRadius: 4,
//           pointHoverRadius: 6,
//           pointBackgroundColor: '#3b82f6',
//           borderWidth: 2,
//           yAxisID: 'y'
//         },
//         {
//           label: 'Events',
//           data: stats.monthly.events,
//           borderColor: '#22c55e',
//           backgroundColor: 'rgba(34, 197, 94, 0.1)',
//           fill: true,
//           tension: 0.4,
//           pointRadius: 4,
//           pointHoverRadius: 6,
//           pointBackgroundColor: '#22c55e',
//           borderWidth: 2,
//           yAxisID: 'y'
//         },
//         {
//           label: 'Revenue',
//           data: stats.monthly.revenue,
//           borderColor: '#8b5cf6',
//           backgroundColor: 'rgba(139, 92, 246, 0.1)',
//           fill: true,
//           yAxisID: 'revenue',
//           tension: 0.4,
//           pointRadius: 4,
//           pointHoverRadius: 6,
//           pointBackgroundColor: '#8b5cf6',
//           borderWidth: 2
//         },
//       ],
//     };
//   }, [stats.monthly]);

//   const chartOptions = React.useMemo(() => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     interaction: {
//       mode: 'index',
//       intersect: false,
//     },
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: { 
//           boxWidth: 20, 
//           padding: 20, 
//           font: { size: 12 },
//           usePointStyle: true,
//           color: '#64748b'
//         },
//       },
//       tooltip: { 
//         backgroundColor: '#1f2937',
//         titleFont: { 
//           size: 13,
//           weight: '600'
//         },
//         bodyFont: { 
//           size: 13 
//         },
//         padding: 12,
//         cornerRadius: 8,
//         displayColors: true,
//         boxPadding: 6,
//         callbacks: {
//           label: function(context) {
//             let label = context.dataset.label || '';
//             if (context.parsed.y !== null) {
//               if (label) label += ': ';
//               if (context.dataset.label === 'Revenue') {
//                 label += new Intl.NumberFormat('en-US', {
//                   style: 'currency',
//                   currency: 'USD',
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2
//                 }).format(context.parsed.y);
//               } else {
//                 label += context.parsed.y.toLocaleString();
//               }
//             }
//             return label;
//           }
//         }
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: { 
//           display: true, 
//           text: 'Count',
//           color: '#64748b',
//           font: { 
//             size: 12,
//             weight: '500'
//           } 
//         },
//         grid: { 
//           color: 'rgba(0, 0, 0, 0.05)',
//           drawBorder: false
//         },
//         ticks: {
//           padding: 8,
//           stepSize: 1,
//           color: '#64748b',
//           font: {
//             size: 11
//           }
//         }
//       },
//       revenue: {
//         position: 'right',
//         beginAtZero: true,
//         title: { 
//           display: true, 
//           text: 'Revenue ($)',
//           color: '#8b5cf6',
//           font: { 
//             size: 12,
//             weight: '500'
//           } 
//         },
//         grid: { 
//           display: false 
//         },
//         ticks: {
//           padding: 8,
//           color: '#8b5cf6',
//           font: {
//             size: 11
//           },
//           callback: function(value) {
//             return new Intl.NumberFormat('en-US', {
//               style: 'currency',
//               currency: 'USD',
//               minimumFractionDigits: 0,
//               maximumFractionDigits: 0
//             }).format(value);
//           }
//         }
//       },
//       x: { 
//         grid: { 
//           display: false 
//         },
//         ticks: {
//           padding: 8,
//           maxRotation: 45,
//           minRotation: 45,
//           color: '#64748b',
//           font: {
//             size: 11
//           }
//         }
//       },
//     },
//     animation: {
//       duration: 1000,
//       easing: 'easeOutQuart'
//     },
//     elements: {
//       line: {
//         tension: 0.4
//       },
//       point: {
//         radius: 0,
//         hoverRadius: 6
//       }
//     }
//   }), []);

//   const handlePeriodChange = (newPeriod) => {
//     setPeriod(newPeriod);
//     fetchStats(newPeriod);
//   };

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <div>
//           <h2 className="dashboard-title">Analytics Dashboard</h2>
//           <p className="dashboard-subtitle">Real-time insights and trends</p>
//         </div>
//         <div className="d-flex align-items-center gap-3">
//           <div className="period-selector">
//             {['7d', '30d', '90d'].map((p) => (
//               <button
//                 key={p}
//                 className={`period-button ${period === p ? 'active' : ''}`}
//                 onClick={() => handlePeriodChange(p)}
//                 aria-label={`Select ${p} period`}
//               >
//                 {p === '7d' ? 'Last 7 Days' : p === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
//               </button>
//             ))}
//           </div>
//           <Button
//             variant="outline-primary"
//             className="refresh-button"
//             onClick={() => fetchStats(period)}
//             disabled={loading}
//             aria-label="Refresh dashboard data"
//           >
//             <RefreshCw size={16} className={loading ? 'spin-animation' : ''} />
//             {loading ? 'Loading...' : 'Refresh'}
//           </Button>
//         </div>
//       </div>

//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError(null)}>
//           <Alert.Heading>Error Loading Data</Alert.Heading>
//           <p>{error}</p>
//         </Alert>
//       )}

//       <Row className="g-4 mb-4">
//         <Col xs={12} md={6} lg={3}>
//           <StatCard
//             title="Total Users"
//             value={loading ? <Spinner size="sm" /> : stats.current.totalUsers}
//             icon={Users}
//             color="primary"
//             growth={{ currentValue: stats.current.totalUsers, previousValue: stats.previous.totalUsers }}
//           />
//         </Col>
//         <Col xs={12} md={6} lg={3}>
//           <StatCard
//             title="Total Events"
//             value={loading ? <Spinner size="sm" /> : stats.current.totalEvents}
//             icon={Calendar}
//             color="success"
//             growth={{ currentValue: stats.current.totalEvents, previousValue: stats.previous.totalEvents }}
//           />
//         </Col>
//         <Col xs={12} md={6} lg={3}>
//           <StatCard
//             title="Total Tickets"
//             value={loading ? <Spinner size="sm" /> : stats.current.totalTickets}
//             icon={Ticket}
//             color="warning"
//             growth={{ currentValue: stats.current.totalTickets, previousValue: stats.previous.totalTickets }}
//           />
//         </Col>
//         <Col xs={12} md={6} lg={3}>
//           <StatCard
//             title="Your Earnings"
//             value={
//               loading ? (
//                 <Spinner size="sm" />
//               ) : (
//                 `$${(
//                   stats.current.totalTickets > 0
//                     ? stats.current.revenue - 2 * stats.current.totalTickets
//                     : 0
//                 ).toLocaleString()}`
//               )
//             }
//             icon={DollarSign}
//             color="info"
//             growth={{
//               currentValue:
//                 stats.current.totalTickets > 0 ? stats.current.revenue - 2 * stats.current.totalTickets : 0,
//               previousValue:
//                 stats.previous.totalTickets > 0
//                   ? stats.previous.revenue - 2 * stats.previous.totalTickets
//                   : 0,
//             }}
//           />
//         </Col>
//       </Row>

//       <Card className="chart-container">
//         <Card.Body>
//           <div className="chart-header">
//             <h4 className="chart-title">Monthly Trends</h4>
//           </div>
//           <div className="chart-wrapper" style={{ position: 'relative', width: '100%', minHeight: '400px' }}>
//             {loading ? (
//               <div className="h-100 d-flex align-items-center justify-content-center">
//                 <Spinner animation="border" variant="primary" />
//               </div>
//             ) : !chartData.labels?.length ? (
//               <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
//                 <span>No data available for the selected period</span>
//               </div>
//             ) : (
//               <Line 
//                 data={chartData} 
//                 options={chartOptions}
//                 redraw={false}
//                 updateMode='resize'
//                 style={{ width: '100%', height: '100%' }}
//               />
//             )}
//           </div>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

//  export default Dashboard;


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
  Filler
} from 'chart.js';
import axiosInstance from '../apiConfig/axiosConfig';
import './dashboard.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

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
  const [period, setPeriod] = useState('30d');

  const fetchStats = async (selectedPeriod = '30d') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/admin/stats/?period=${selectedPeriod}`);
      
      if (response?.data?.status === 'success' && response.data.data) {
        const data = response.data.data;
        const parseNumber = (value) => {
          const num = Number(value);
          return isNaN(num) ? 0 : num;
        };

        const formattedData = {
          current: {
            totalUsers: parseNumber(data.current?.totalUsers),
            totalEvents: parseNumber(data.current?.totalEvents),
            totalTickets: parseNumber(data.current?.totalTickets),
            revenue: parseFloat(parseNumber(data.current?.revenue).toFixed(2))
          },
          previous: {
            totalUsers: parseNumber(data.previous?.totalUsers),
            totalEvents: parseNumber(data.previous?.totalEvents),
            totalTickets: parseNumber(data.previous?.totalTickets),
            revenue: parseFloat(parseNumber(data.previous?.revenue).toFixed(2))
          },
          monthly: {
            labels: Array.isArray(data.monthly?.labels) ? data.monthly.labels : [],
            users: Array.isArray(data.monthly?.users) ? data.monthly.users.map(parseNumber) : [],
            events: Array.isArray(data.monthly?.events) ? data.monthly.events.map(parseNumber) : [],
            tickets: Array.isArray(data.monthly?.tickets) ? data.monthly.tickets.map(parseNumber) : [],
            revenue: Array.isArray(data.monthly?.revenue) ? data.monthly.revenue.map(v => parseFloat(parseNumber(v).toFixed(2))) : []
          }
        };

        console.log('Formatted data:', formattedData);
        setStats(formattedData);
      } else {
        throw new Error(response?.data?.message || 'Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.response?.data?.message || 'Failed to load statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(period);
    
    const intervalId = setInterval(() => {
      fetchStats(period);
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [period]);

  const chartData = React.useMemo(() => {
    if (!stats.monthly.labels?.length) {
      return {
        labels: [],
        datasets: []
      };
    }

    return {
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
          borderWidth: 2,
          yAxisID: 'y'
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
          borderWidth: 2,
          yAxisID: 'y'
        },
        {
          label: 'Revenue',
          data: stats.monthly.revenue,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          fill: true,
          yAxisID: 'revenue',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#8b5cf6',
          borderWidth: 2
        },
      ],
    };
  }, [stats.monthly]);

  const chartOptions = React.useMemo(() => ({
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
          usePointStyle: true,
          color: '#64748b'
        },
      },
      tooltip: { 
        backgroundColor: '#1f2937',
        titleFont: { 
          size: 13,
          weight: '600'
        },
        bodyFont: { 
          size: 13 
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              if (label) label += ': ';
              if (context.dataset.label === 'Revenue') {
                label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(context.parsed.y);
              } else {
                label += context.parsed.y.toLocaleString();
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
          color: '#64748b',
          font: { 
            size: 12,
            weight: '500'
          } 
        },
        grid: { 
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          padding: 8,
          stepSize: 1,
          color: '#64748b',
          font: {
            size: 11
          }
        }
      },
      revenue: {
        position: 'right',
        beginAtZero: true,
        title: { 
          display: true, 
          text: 'Revenue ($)',
          color: '#8b5cf6',
          font: { 
            size: 12,
            weight: '500'
          } 
        },
        grid: { 
          display: false 
        },
        ticks: {
          padding: 8,
          color: '#8b5cf6',
          font: {
            size: 11
          },
          callback: function(value) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      },
      x: { 
        grid: { 
          display: false 
        },
        ticks: {
          padding: 8,
          maxRotation: 45,
          minRotation: 45,
          color: '#64748b',
          font: {
            size: 11
          }
        }
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 0,
        hoverRadius: 6
      }
    }
  }), []);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    fetchStats(newPeriod);
  };

  // Calculate platform and organizer earnings
  const platformEarnings = (tickets) => tickets * 2;
  const organizerEarnings = (revenue, tickets) => revenue - platformEarnings(tickets);

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
            title="Platform Earnings"
            value={
              loading ? (
                <Spinner size="sm" />
              ) : (
                `$${platformEarnings(stats.current.totalTickets).toLocaleString()}`
              )
            }
            icon={DollarSign}
            color="info"
            growth={{
              currentValue: platformEarnings(stats.current.totalTickets),
              previousValue: platformEarnings(stats.previous.totalTickets),
            }}
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard
            title="Organizer Earnings"
            value={
              loading ? (
                <Spinner size="sm" />
              ) : (
                `$${organizerEarnings(stats.current.revenue, stats.current.totalTickets).toLocaleString()}`
              )
            }
            icon={DollarSign}
            color="secondary"
            growth={{
              currentValue: organizerEarnings(stats.current.revenue, stats.current.totalTickets),
              previousValue: organizerEarnings(stats.previous.revenue, stats.previous.totalTickets),
            }}
          />
        </Col>
      </Row>

      <Card className="chart-container">
        <Card.Body>
          <div className="chart-header">
            <h4 className="chart-title">Monthly Trends</h4>
          </div>
          <div className="chart-wrapper" style={{ position: 'relative', width: '100%', minHeight: '400px' }}>
            {loading ? (
              <div className="h-100 d-flex align-items-center justify-content-center">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : !chartData.labels?.length ? (
              <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                <span>No data available for the selected period</span>
              </div>
            ) : (
              <Line 
                data={chartData} 
                options={chartOptions}
                redraw={false}
                updateMode='resize'
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;