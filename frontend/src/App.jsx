import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import GoogleSuccess from './pages/GoogleSuccess';
import Dashboard from './pages/Dashboard';
import TaskManager from './pages/TaskManager';
import Reports from './pages/Reports';
import TimeTracking from './pages/TimeTracking';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ActivityRealtime from './pages/ActivityRealtime';

import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/google-success" element={<GoogleSuccess />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<TaskManager />} />
              <Route path="/time-tracking" element={<TimeTracking />} />
              <Route path="/activity-realtime" element={<ActivityRealtime />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/payroll" element={<Payroll />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </AuthProvider>
    </Router>
  );
}


export default App;
