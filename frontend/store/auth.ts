// ========================================
// AUTH STORE (Zustand)
// ========================================
// Global state for authentication

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * WHAT IS THIS?
 * Zustand creates a global state that any component can access
 * 
 * Think of it like:
 * - A global variable that React components can read/write
 * - When it changes, components automatically re-render
 * - Simpler than Redux!
 */

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  createdAt?: string;
}

interface AuthState {
  // STATE
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  
  // ACTIONS (functions to modify state)
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setHasHydrated: (state: boolean) => void;
}

/**
 * CREATE STORE
 * 
 * persist() saves to localStorage
 * So user stays logged in after page refresh
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      // Set authentication (after login/register)
      setAuth: (user, token) => {
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update state
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      // Logout
      logout: () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Clear state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // Update user info
      updateUser: (userData) =>
        set((state) => {
          const updatedUser = state.user ? { ...state.user, ...userData } : null;
          // Also update localStorage
          if (updatedUser) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          return {
            user: updatedUser,
          };
        }),
      
      // Set hydration state
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

/**
 * HOW TO USE IN COMPONENTS:
 * 
 * import { useAuthStore } from '@/store/auth';
 * 
 * function MyComponent() {
 *   const { user, isAuthenticated, logout } = useAuthStore();
 *   
 *   if (!isAuthenticated) {
 *     return <div>Please login</div>;
 *   }
 *   
 *   return <div>Welcome {user?.name}!</div>;
 * }
 */
