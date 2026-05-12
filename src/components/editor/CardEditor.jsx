/**
 * CardEditor — full editor page with canvas preview and action controls.
 * Controls: Share, Download, and Back.
 */
import { useRef } from 'react';
import { Sparkles, Download, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import CanvasOverlay from './CanvasOverlay';
import Button from '../ui/Button';
import useCanvas from '../../hooks/useCanvas';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

export default function CardEditor({ template, onBack }) {
  const canvasRef = useRef(null);
  const { downloadCard } = useCanvas();
  const { userProfile, openShareModal } = useStore();

  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCard(canvasRef.current);
    toast.success('Card downloaded! 📥');
  };

  const handleShare = () => {
    openShareModal();
  };

  return (
    <div className="editor-layout">
      {/* Canvas preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ flex: '1 1 auto' }}
      >
        <CanvasOverlay
          template={template}
          userProfile={userProfile}
          canvasRef={canvasRef}
        />
      </motion.div>

      {/* Controls panel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          minWidth: 220,
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.3rem',
            marginBottom: 4,
          }}
        >
          Your Card is Ready!
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8 }}>
          Share this personalized greeting with your loved ones
        </p>

        <Button onClick={handleShare} id="editor-share-btn">
          <Sparkles size={18} />
          Share This Card
        </Button>

        <Button variant="secondary" onClick={handleDownload} id="editor-download-btn">
          <Download size={18} />
          Download
        </Button>

        <Button variant="secondary" onClick={onBack} id="editor-back-btn">
          <ArrowLeft size={18} />
          Back
        </Button>
      </motion.div>
    </div>
  );
}
