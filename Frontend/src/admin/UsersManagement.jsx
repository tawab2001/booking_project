import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axiosInstance from '../apiConfig/axiosConfig';

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
    <div>
      <h2 className="mb-4">Users Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.is_active ? 'Active' : 'Inactive'}</td>
              <td>
                <Button 
                  variant="warning" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(user)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Active"
                checked={editForm.is_active}
                onChange={(e) => setEditForm({...editForm, is_active: e.target.checked})}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user "{selectedUser?.username}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UsersManagement;