/**
 * TemplateGrid — responsive grid of template cards.
 * Filters by active category, handles click to navigate or show premium modal.
 */
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { getTemplatesByCategory } from '../../lib/templates';
import useStore from '../../store/useStore';
import TemplateCard from './TemplateCard';

export default function TemplateGrid() {
  const { activeCategory, openPremiumModal, setSelectedTemplate, isPremium } = useStore();
  const navigate = useNavigate();

  const filtered = getTemplatesByCategory(activeCategory);

  const handleClick = (template) => {
    setSelectedTemplate(template);
    if (template.isPremium && !isPremium) {
      openPremiumModal();
    } else {
      navigate(`/editor/${template.id}`);
    }
  };

  return (
    <div className="template-grid" id="template-grid">
      <AnimatePresence mode="popLayout">
        {filtered.map((t) => (
          <TemplateCard key={t.id} template={t} onClick={() => handleClick(t)} />
        ))}
      </AnimatePresence>
    </div>
  );
}
