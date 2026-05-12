/**
 * CategoryFilter — horizontal scrollable pill bar for template categories.
 */
import { useRef } from 'react';
import { CATEGORIES } from '../../lib/templates';
import useStore from '../../store/useStore';

export default function CategoryFilter() {
  const { activeCategory, setActiveCategory } = useStore();
  const scrollRef = useRef(null);

  return (
    <div
      ref={scrollRef}
      className="hide-scrollbar"
      style={{
        display: 'flex',
        gap: 10,
        overflowX: 'auto',
        padding: '0 4px 16px 4px',
      }}
      id="category-filter"
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
          onClick={() => setActiveCategory(cat.id)}
          id={`category-${cat.id}`}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
