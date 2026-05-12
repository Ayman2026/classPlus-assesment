/**
 * HomePage — main content area combining CategoryFilter + TemplateGrid.
 * Also renders section headers.
 */
import CategoryFilter from './CategoryFilter';
import TemplateGrid from './TemplateGrid';
import useStore from '../../store/useStore';
import { Flame } from 'lucide-react';

export default function HomePage() {
  const { activeCategory } = useStore();

  return (
    <div style={{ padding: '24px 16px' }}>
      {/* Category filter */}
      <CategoryFilter />

      {/* Section heading */}
      {activeCategory === 'all' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
          }}
        >
          <Flame size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>
            Trending Today
          </h2>
        </div>
      )}

      {activeCategory !== 'all' && (
        <h2
          style={{
            fontSize: '1.3rem',
            fontFamily: 'var(--font-heading)',
            marginBottom: 20,
            textTransform: 'capitalize',
          }}
        >
          {activeCategory} Templates
        </h2>
      )}

      {/* Grid */}
      <TemplateGrid />
    </div>
  );
}
