import React, { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [availableRoles] = useState(['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR']);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        setLoading(true);
        AuthService.getAllUsers()
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Failed to load users. ' + (error.response?.data?.message || error.message));
                setLoading(false);
            });
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setSelectedRoles(user.roles || []);
    };

    const handleRoleChange = (role) => {
        setSelectedRoles(prev => {
            if (prev.includes(role)) {
                return prev.filter(r => r !== role);
            } else {
                return [...prev, role];
            }
        });
    };

    const handleUpdateRoles = () => {
        if (!editingUser) return;

        AuthService.updateUserRoles(editingUser.id, selectedRoles)
            .then(() => {
                // Update local state
                setUsers(users.map(user => 
                    user.id === editingUser.id 
                        ? { ...user, roles: [...selectedRoles] } 
                        : user
                ));
                
                // Show success notification
                setNotification({
                    show: true,
                    message: `Roles updated for ${editingUser.username}`,
                    type: 'success'
                });
                
                // Close edit mode
                setEditingUser(null);
                
                // Auto-hide notification after 3 seconds
                setTimeout(() => {
                    setNotification({ show: false, message: '', type: '' });
                }, 3000);
            })
            .catch(error => {
                setNotification({
                    show: true,
                    message: 'Failed to update roles: ' + 
                        (error.response?.data?.message || error.message),
                    type: 'error'
                });
            });
    };

    const cancelEdit = () => {
        setEditingUser(null);
    };

    if (loading) {
        return (
            <div className="text-center py-10">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 mx-4" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management</h1>
            
            {notification.show && (
                <div className={`px-4 py-3 rounded relative mb-4 ${
                    notification.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 
                    'bg-red-100 border border-red-400 text-red-700'
                }`}>
                    <span className="block sm:inline">{notification.message}</span>
                </div>
            )}
            
            <div className="overflow-x-auto bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Username
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Roles
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {user.username}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {user.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingUser && editingUser.id === user.id ? (
                                        <div className="flex flex-wrap gap-2">
                                            {availableRoles.map(role => (
                                                <label key={role} className="inline-flex items-center mr-4">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-4 w-4 text-primary-600"
                                                        checked={selectedRoles.includes(role)}
                                                        onChange={() => handleRoleChange(role)}
                                                    />
                                                    <span className="ml-2 text-sm">{role.replace('ROLE_', '')}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles && user.roles.map(role => (
                                                <span 
                                                    key={role} 
                                                    className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800"
                                                >
                                                    {role.replace('ROLE_', '')}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {editingUser && editingUser.id === user.id ? (
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={handleUpdateRoles}
                                                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                                            >
                                                Save
                                            </button>
                                            <button 
                                                onClick={cancelEdit}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleEditUser(user)}
                                            className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                                        >
                                            Edit Roles
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;