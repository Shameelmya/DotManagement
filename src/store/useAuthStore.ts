import { create } from 'zustand';
import { getAuth, signOut, User as FirebaseUser } from 'firebase/auth';
import { app } from '../services/firebase';
import type { User } from '../types';

interface AuthState {
  user: FirebaseUser | null;
  profile: User | null;
  loading: boolean;
  setUser: (user: FirebaseUser | null, profile?: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user, profile = null) => set({ user, profile: profile as any }), // as any here for fallback to user if profile not passed
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    const auth = getAuth(app);
    await signOut(auth);
    set({ user: null, profile: null });
  },
}));
