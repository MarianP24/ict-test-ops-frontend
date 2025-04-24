import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MachineList from './components/Machines/MachineList';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import UserManagement from './components/UserManagement';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import './App.css';
import FixtureList from "./components/Fixtures/FixtureList";
import ApplicationPage from "./components/Application/ApplicationPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VpnServerList from "./components/VpnServers/VpnServerList";
import SiteMap from "./components/SiteMap/SiteMap";

function App() {
  return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ToastContainer
              position="top-right"
              autoClose={1500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
          />
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

              <Route path="/fixtures" element={
                <>
                  <Navbar />
                  <FixtureList />
                </>
              } />

              <Route path="/vpn-servers" element={
                <>
                  <Navbar />
                  <VpnServerList />
                </>
              } />

              <Route path="/application-service" element={
                <>
                  <Navbar />
                  <ApplicationPage />
                </>
              } />

              <Route path="/site-map" element={
                <>
                  <Navbar />
                  <SiteMap />
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