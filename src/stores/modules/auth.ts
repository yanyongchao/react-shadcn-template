import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const initialState: Omit<AuthState, "setUser" | "logout"> = {
  user: { id: '1', name: "Admin", email: "admin@example.com" },
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user: User | null) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
        window.location.href = '/login';
      },
    }),
    { name: "app-auth" },
  ),
);
