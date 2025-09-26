import { create } from "zustand";
import { persist } from "zustand/middleware";
import { checkToken, login, loginFacebook, loginGoogle } from "@/api/authApi";
import { clearAuth, getToken, saveAuth } from "@/libs/local-storage";
import { AuthResponse, User } from "@/types";

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  authenticated: boolean;
  loading: boolean;
  error: string | null;
  hydrated: boolean; 

  // Actions
  setAccessToken: (token: string) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  
  // Async Actions
  doLogin: (credentials: { username: string; password: string }) => Promise<void>;
  doLoginGoogle: (idToken: string) => Promise<void>;
  doLoginFacebook: (accessToken: string) => Promise<void>;
  doCheckToken: () => Promise<void>;
  logout: () => void;
  
  // Utilities
  reset: () => void;
  initializeAuth: () => void;
}

const initialState = {
  user: null,
  accessToken: getToken() || null,
  authenticated: false,
  loading: false,
  error: null,
  hydrated: false
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Basic setters
      setAccessToken: (token: string) => {
        localStorage.setItem("accessToken", token);
        set({ accessToken: token });
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setAuthenticated: (authenticated: boolean) => {
        set({ authenticated });
      },

      // Async login action
      doLogin: async (credentials: { username: string; password: string }) => {
        set({ loading: true, error: null });
        
        try {
          const response: AuthResponse = await login(credentials);
          if (!response || !response.data.token || !response.data.user) {
            throw new Error("Login failed. Invalid response from server.");
          }
          
          const { token, user } = response.data;
          saveAuth(token, user);
          
          set({
            user,
            accessToken: token,
            authenticated: true,
            loading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : "Đăng nhập thất bại, vui lòng kiểm tra lại.";
          
          set({
            loading: false,
            error: errorMessage,
            authenticated: false,
            user: null,
            accessToken: null,
          });
          
          throw error; // Re-throw for component handling
        }
      },

      // Google login
      doLoginGoogle: async (idToken: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await loginGoogle({ idToken });
          
          if (!response || !response.data.token || !response.data.user) {
            throw new Error("Google Login failed. Invalid response from server.");
          }
          
          const { token, user } = response.data;
          saveAuth(token, user);
          
          set({
            user,
            accessToken: token,
            authenticated: true,
            loading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : "Google Login failed.";
          
          set({
            loading: false,
            error: errorMessage,
            authenticated: false,
            user: null,
            accessToken: null,
          });
          
          throw error;
        }
      },

      // Facebook login
      doLoginFacebook: async (accessToken: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await loginFacebook({ accessToken });
          
          if (!response || !response.data.token || !response.data.user) {
            throw new Error("Facebook Login failed. Invalid response from server.");
          }
          
          const { token, user } = response.data;
          saveAuth(token, user);
          
          set({
            user,
            accessToken: token,
            authenticated: true,
            loading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : "Facebook Login failed.";
          
          set({
            loading: false,
            error: errorMessage,
            authenticated: false,
            user: null,
            accessToken: null,
          });
          
          throw error;
        }
      },

      // Check token validity
      doCheckToken: async () => {
        const token = getToken();
        if (!token) {
          set({ authenticated: false, user: null, accessToken: null });
          return;
        }

        try {
          const response = await checkToken();
          const valid = response?.valid;

          if (valid) {
            // Restore user from localStorage if token is valid
            const savedUser = localStorage.getItem("auth-storage");
            if (savedUser) {
              const user = JSON.parse(savedUser);
              set({
                authenticated: true,
                user,
                accessToken: token,
              });
            } else {
              set({ authenticated: true });
            }
          } else {
            // Token invalid
            clearAuth();
            set({
              authenticated: false,
              user: null,
              accessToken: null,
            });
          }
        } catch (error) {
          // Token verification failed
          clearAuth();
          set({
            authenticated: false,
            user: null,
            accessToken: null,
          });
        }
      },

      // Logout
      logout: () => {
        clearAuth();
        set({
          user: null,
          accessToken: null,
          authenticated: false,
          error: null,
        });
      },

      // Reset all state
      reset: () => {
        clearAuth();
        set(initialState);
      },

      initializeAuth: () => {
        set({ loading: true, hydrated: false });
      
        const token = getToken();
        const savedUser = localStorage.getItem("auth-storage");
        console.log(token, savedUser)
      
        if (token && savedUser) {
          try {
            const state = JSON.parse(savedUser);
            const { user } = state;
      
            set({
              accessToken: token,
              user,
              authenticated: true,
              loading: false, 
              hydrated: true,
            });
      
            get().doCheckToken();
          } catch (error) {
            clearAuth();
            set({ ...initialState, loading: false });
          }
        } else {
          set({ authenticated: false, loading: false, hydrated: true });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        authenticated: state.authenticated,
      }),

      skipHydration: true,
    }
  )
);
