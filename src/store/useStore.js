/**
 * Zustand store for global application state.
 * Manages user auth, profile, template selection, modals, and active category.
 */
import { create } from 'zustand';

const useStore = create((set) => ({
  // Auth state
  user: null,
  userProfile: null,
  authLoading: true,

  // Subscription state
  isPremium: false,

  // Modals
  showPremiumModal: false,
  showShareModal: false,

  // Category filter
  activeCategory: 'all',

  // Actions
  setUser: (user) => set({ user }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setAuthLoading: (authLoading) => set({ authLoading }),
  setPremium: (isPremium) => set({ isPremium }),
  setSelectedTemplate: (selectedTemplate) => set({ selectedTemplate }),

  openPremiumModal: () => set({ showPremiumModal: true }),
  closePremiumModal: () => set({ showPremiumModal: false }),

  openShareModal: () => set({ showShareModal: true }),
  closeShareModal: () => set({ showShareModal: false }),

  setActiveCategory: (activeCategory) => set({ activeCategory }),

  // Clear all state on logout
  clearStore: () =>
    set({
      user: null,
      userProfile: null,
      selectedTemplate: null,
      showPremiumModal: false,
      showShareModal: false,
      activeCategory: 'all',
    }),
}));

export default useStore;
