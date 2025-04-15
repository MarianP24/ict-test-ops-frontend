import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Navbar = () => {
    const navigate = useNavigate();
    const currentUser = AuthService.getCurrentUser();
    const isAdmin = AuthService.isAdmin();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                            <Link to="/" className="ml-2 text-white text-xl font-semibold">Test Ops</Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex space-x-4">
                            {/* Dropdown Menu */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                >
                                    Hub
                                    <svg
                                        className={`ml-2 h-4 w-4 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Content */}
                                {dropdownOpen && (
                                    <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu" aria-orientation="vertical">
                                            <Link
                                                to="/machines"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Machines
                                            </Link>
                                            <Link
                                                to="/fixtures"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Fixtures
                                            </Link>
                                            <Link
                                                to="/vpn-servers"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                VPN Servers
                                            </Link>
                                            <Link
                                                to="/site-map"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Site Map
                                            </Link>
                                            <div className="border-t border-gray-200 my-1"></div>
                                            <Link
                                                to="/application-service"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Application Service
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

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

                    {/* User Status, Branding and Actions */}
                    <div className="flex items-center">
                        {/* Forvia Hella Branding Image */}
                        <div className="flex items-center h-10 px-2 mr-4 bg-white bg-opacity-10 rounded-md">
                            <img
                                src="/images/navbar/navbar-image.png"
                                alt="Forvia Hella"
                                className="h-6 object-contain rounded filter drop-shadow-sm"
                                style={{
                                    transition: "all 0.2s ease",
                                }}
                                onMouseOver={(e) => {e.target.style.opacity = "0.9"}}
                                onMouseOut={(e) => {e.target.style.opacity = "1"}}
                            />
                        </div>

                        {currentUser && (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;