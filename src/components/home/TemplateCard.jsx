/**
 * TemplateCard — individual card in the template grid.
 * Shows background image with user's avatar overlay, name strip, and free/premium badge.
 */
import { motion } from 'framer-motion';
import { useState } from 'react';
import Badge from '../ui/Badge';
import useStore from '../../store/useStore';

export default function TemplateCard({ template, onClick }) {
  const { userProfile } = useStore();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      className="template-card"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ aspectRatio: '4/5' }}
      id={`template-card-${template.id}`}
    >
      {/* Skeleton while loading */}
      {!imgLoaded && (
        <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />
      )}

      {/* Background image */}
      <img
        src={template.imageUrl}
        alt={`${template.category} template`}
        onLoad={() => setImgLoaded(true)}
        style={{
          opacity: imgLoaded ? 1 : 0,
          transition: 'opacity 0.3s',
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Name strip overlay at top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '8px 12px',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* User avatar mini */}
        {userProfile?.photoURL ? (
          <img
            src={userProfile.photoURL}
            alt="avatar"
            className="avatar-circle"
            style={{ width: 28, height: 28, flexShrink: 0 }}
          />
        ) : (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--primary)',
              border: '2px solid #fff',
              boxShadow: '0 0 0 2px var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {(userProfile?.displayName || 'U')[0].toUpperCase()}
          </div>
        )}
        <span
          style={{
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {userProfile?.displayName || 'Your Name'}
        </span>
      </div>

      {/* Badge */}
      <div style={{ position: 'absolute', top: 8, right: 8 }}>
        <Badge variant={template.isPremium ? 'premium' : 'free'}>
          {template.isPremium ? 'PRO' : 'Free'}
        </Badge>
      </div>
    </motion.div>
  );
}
