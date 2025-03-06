import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/AuthService';

const AdminRoute = () => {
    const isAuthenticated = AuthService.isAuthenticated();
    const isAdmin = AuthService.isAdmin();

    return isAuthenticated && isAdmin ? (
        <Outlet />
    ) : (
        <Navigate to="/machines" />
    );
};

export default AdminRoute;