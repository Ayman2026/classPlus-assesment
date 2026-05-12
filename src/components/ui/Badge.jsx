/**
 * Badge component — renders Free or Premium status badges.
 * @param {{ variant: 'free' | 'premium', children: React.ReactNode }} props
 */
import { Crown } from 'lucide-react';

export default function Badge({ variant = 'free', children }) {
  return (
    <span className={`badge ${variant === 'premium' ? 'badge-premium' : 'badge-free'}`}>
      {variant === 'premium' && <Crown size={12} />}
      {children}
    </span>
  );
}
