import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Navbar = () => {
    const navigate = useNavigate();
    const currentUser = AuthService.getCurrentUser();
    const isAdmin = AuthService.isAdmin();

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-primary-600 to-primary-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 flex items-center">
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                            </svg>
                            <Link to="/machines" className="ml-2 text-white text-xl font-semibold">Machine Manager</Link>
                        </div>

                        {/* Main Navigation Links */}
                        <div className="flex space-x-4">
                            <Link
                                to="/machines"
                                className="text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Machines
                            </Link>

                            {/* Admin-only Links */}
                            {isAdmin && (
                                <Link
                                    to="/admin/users"
                                    className="text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    User Management
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* User Status and Actions */}
                    {currentUser && (
                        <div className="flex items-center">
                            <div className="text-white mr-4 text-sm">
                                <span className="block">Welcome, {currentUser.username || 'User'}</span>
                                {currentUser.roles && currentUser.roles.includes('ROLE_ADMIN') && (
                                    <span className="text-xs text-yellow-300">Administrator</span>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;