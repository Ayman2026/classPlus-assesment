/**
 * ProfileSetup — captures user's display name and profile picture.
 * Uploads avatar to Firebase Storage, saves profile to Firestore.
 * Falls back to local state if Firebase isn't configured.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, ArrowRight } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import useStore from '../../store/useStore';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

export default function ProfileSetup() {
  const { user, setUserProfile } = useStore();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);

    let photoURL = '';

    // Skip Firebase network calls if in Demo Mode
    const isDemoMode = import.meta.env.VITE_FIREBASE_API_KEY === 'demo-api-key' || !import.meta.env.VITE_FIREBASE_API_KEY;

    // Try to upload to Firebase Storage
    if (!isDemoMode && photoFile && user?.uid) {
      try {
        const storageRef = ref(storage, `profiles/${user.uid}/avatar.jpg`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      } catch (err) {
        console.error("Storage error:", err);
        photoURL = photoPreview;
      }
    } else if (photoPreview) {
      photoURL = photoPreview;
    }

    const profile = {
      displayName: displayName.trim(),
      photoURL,
      profileComplete: true,
    };

    // Try to save to Firestore
    if (!isDemoMode && user?.uid) {
      try {
        await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
      } catch (err) {
        console.error("Firestore error:", err);
      }
    }

    setUserProfile(profile);
    
    // Save to sessionStorage for persistence in demo mode
    sessionStorage.setItem('demoProfile', JSON.stringify(profile));

    toast.success('Profile saved! 🎉');
    setLoading(false);
    navigate('/home');
  };

  return (
    <div
      className="gradient-mesh"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: 440, padding: 40 }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.8rem',
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          Set Up Your Profile
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            marginBottom: 32,
            fontSize: '0.95rem',
          }}
        >
          Your name and photo will appear on every card you create
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {/* Avatar upload */}
          <label className="avatar-upload" htmlFor="avatar-input" id="profile-avatar-upload">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" />
            ) : (
              <Camera size={32} color="var(--text-muted)" />
            )}
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: -12 }}>
            Tap to upload photo
          </p>

          {/* Name input */}
          <input
            type="text"
            placeholder="Your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            id="profile-name-input"
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: 'var(--radius-sm)',
              border: '2px solid #e0e0e0',
              background: '#fff',
              fontSize: '1rem',
              transition: 'border-color 0.2s',
            }}
          />

          <Button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Saving...' : 'Continue'}
            <ArrowRight size={18} />
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
