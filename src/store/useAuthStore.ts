import { create } from 'zustand';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../services/firebase';

interface AuthState {
  user: any | null;
  profile: any | null;
  loading: boolean;
  setUser: (user: any | null, profile?: any | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user, profile = null) => set({ user, profile: profile || user }),
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    const auth = getAuth(app);
    await signOut(auth);
    set({ user: null, profile: null });
  },
}));
