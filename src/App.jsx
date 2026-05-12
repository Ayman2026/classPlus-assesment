/**
 * App.jsx — root component.
 * Sets up routing with ProtectedRoute, auth state listener, and global providers.
 */
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useStore from './store/useStore';
import useAuth from './hooks/useAuth';
import Loader from './components/ui/Loader';
import Login from './pages/Login';
import Home from './pages/Home';
import Editor from './pages/Editor';
import ProfileSetup from './components/auth/ProfileSetup';

/**
 * ProtectedRoute — redirects to /login if user is not authenticated.
 * Also redirects to /profile-setup if the user profile is incomplete.
 */
function ProtectedRoute() {
  const { user, userProfile, authLoading } = useStore();

  if (authLoading) {
    return <Loader message="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If profile is not complete and we're not already on the setup page, redirect
  if (!userProfile?.profileComplete && window.location.pathname !== '/profile-setup') {
    return <Navigate to="/profile-setup" replace />;
  }

  return <Outlet />;
}

export default function App() {
  // Initialize auth listener on mount
  useAuth();

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'var(--font-body)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 20px',
            fontWeight: 500,
          },
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/editor/:templateId" element={<Editor />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
