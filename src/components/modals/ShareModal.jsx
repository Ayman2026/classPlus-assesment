/**
 * ShareModal — sharing options after card is ready.
 * Supports WhatsApp, Download, Copy Link, and native Web Share API.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Download, Copy, Share2 } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

export default function ShareModal({ canvasRef }) {
  const { showShareModal, closeShareModal } = useStore();

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      '🎉 Check out this personalized greeting card I made! Made with GreetWish App'
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const handleDownload = () => {
    if (!canvasRef?.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'greeting_card.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
    toast.success('Card downloaded! 📥');
  };

  const handleCopyLink = () => {
    const mockUrl = `https://greetwish.app/card/${Date.now()}`;
    navigator.clipboard.writeText(mockUrl).then(() => {
      toast.success('Link copied to clipboard! 🔗');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      toast.error('Native sharing not supported on this device');
      return;
    }

    try {
      let shareData = {
        title: 'GreetWish Card',
        text: '🎉 Check out this personalized greeting card I made!',
        url: window.location.href,
      };

      // Try to share the actual image if possible
      if (canvasRef?.current) {
        const blob = await new Promise((resolve) =>
          canvasRef.current.toBlob(resolve, 'image/png')
        );
        if (blob) {
          const file = new File([blob], 'greeting_card.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            shareData.files = [file];
          }
        }
      }

      await navigator.share(shareData);
      toast.success('Shared successfully! 🎉');
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error('Share cancelled');
      }
    }
  };

  const shareOptions = [
    { id: 'whatsapp', label: 'Share on WhatsApp', icon: MessageCircle, color: '#25D366', onClick: handleWhatsApp },
    { id: 'download', label: 'Download as Image', icon: Download, color: 'var(--primary)', onClick: handleDownload },
    { id: 'copy', label: 'Copy Link', icon: Copy, color: '#6B7280', onClick: handleCopyLink },
    { id: 'native', label: 'More Options...', icon: Share2, color: '#3B82F6', onClick: handleNativeShare },
  ];

  return (
    <AnimatePresence>
      {showShareModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeShareModal}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            id="share-modal"
          >
            {/* Close button */}
            <button
              onClick={closeShareModal}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                color: 'var(--text-muted)',
              }}
              id="share-modal-close"
            >
              <X size={22} />
            </button>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                marginBottom: 6,
              }}
            >
              Share Your Card
            </h2>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                marginBottom: 24,
              }}
            >
              Spread the joy with your loved ones
            </p>

            {/* Share buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {shareOptions.map((opt) => (
                <button
                  key={opt.id}
                  className="share-btn"
                  onClick={opt.onClick}
                  id={`share-${opt.id}`}
                >
                  <opt.icon size={20} color={opt.color} />
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
