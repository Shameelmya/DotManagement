import { create } from 'zustand';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../services/firebase';

interface AuthState {
  user: any | null;
  loading: boolean;
  setUser: (user: any | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    const auth = getAuth(app);
    await signOut(auth);
    set({ user: null });
  },
}));
