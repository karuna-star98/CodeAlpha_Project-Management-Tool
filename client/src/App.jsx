import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import { Login, Register } from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectBoard from './pages/ProjectBoard';
import TaskDetails from './pages/TaskDetails';
import Profile from './pages/Profile';

export default function App() {
  return <AuthProvider><BrowserRouter><Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectBoard />} />
        <Route path="/tasks/:taskId" element={<TaskDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Route>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes></BrowserRouter></AuthProvider>;
}
