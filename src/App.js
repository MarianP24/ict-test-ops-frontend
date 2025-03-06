import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookList from './components/BookList';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import UserManagement from './components/UserManagement';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Standard user routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/books" element={
                <>
                  <Navbar />
                  <BookList />
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

            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="*" element={<Navigate to="/books" replace />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;