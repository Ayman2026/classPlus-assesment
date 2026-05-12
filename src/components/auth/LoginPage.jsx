/**
 * LoginPage — stunning login screen with 3 auth options.
 * Features animated entrance, gradient mesh background, and floating circles.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, User, Globe } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useStore from '../../store/useStore';
import Button from '../ui/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail, loginAsGuest } = useAuth();
  const { userProfile } = useStore();
  const navigate = useNavigate();

  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
    // Navigation handled by auth state listener in App
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    await loginWithEmail(email, password, isSignUp);
    setLoading(false);
  };

  const handleGuest = async () => {
    setLoading(true);
    await loginAsGuest();
    setLoading(false);
  };

  return (
    <div
      className="gradient-mesh"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating decorative circles */}
      <div className="floating-circle" />
      <div className="floating-circle" />
      <div className="floating-circle" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: 440, zIndex: 1 }}
      >
        {/* Hero text */}
        <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 2.8rem)',
              color: 'var(--text)',
              marginBottom: 12,
              lineHeight: 1.15,
            }}
          >
            Send Love,{' '}
            <span style={{ color: 'var(--primary)' }}>Beautifully.</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 340, margin: '0 auto' }}>
            Create stunning personalized greeting cards in seconds and share joy with the world.
          </p>
        </motion.div>

        {/* Auth cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Google */}
          <motion.button
            variants={itemVariants}
            className="auth-option-card"
            onClick={handleGoogle}
            disabled={loading}
            id="login-google-btn"
          >
            <Globe size={24} color="#4285F4" />
            <span>Continue with Google</span>
          </motion.button>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <button
              className="auth-option-card"
              onClick={() => setShowEmail((p) => !p)}
              id="login-email-btn"
              style={{ width: '100%' }}
            >
              <Mail size={24} color="var(--primary)" />
              <span>Continue with Email</span>
            </button>

            {showEmail && (
              <motion.form
                className="email-form"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleEmail}
              >
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  id="login-email-input"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  id="login-password-input"
                />
                <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                  {isSignUp ? 'Sign Up' : 'Log In'}
                </Button>
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIsSignUp((p) => !p)}
                >
                  {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                </p>
              </motion.form>
            )}
          </motion.div>

          {/* Guest */}
          <motion.button
            variants={itemVariants}
            className="auth-option-card"
            onClick={handleGuest}
            disabled={loading}
            id="login-guest-btn"
          >
            <User size={24} color="var(--text-muted)" />
            <span>Continue as Guest</span>
          </motion.button>
        </div>

        <motion.p
          variants={itemVariants}
          style={{
            textAlign: 'center',
            marginTop: 32,
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          By continuing, you agree to our Terms of Service
        </motion.p>
      </motion.div>
    </div>
  );
}
