/**
 * useAuth hook — manages Firebase authentication state.
 * Falls back to demo mode when Firebase isn't configured with real credentials.
 */
import { useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

/**
 * Check if Firebase is configured with real credentials.
 */
const isFirebaseConfigured = () => {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return key && key !== 'demo-api-key' && key.length > 10;
};

/**
 * Fetch user profile from Firestore; returns null if not found.
 */
const fetchUserProfile = async (uid) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) return snap.data();
    return null;
  } catch {
    return null;
  }
};

const useAuth = () => {
  const { setUser, setUserProfile, setAuthLoading, clearStore } = useStore();

  /* Listen for auth state changes on mount */
  useEffect(() => {
    // If Firebase isn't configured, skip the auth listener and just mark as not loading
    if (!isFirebaseConfigured()) {
      // Check if there's a demo user stored in sessionStorage
      const demoUser = sessionStorage.getItem('demoUser');
      const demoProfile = sessionStorage.getItem('demoProfile');
      if (demoUser && demoProfile) {
        setUser(JSON.parse(demoUser));
        setUserProfile(JSON.parse(demoProfile));
      }
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const profile = await fetchUserProfile(firebaseUser.uid);
        if (profile) setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Google Sign-In */
  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured()) {
      // Demo mode: simulate Google login
      const demoUser = { uid: 'demo-google-user', email: 'demo@gmail.com' };
      const demoProfile = {
        displayName: 'Google User',
        photoURL: '',
        profileComplete: false,
      };
      setUser(demoUser);
      setUserProfile(demoProfile);
      sessionStorage.setItem('demoUser', JSON.stringify(demoUser));
      sessionStorage.setItem('demoProfile', JSON.stringify(demoProfile));
      toast.success('Welcome! 🎉 (Demo Mode)');
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { uid, displayName, photoURL } = result.user;
      const existing = await fetchUserProfile(uid);
      if (!existing) {
        const profile = {
          displayName: displayName || 'User',
          photoURL: photoURL || '',
          profileComplete: !!displayName,
        };
        try {
          await setDoc(doc(db, 'users', uid), profile);
        } catch {
          /* Firestore may not be configured */
        }
        setUserProfile(profile);
      } else {
        setUserProfile(existing);
      }
      toast.success('Welcome! 🎉');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Google sign-in failed');
    }
  };

  /** Email / Password */
  const loginWithEmail = async (email, password, isSignUp = false) => {
    if (!isFirebaseConfigured()) {
      // Demo mode: simulate email login
      const demoUser = { uid: 'demo-email-user', email };
      const demoProfile = {
        displayName: email.split('@')[0],
        photoURL: '',
        profileComplete: false,
      };
      setUser(demoUser);
      setUserProfile(demoProfile);
      sessionStorage.setItem('demoUser', JSON.stringify(demoUser));
      sessionStorage.setItem('demoProfile', JSON.stringify(demoProfile));
      toast.success(isSignUp ? 'Account created! 🎉 (Demo)' : 'Welcome back! 👋 (Demo)');
      return;
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created! 🎉');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back! 👋');
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.code === 'auth/wrong-password'
          ? 'Wrong password — try again'
          : err.code === 'auth/user-not-found'
          ? 'No account found — sign up first'
          : err.code === 'auth/email-already-in-use'
          ? 'Email already in use'
          : err.message;
      toast.error(msg);
    }
  };

  /** Guest / Anonymous */
  const loginAsGuest = async () => {
    if (!isFirebaseConfigured()) {
      // Demo mode: simulate guest login
      const demoUser = { uid: 'demo-guest-user', isAnonymous: true };
      const demoProfile = {
        displayName: 'Guest User',
        photoURL: '',
        profileComplete: false,
      };
      setUser(demoUser);
      setUserProfile(demoProfile);
      sessionStorage.setItem('demoUser', JSON.stringify(demoUser));
      sessionStorage.setItem('demoProfile', JSON.stringify(demoProfile));
      toast.success('Signed in as Guest 👤 (Demo Mode)');
      return;
    }

    try {
      const result = await signInAnonymously(auth);
      const profile = {
        displayName: 'Guest User',
        photoURL: '',
        profileComplete: false,
      };
      try {
        await setDoc(doc(db, 'users', result.user.uid), profile);
      } catch {
        /* Firestore may not be configured */
      }
      setUserProfile(profile);
      toast.success('Signed in as Guest 👤');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Guest login failed');
    }
  };

  /** Logout */
  const logout = async () => {
    if (!isFirebaseConfigured()) {
      sessionStorage.removeItem('demoUser');
      sessionStorage.removeItem('demoProfile');
      clearStore();
      toast.success('Logged out');
      return;
    }

    try {
      await signOut(auth);
      clearStore();
      toast.success('Logged out');
    } catch {
      toast.error('Logout failed');
    }
  };

  return { loginWithGoogle, loginWithEmail, loginAsGuest, logout };
};

export default useAuth;
