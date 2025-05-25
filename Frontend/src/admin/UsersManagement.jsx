import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Card, Container, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, UserCheck, UserX, RefreshCw } from 'lucide-react';
import axiosInstance from '../apiConfig/axiosConfig';
import './UsersManagement.css';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    is_active: true
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/users/');
      setUsers(response.data.data || []);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Edit
  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      is_active: user.is_active
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
        setError('');
        const response = await axiosInstance.put(
            `/admin/users/${selectedUser.id}/`, 
            editForm
        );
        
        if (response.data.status === 'success') {
            setUsers(users.map(user => 
                user.id === selectedUser.id 
                    ? { ...user, ...response.data.data }
                    : user
            ));
            setShowEditModal(false);
        }
    } catch (error) {
        console.error('Error updating user:', error);
        setError(error.response?.data?.message || 'Failed to update user');
    }
};

  // Handle Delete
  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/admin/users/${selectedUser.id}/`);
      if (response.data.status === 'success') {
        setUsers(users.filter(user => user.id !== selectedUser.id));
        setShowDeleteModal(false);
      }
    } catch (error) {
      setError('Failed to delete user');
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Container fluid className="p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-sm">
          <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Users Management</h2>
            <Button 
              variant="outline-light" 
              size="sm"
              onClick={fetchUsers}
              disabled={loading}
            >
              <RefreshCw 
                size={16} 
                className={`me-2 ${loading ? 'spin-animation' : ''}`}
              />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Card.Header>
          <Card.Body>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              </motion.div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-2">Loading users...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {users.map(user => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ backgroundColor: '#f8f9fa' }}
                        >
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                              {user.is_active ? (
                                <><UserCheck size={14} className="me-1" /> Active</>
                              ) : (
                                <><UserX size={14} className="me-1" /> Inactive</>
                              )}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                variant="warning" 
                                size="sm"
                                className="btn-icon"
                                onClick={() => handleEdit(user)}
                              >
                                <Edit2 size={14} />
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                className="btn-icon"
                                onClick={() => handleDelete(user)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </motion.div>

      {/* Enhanced Edit Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                className="form-control-modern"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                className="form-control-modern"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Active"
                checked={editForm.is_active}
                onChange={(e) => setEditForm({...editForm, is_active: e.target.checked})}
                className="modern-switch"
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Enhanced Delete Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-3">
            <Trash2 size={48} className="text-danger mb-3" />
            <p>Are you sure you want to delete user "<strong>{selectedUser?.username}</strong>"?</p>
            <p className="text-muted small">This action cannot be undone.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UsersManagement;