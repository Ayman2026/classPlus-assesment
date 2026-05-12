/**
 * PremiumModal — upsell popup for premium templates.
 * Shows plans, features, and a demo "Subscribe" button.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, X } from 'lucide-react';
import useStore from '../../store/useStore';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const plans = [
  { id: 'monthly', label: 'Monthly', price: '₹99/month', best: false },
  { id: 'yearly', label: 'Yearly', price: '₹599/year', best: true },
  { id: 'lifetime', label: 'Lifetime', price: '₹999 one-time', best: false },
];

const features = [
  '500+ Premium Templates',
  'No Watermark',
  'HD Download',
  'Early Access to New Designs',
];

export default function PremiumModal() {
  const { showPremiumModal, closePremiumModal, setPremium } = useStore();
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const handleSubscribe = () => {
    setPremium(true);
    toast.success('🎉 Premium unlocked! (Demo mode)');
    closePremiumModal();
  };

  const handleStartTrial = () => {
    setPremium(true);
    toast.success('✨ 7-Day Free Trial Started! (Demo mode)');
    closePremiumModal();
  };

  return (
    <AnimatePresence>
      {showPremiumModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePremiumModal}
        >
          <motion.div
            className="modal-content"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            id="premium-modal"
          >
            {/* Close button */}
            <button
              onClick={closePremiumModal}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                color: 'var(--text-muted)',
                zIndex: 10,
              }}
              id="premium-modal-close"
            >
              <X size={22} />
            </button>

            {/* Crown icon */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'var(--premium-badge)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <Crown size={28} color="#1A1A1A" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--secondary)' }}>
                Unlock Premium
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 6 }}>
                Get access to 500+ exclusive templates for festivals, love, and more.
              </p>
            </div>

            {/* Features */}
            <ul className="feature-list" style={{ marginBottom: 24 }}>
              {features.map((f) => (
                <li key={f}>
                  <Check size={18} />
                  {f}
                </li>
              ))}
            </ul>

            {/* Plan cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                  id={`plan-${plan.id}`}
                >
                  {plan.best && <div className="best-value">BEST VALUE</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>{plan.label}</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{plan.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Subscribe & Trial buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Button variant="gold" onClick={handleSubscribe} style={{ width: '100%' }} id="subscribe-btn">
                <Crown size={18} />
                Subscribe Now
              </Button>
              
              <Button variant="secondary" onClick={handleStartTrial} style={{ width: '100%' }} id="trial-btn">
                Start 7-Day Free Trial
              </Button>
            </div>

            {/* Maybe later */}
            <p
              onClick={closePremiumModal}
              style={{
                textAlign: 'center',
                marginTop: 16,
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
              id="premium-maybe-later"
            >
              Maybe Later
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
