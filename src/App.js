import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MachineList from './components/MachineList';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import UserManagement from './components/UserManagement';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import './App.css';

function App() {
  return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Landing Page */}
            <Route path="/" element={
              <>
                <Navbar />
                <LandingPage />
              </>
            } />

            {/* Protected routes - require authentication */}
            <Route element={<PrivateRoute />}>
              <Route path="/machines" element={
                <>
                  <Navbar />
                  <MachineList />
                </>
              } />
            </Route>

            {/* Admin-only routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={
                <>
                  <Navbar />
                  <UserManagement />
                </>
              } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;