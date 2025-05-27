import React, { useState } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import axiosInstance from '../apiConfig/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setIsLoading(true);
            const response = await axiosInstance.post('/admin/login/', {
                email: formData.email,
                password: formData.password
            });

            if (response.data.status === 'success') {
                localStorage.setItem('token', response.data.access);
                localStorage.setItem('userType', response.data.user_type);
                localStorage.setItem('userData', JSON.stringify(response.data.user_data));
                
                if (response.data.user_data.is_staff) {
                    navigate('/admin');
                } else {
                    setError('You are not authorized as admin');
                }
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Card className="shadow-lg" style={{ width: '400px' }}>
                <Card.Body className="p-4">
                    <h2 className="text-warning text-center mb-4">Admin Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-dark text-light border-secondary"
                                required
                                placeholder="Enter admin email"
                                disabled={isLoading}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-dark text-light border-secondary"
                                required
                                placeholder="Enter password"
                                disabled={isLoading}
                            />
                        </Form.Group>
                        <Button
                            variant="warning"
                            type="submit"
                            disabled={isLoading}
                            className="w-100"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminLogin;