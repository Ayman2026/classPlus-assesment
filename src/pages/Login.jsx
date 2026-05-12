/**
 * Login page wrapper.
 * Redirects to /home if user is already authenticated.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import LoginPage from '../components/auth/LoginPage';

export default function Login() {
  const { user, authLoading } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/home', { replace: true });
    }
  }, [user, authLoading, navigate]);

  return <LoginPage />;
}
