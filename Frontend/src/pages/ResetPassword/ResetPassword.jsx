// import React, { useState } from 'react';
// import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ENDPOINTS } from '../../apiConfig/api';

// const ResetPassword = () => {
//   const navigate = useNavigate();
//   const { token } = useParams();
//   const [email, setEmail] = useState('');
//   const [step, setStep] = useState(token ? 2 : 1);
//   const [formData, setFormData] = useState({
//     new_password: '',
//     confirm_password: ''
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleRequestReset = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setIsLoading(true);

//     try {
//       const response = await axios.post(ENDPOINTS.REQUEST_RESET_PASSWORD, { email });
//       setSuccess('Check your email for reset instructions');
//       setTimeout(() => setStep(2), 3000);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to send reset request');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     if (formData.new_password !== formData.confirm_password) {
//       setError('Passwords do not match');
//       return;
//     }

//     setError('');
//     setSuccess('');
//     setIsLoading(true);

//     try {
//       const response = await axios.post(ENDPOINTS.RESET_PASSWORD, {
//         token,
//         new_password: formData.new_password,
//         confirm_password: formData.confirm_password
//       });
      
//       setSuccess('Password reset successful! Redirecting to login...');
//       setTimeout(() => navigate('/login'), 3000);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to reset password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
//       <Row className="justify-content-center w-100">
//         <Col xs={11} sm={8} md={6} lg={4}>
//           <div className="p-4 shadow rounded bg-dark text-light">
//             <h2 className="text-warning text-center mb-4">Reset Password</h2>
            
//             {error && <Alert variant="danger">{error}</Alert>}
//             {success && <Alert variant="success">{success}</Alert>}

//             {step === 1 ? (
//               <Form onSubmit={handleRequestReset}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Email Address</Form.Label>
//                   <Form.Control
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter your email"
//                     required
//                     className="bg-dark text-light border-secondary"
//                   />
//                 </Form.Group>
//                 <Button
//                   variant="warning"
//                   type="submit"
//                   className="w-100"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Sending...' : 'Send Reset Link'}
//                 </Button>
//               </Form>
//             ) : (
//               <Form onSubmit={handleResetPassword}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>New Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     value={formData.new_password}
//                     onChange={(e) => setFormData({...formData, new_password: e.target.value})}
//                     placeholder="Enter new password"
//                     required
//                     className="bg-dark text-light border-secondary"
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Confirm Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     value={formData.confirm_password}
//                     onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
//                     placeholder="Confirm new password"
//                     required
//                     className="bg-dark text-light border-secondary"
//                   />
//                 </Form.Group>
//                 <Button
//                   variant="warning"
//                   type="submit"
//                   className="w-100"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Resetting...' : 'Reset Password'}
//                 </Button>
//               </Form>
//             )}

//             <p className="text-center text-muted mt-3">
//               <a href="/login" className="text-warning text-decoration-none">
//                 Back to Login
//               </a>
//             </p>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default ResetPassword;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../../apiConfig/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token: paramToken } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({
    token: '',
    new_password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryToken = queryParams.get('token');
    
    if (paramToken || queryToken) {
      setFormData(prev => ({
        ...prev,
        token: paramToken || queryToken
      }));
    } else {
      navigate('/request-reset');
    }
  }, [paramToken, location, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.new_password || !formData.confirm_password) {
      setError('Both password fields are required');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await axios.post(ENDPOINTS.RESET_PASSWORD, formData);
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="justify-content-center w-100">
        <Col xs={11} sm={8} md={6} lg={4}>
          <div className="p-4 shadow rounded bg-dark text-light">
            <h2 className="text-warning text-center mb-4">Set New Password</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleResetPassword}>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.new_password}
                  onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                  className="bg-dark text-light border-secondary"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                  className="bg-dark text-light border-secondary"
                />
              </Form.Group>
              <Button
                variant="warning"
                type="submit"
                className="w-100"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Form>

            <p className="text-center text-muted mt-3">
              <a href="/login" className="text-warning text-decoration-none">
                Back to Login
              </a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;