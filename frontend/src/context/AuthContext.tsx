import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi } from '../services/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('mealprep_token'),
  );
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('mealprep_token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi
      .me()
      .then((data) => {
        setUser(data as User);
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, logout]);

  const login = async (email: string, password: string) => {
    const result = (await authApi.login({ email, password })) as {
      user: User;
      token: string;
    };
    localStorage.setItem('mealprep_token', result.token);
    setToken(result.token);
    setUser(result.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const result = (await authApi.register({ email, password, name })) as {
      user: User;
      token: string;
    };
    localStorage.setItem('mealprep_token', result.token);
    setToken(result.token);
    setUser(result.user);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
