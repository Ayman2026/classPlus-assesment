/**
 * Navbar — desktop top navigation bar.
 * Shows logo on the left, user avatar + name on the right with a logout dropdown.
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';
import useAuth from '../../hooks/useAuth';
import Badge from '../ui/Badge';

export default function Navbar() {
  const { userProfile, isPremium } = useStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        onClick={() => navigate('/home')}
      >
        <Sparkles size={26} color="var(--primary)" />
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.35rem',
            fontWeight: 700,
            color: 'var(--text)',
          }}
        >
          Greet<span style={{ color: 'var(--primary)' }}>Wish</span>
        </span>
      </div>

      {/* User section */}
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen((p) => !p)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            background: '#f5f5f5',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          id="navbar-user-menu"
        >
          {userProfile?.photoURL ? (
            <img
              src={userProfile.photoURL}
              alt="avatar"
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {(userProfile?.displayName || 'U')[0].toUpperCase()}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: 120 }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
              {userProfile?.displayName || 'User'}
            </span>
            {isPremium && <Badge variant="premium">PRO</Badge>}
          </div>
          <ChevronDown size={16} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              className="dropdown-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <button className="dropdown-item" onClick={handleLogout} id="navbar-logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
