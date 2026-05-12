/**
 * BottomNav — mobile-only fixed bottom navigation bar.
 * Shows Home, Categories (scrolls to filter), and Profile icons.
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, User } from 'lucide-react';

const items = [
  { id: 'home', label: 'Home', icon: Home, path: '/home' },
  { id: 'categories', label: 'Categories', icon: LayoutGrid, path: '/home' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile-setup' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bottom-nav" id="bottom-nav" style={{ display: 'none' }}>
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.id}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            id={`bottom-nav-${item.id}`}
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Show only on mobile via CSS */}
      <style>{`
        @media (max-width: 767px) {
          #bottom-nav { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
