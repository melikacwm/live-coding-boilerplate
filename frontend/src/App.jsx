import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Button from './components/Button';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UnitPage from './pages/UnitPage';
import TagihanPage from './pages/TagihanPage';
import PemilikPage from './pages/PemilikPage';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="navbar">
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/unit">Unit</Link>
        <Link to="/tagihan">Tagihan</Link>
        {user.role === 'admin' && <Link to="/pemilik">Pemilik</Link>}
      </div>
      <Button variant="secondary" onClick={handleLogout}>
        Keluar
      </Button>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/unit"
          element={
            <ProtectedRoute>
              <UnitPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tagihan"
          element={
            <ProtectedRoute>
              <TagihanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pemilik"
          element={
            <ProtectedRoute roles={['admin']}>
              <PemilikPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
